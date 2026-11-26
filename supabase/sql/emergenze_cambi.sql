-- Registro dei cambi turno segnati nell'app (riga «Segna un cambio» della scheda Turni)
-- e collegamento ai turni personali di Daniele (tabella turni del Cruscotto → calendario iCloud «Lavoro»).
-- Già applicato al progetto Supabase del Cruscotto (migrazioni emergenze_cambi, emergenze_cambi_verso_turni).

create table public.emergenze_cambi (
  id bigint generated always as identity primary key,
  gruppo uuid not null,              -- uno scambio = due righe con lo stesso gruppo
  mese text not null, g int not null,
  t text not null check (t in ('m','p','n','nn','rm','rp','rn')),
  i int not null default -1,         -- posizione nella cella al momento del cambio
  pos text,                          -- postazione (F1, A, TVR…) se mattina/pomeriggio
  da text not null, a text not null,
  autore text, ip_hash text,
  creato_il timestamptz not null default now(),
  annullato_il timestamptz, annullato_autore text
);
alter table public.emergenze_cambi enable row level security;  -- solo service role (edge function)

alter table public.turni add column cambio_app bigint;          -- id del cambio dell'app che ha toccato la riga
alter table public.turni add column cambio_app_prima jsonb;     -- stato precedente, per l'annullamento
-- turni.fonte ammette anche 'app'

create or replace function public.emergenze_cambi_verso_turni() returns trigger
language plpgsql security definer set search_path = public as $$
declare
  io constant text := 'VR';
  d date := make_date(split_part(new.mese, '-', 1)::int, split_part(new.mese, '-', 2)::int, new.g);
  post text;
  pref text;
  r public.turni;
  firma text := coalesce(new.autore, 'non firmato');
  comando text;
begin
  if new.da <> io and new.a <> io then return new; end if;
  post := case new.t
    when 'm' then 'M-' || case when new.pos in ('F1','F2','A','B','L') then new.pos else 'F1' end
    when 'p' then 'P-' || case when new.pos in ('TVR','F1','F2','A','B','L') then new.pos else 'F1' end
    when 'n' then 'N' when 'nn' then 'NT' when 'rm' then 'R-M' when 'rp' then 'R-P' when 'rn' then 'R-N' end;
  pref := case new.t when 'm' then 'M-%' when 'p' then 'P-%' else post end;

  if tg_op = 'INSERT' then
    if new.da = io then
      select * into r from public.turni where data = d and postazione like pref and not ceduto
        order by (postazione = post) desc limit 1;
      if found then
        update public.turni set ceduto = true, cambio = true, cambio_app = new.id,
          cambio_app_prima = jsonb_build_object('ceduto', r.ceduto, 'cambio', r.cambio, 'nota', r.nota, 'cambio_app', r.cambio_app),
          nota = 'ceduto a ' || new.a || ' (cambio segnato nell''app da ' || firma || ')'
        where id = r.id;
      end if;
    else
      select * into r from public.turni where data = d and postazione = post;
      if found then
        update public.turni set ceduto = false, cambio = true, cambio_app = new.id,
          cambio_app_prima = jsonb_build_object('ceduto', r.ceduto, 'cambio', r.cambio, 'nota', r.nota, 'cambio_app', r.cambio_app),
          nota = 'cambio con ' || new.da || ' (segnato nell''app da ' || firma || ')'
        where id = r.id;
      else
        insert into public.turni (data, postazione, aggiuntiva, cambio, ceduto, nota, fonte, cambio_app)
        values (d, post, false, true, false, 'cambio con ' || new.da || ' (segnato nell''app da ' || firma || ')', 'app', new.id);
      end if;
    end if;
  elsif tg_op = 'UPDATE' and old.annullato_il is null and new.annullato_il is not null then
    delete from public.turni where cambio_app = new.id and fonte = 'app' and cambio_app_prima is null;
    update public.turni set
      ceduto = (cambio_app_prima->>'ceduto')::boolean, cambio = (cambio_app_prima->>'cambio')::boolean,
      nota = cambio_app_prima->>'nota', cambio_app = (cambio_app_prima->>'cambio_app')::bigint, cambio_app_prima = null
    where cambio_app = new.id and cambio_app_prima is not null;
  else
    return new;
  end if;

  -- Aggiorna subito il calendario iCloud (stessa chiamata del job ogni 30 minuti)
  select command into comando from cron.job where jobname = 'turni-icloud-sync';
  if comando is not null then begin execute comando; exception when others then raise warning 'sync iCloud non avviata: %', sqlerrm; end; end if;
  return new;
end $$;

create trigger emergenze_cambi_verso_turni
after insert or update of annullato_il on public.emergenze_cambi
for each row execute function public.emergenze_cambi_verso_turni();

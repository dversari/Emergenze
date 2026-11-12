#!/usr/bin/env python3
"""Aggiunge una voce alla sezione Riunioni (public/r/, file cifrati AES-256-GCM).

La chiave NON sta nel repository: passarla nella variabile d'ambiente RIUNIONI_KEY (base64),
letta da Supabase (emergenze_config, chiave 'chiave_riunioni').

Uso:
  RIUNIONI_KEY=... python3 -I scripts/riunioni.py elenco
  RIUNIONI_KEY=... python3 -I scripts/riunioni.py aggiungi voce.json [allegato1 allegato2 ...]

voce.json: {"id": "<threadId Gmail>", "data": "AAAA-MM-GG", "tipo": "riunione"|"comunicazione",
            "titolo": "...", "descrizione": "...", "testo": "...",
            "nomi_allegati": ["Nome leggibile.pdf", ...]}   # stesso ordine dei file passati
Se l'id esiste già, la voce viene sostituita (gli allegati già cifrati restano se non se ne passano di nuovi).
"""
import base64, hashlib, json, mimetypes, os, sys
from cryptography.hazmat.primitives.ciphers.aead import AESGCM

DIR = os.path.join(os.path.dirname(os.path.abspath(__file__)), '..', 'public', 'r')
aes = AESGCM(base64.b64decode(os.environ['RIUNIONI_KEY']))


def cifra(b: bytes) -> bytes:
    iv = os.urandom(12)
    return iv + aes.encrypt(iv, b, None)


def decifra(b: bytes) -> bytes:
    return aes.decrypt(b[:12], b[12:], None)


def leggi_indice():
    p = os.path.join(DIR, 'indice.bin')
    return json.loads(decifra(open(p, 'rb').read())) if os.path.exists(p) else {'voci': []}


def main():
    cmd = sys.argv[1] if len(sys.argv) > 1 else ''
    ind = leggi_indice()
    if cmd == 'elenco':
        for v in ind['voci']:
            print(v['data'], v['id'], v['tipo'], v['titolo'], f"({len(v['allegati'])} allegati)")
        return
    if cmd != 'aggiungi' or len(sys.argv) < 3:
        sys.exit(__doc__)
    v = json.load(open(sys.argv[2], encoding='utf-8'))
    for k in ('id', 'data', 'tipo', 'titolo', 'descrizione', 'testo'):
        assert v.get(k), f'manca {k}'
    assert v['tipo'] in ('riunione', 'comunicazione')
    file = sys.argv[3:]
    nomi = v.pop('nomi_allegati', None) or [os.path.basename(f) for f in file]
    assert not file or len(nomi) == len(file), 'nomi_allegati e file non corrispondono'
    vecchia = next((x for x in ind['voci'] if x['id'] == v['id']), None)
    allegati = [] if file else (vecchia or {}).get('allegati', [])
    for nome, f in zip(nomi, file):
        b = open(f, 'rb').read()
        out = hashlib.sha256((v['id'] + nome + 'riunioni-sale').encode()).hexdigest()[:16] + '.bin'
        open(os.path.join(DIR, out), 'wb').write(cifra(b))
        mime = mimetypes.guess_type(nome)[0] or 'application/octet-stream'
        allegati.append({'nome': nome, 'file': out, 'mime': mime, 'kb': round(len(b) / 1024)})
    v['allegati'] = allegati
    ind['voci'] = sorted([x for x in ind['voci'] if x['id'] != v['id']] + [v], key=lambda x: x['data'], reverse=True)
    open(os.path.join(DIR, 'indice.bin'), 'wb').write(cifra(json.dumps(ind, ensure_ascii=False).encode()))
    print('ok:', v['data'], v['titolo'], f'({len(allegati)} allegati);', len(ind['voci']), 'voci totali')


if __name__ == '__main__':
    main()

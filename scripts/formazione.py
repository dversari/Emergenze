#!/usr/bin/env python3
"""Calendario della formazione (public/r/formazione.bin, cifrato AES-256-GCM come le Riunioni).

Chiave in RIUNIONI_KEY (base64), da Supabase emergenze_config 'chiave_riunioni'. Mai nel repository.

Uso:
  RIUNIONI_KEY=... python3 -I scripts/formazione.py mostra              # stampa il JSON in chiaro
  RIUNIONI_KEY=... python3 -I scripts/formazione.py mese 2026-12 mese.json   # sostituisce un mese (lista di eventi)
  RIUNIONI_KEY=... python3 -I scripts/formazione.py sigle sigle.json       # unisce {"Cognome": "SG", ...}
  RIUNIONI_KEY=... python3 -I scripts/formazione.py tutto dati.json         # sostituisce tutto

Evento: {"g": giorno, "tipo": "corso"|"sim"|"convegno"|"mm"|"esercitazione", "titolo": "...",
         "quando": "mattina"|"pomeriggio"|"9–13"|"", "dove": "...", "persone": ["Cognome", ...], "nota": "..."}
"""
import base64, json, os, sys
from cryptography.hazmat.primitives.ciphers.aead import AESGCM

FILE = os.path.join(os.path.dirname(os.path.abspath(__file__)), '..', 'public', 'r', 'formazione.bin')
aes = AESGCM(base64.b64decode(os.environ['RIUNIONI_KEY']))


def leggi():
    if not os.path.exists(FILE):
        return {'sigle': {}, 'mesi': {}}
    b = open(FILE, 'rb').read()
    return json.loads(aes.decrypt(b[:12], b[12:], None))


def scrivi(d):
    iv = os.urandom(12)
    open(FILE, 'wb').write(iv + aes.encrypt(iv, json.dumps(d, ensure_ascii=False).encode(), None))


def main():
    a = sys.argv[1:]
    d = leggi()
    if a[:1] == ['mostra']:
        print(json.dumps(d, ensure_ascii=False, indent=1)); return
    if a[:1] == ['mese'] and len(a) == 3:
        d['mesi'][a[1]] = sorted(json.load(open(a[2], encoding='utf-8')), key=lambda e: e['g'])
    elif a[:1] == ['sigle'] and len(a) == 2:
        d['sigle'].update(json.load(open(a[1], encoding='utf-8')))
    elif a[:1] == ['tutto'] and len(a) == 2:
        d = json.load(open(a[1], encoding='utf-8'))
    else:
        sys.exit(__doc__)
    scrivi(d)
    senza = sorted({p for m in d['mesi'].values() for e in m for p in e.get('persone', []) if p not in d['sigle']})
    print('ok:', ', '.join(sorted(d['mesi'])), '| cognomi senza sigla:', ', '.join(senza) or 'nessuno')


if __name__ == '__main__':
    main()

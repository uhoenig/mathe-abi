"""Lokale CSS-/JS-URLs bei Änderungen erneuern: python3 tools/version_assets.py.

Mit --check werden veraltete Versionskennungen gemeldet, ohne Dateien zu ändern.
"""
import argparse
import hashlib
from pathlib import Path
import re

ROOT = Path(__file__).resolve().parent.parent
ASSET = re.compile(r'''((?:src|href)=["'])([^"'?]+\.(?:js|css))(?:\?[^"']*)?(["'])''')
SOLUTION = re.compile(r"script\.src='solutions\.js(?:\?v=[a-f0-9]+)?'")


def version(path):
    source = (ROOT / path).resolve()
    if not source.is_relative_to(ROOT) or source.suffix not in {'.js', '.css'}:
        raise ValueError(f'Ungültige Asset-Adresse: {path}')
    return hashlib.sha256(source.read_bytes()).hexdigest()[:12]


def update(check=False):
    app = ROOT / 'app.js'
    original = app.read_text()
    expected, count = SOLUTION.subn(f"script.src='solutions.js?v={version('solutions.js')}'", original)
    if count != 1:
        raise ValueError('Die dynamische solutions.js-Adresse wurde nicht eindeutig gefunden.')
    stale = []
    if original != expected:
        stale.append('app.js (solutions.js)')
        if not check:
            app.write_text(expected)

    html = ROOT / 'index.html'
    original = html.read_text()

    def replace(match):
        prefix, path, quote = match.groups()
        if '://' in path or path.startswith('//'):
            return match.group(0)
        return f'{prefix}{path}?v={version(path)}{quote}'

    expected = ASSET.sub(replace, original)
    if original != expected:
        stale.append('index.html')
        if not check:
            html.write_text(expected)
    if check and stale:
        raise SystemExit('Veraltete Asset-Versionen: ' + ', '.join(stale) + '. Bitte python3 tools/version_assets.py ausführen.')
    print('OK Asset-Versionen ' + ('geprüft.' if check else 'aktualisiert.'))


if __name__ == '__main__':
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('--check', action='store_true')
    update(parser.parse_args().check)

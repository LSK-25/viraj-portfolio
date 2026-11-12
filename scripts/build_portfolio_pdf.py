"""Rebuild the public portfolio PDF from the same record used by the site.

Requires: python -m pip install reportlab
Fonts and their license are bundled in scripts/fonts.
"""
from pathlib import Path
import json
from xml.sax.saxutils import escape

from reportlab.pdfgen import canvas
from reportlab.lib.colors import HexColor
from reportlab.lib.styles import ParagraphStyle
from reportlab.platypus import Paragraph
from reportlab.lib.enums import TA_LEFT
from reportlab.pdfbase import pdfmetrics
from reportlab.pdfbase.ttfonts import TTFont

ROOT = Path(__file__).resolve().parents[1]
for family, filename in [
    ('PortfolioSans', 'DejaVuSans.ttf'),
    ('PortfolioSansBold', 'DejaVuSans-Bold.ttf'),
    ('PortfolioSerif', 'DejaVuSerif.ttf'),
    ('PortfolioSerifItalic', 'DejaVuSerif-Italic.ttf'),
]:
    pdfmetrics.registerFont(TTFont(family, str(ROOT / 'scripts/fonts' / filename)))
pdfmetrics.registerFontFamily('PortfolioSans', normal='PortfolioSans', bold='PortfolioSansBold')
pdfmetrics.registerFontFamily('PortfolioSerif', normal='PortfolioSerif', italic='PortfolioSerifItalic')

DATA = json.loads((ROOT / 'src/data/portfolio.json').read_text(encoding='utf-8'))
OUT = ROOT / 'public/Viraj_Patil_Portfolio.pdf'
W, H = 595.28, 841.89
BLACK, TEXT, MUTED, WINE = map(HexColor, ['#0b0b0c', '#f1edf0', '#b2a8b2', '#cb8da7'])
c = canvas.Canvas(str(OUT), pagesize=(W, H))
c.setTitle('Viraj Patil | Selected work & portfolio')
c.setAuthor('Viraj Patil')
c.setSubject('Project overview, technical approach, and professional links')


def safe(text):
    return escape(str(text).replace('–', '-').replace('—', '-').replace('‑', '-'))


def para(text, x, y, width, size=10, color=MUTED, leading=None, font='PortfolioSans'):
    style = ParagraphStyle('body', fontName=font, fontSize=size, leading=leading or size * 1.45,
                           textColor=color, alignment=TA_LEFT)
    p = Paragraph(text, style)
    _, height = p.wrap(width, H)
    p.drawOn(c, x, y - height)
    return y - height


def line(y):
    c.setStrokeColor(HexColor('#343039'))
    c.setLineWidth(.5)
    c.line(44, y, W - 44, y)


def base(page, label):
    c.setFillColor(BLACK)
    c.rect(0, 0, W, H, fill=1, stroke=0)
    c.setFillColor(TEXT)
    c.setFont('PortfolioSansBold', 22)
    c.drawString(44, H - 47, 'vp')
    c.setFillColor(WINE)
    c.drawString(77, H - 47, '.')
    c.setFillColor(MUTED)
    c.setFont('PortfolioSans', 8)
    c.drawRightString(W - 44, H - 44, label.upper())
    line(H - 61)
    line(49)
    c.setFont('PortfolioSans', 8)
    c.setFillColor(MUTED)
    c.drawString(44, 32, 'VIRAJ PATIL / PORTFOLIO')
    c.drawRightString(W - 44, 32, f'{page:02d} / 02')


def link(label, href, x, y, width=470):
    href = escape(href, {'"': '&quot;'})
    return para(f'<link href="{href}" color="#cb8da7">{safe(label)}  →</link>', x, y, width, 9, WINE)


def project(p, top, full=False):
    x, width = 44, W - 88
    y = para(f'{safe(p["number"])} / {safe(p["category"].upper())} / {safe(p["status"].upper())}',
             x, top, width, 8, WINE)
    y = para(safe(p['title']), x, y - 12, width, 25, TEXT)
    y = para(safe(' / '.join(p['stack'])), x, y - 11, width, 8, MUTED)
    y = para(safe(p['description']), x, y - 16, width, 11, TEXT)
    if full:
        y = para('<b>THE APPROACH</b>', x, y - 18, width, 8, WINE)
        y = para(safe(p['implementation']), x, y - 9, width, 10, MUTED)
    y = para('<b>WHERE IT STANDS</b>', x, y - 17, width, 8, WINE)
    y = para(safe(p['outcome']), x, y - 8, width, 10, MUTED)
    if p['href']:
        y = link('View project: ' + p['href'].replace('https://', '').rstrip('/'), p['href'], x, y - 14)
    return y


base(1, 'Selected work / 2026')
y = para('Viraj Patil', 44, 748, 510, 42, TEXT)
y = para('Curiosity. Code. <i>Real impact.</i>', 44, y - 12, 510, 20, WINE, font='PortfolioSerif')
y = para(safe(DATA['intro']), 44, y - 18, 500, 11, MUTED)
line(y - 24)
y = project(DATA['projects'][0], y - 38)
line(y - 25)
y = project(DATA['projects'][1], y - 38)
if y < 68:
    raise RuntimeError(f'Page 1 content overflow: {y}')
c.showPage()

base(2, 'Selected work / Contact')
y = para('Selected projects', 44, 760, 510, 28, TEXT, 32)
y = project(DATA['projects'][2], y - 26)
line(y - 25)
y = project(DATA['projects'][3], y - 38)
line(y - 16)
y = para('Let’s start a conversation.', 44, y - 33, 510, 22, TEXT)
y = para(safe(DATA['education']), 44, y - 12, 500, 10, MUTED)
y = para(safe(DATA['location']) + ' · ' + safe(DATA['email']), 44, y - 8, 500, 10, MUTED)
for r in DATA['resources']:
    if r['id'] in ['github', 'linkedin', 'resume']:
        href = DATA['website'].rstrip('/') + r['href'] if r['href'].startswith('/') else r['href']
        y = link(r['label'] + ' / ' + href.replace('https://', ''), href, 44, y - 7)
if y < 68:
    raise RuntimeError(f'Page 2 content overflow: {y}')
c.save()
print(OUT)

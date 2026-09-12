from reportlab.graphics.barcode import qr
from reportlab.graphics.shapes import Drawing
from reportlab.graphics import renderSVG
from pathlib import Path
payload='upi://pay?pa=7081201212%40fam&pn=Anime%20Kingdom&cu=INR'
widget=qr.QrCodeWidget(payload,barLevel='M',barWidth=280,barHeight=280)
drawing=Drawing(280,280)
drawing.add(widget)
renderSVG.drawToFile(drawing,'outputs/anime-kingdom-upi.svg')
Path('work/upi-qr-payload.txt').write_text(payload)

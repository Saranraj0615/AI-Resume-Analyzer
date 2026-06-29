from reportlab.lib.pagesizes import letter
from reportlab.pdfgen import canvas


def generate_report(text, output_path):
    c = canvas.Canvas(output_path, pagesize=letter)

    width, height = letter
    y = height - 40

    c.setFont("Helvetica-Bold", 16)
    c.drawString(50, y, "AI Resume Analysis Report")

    y -= 30
    c.setFont("Helvetica", 10)

    for line in text.split("\n"):
        if y < 50:
            c.showPage()
            c.setFont("Helvetica", 10)
            y = height - 40

        c.drawString(40, y, line[:100])
        y -= 15

    c.save()
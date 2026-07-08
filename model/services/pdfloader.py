import fitz as fz


def extract_text(pdf_path):
    doc = fz.open(pdf_path)

    full_text = ""

    for page_num, page in enumerate(doc, start=1):
        text = page.get_text()

        full_text += f"\n--- PAGE {page_num} ---\n"
        full_text += text

    doc.close()

    return full_text
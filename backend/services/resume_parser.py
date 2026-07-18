"""Resume text extraction — PyMuPDF primary, pdfplumber fallback."""

from __future__ import annotations

import logging
from pathlib import Path

logger = logging.getLogger(__name__)


def extract_text_from_pdf(path: str | Path) -> tuple[str, int]:
    path = Path(path)
    text = ""
    pages = 0

    try:
        import fitz  # PyMuPDF

        doc = fitz.open(path)
        pages = doc.page_count
        chunks: list[str] = []
        for page in doc:
            chunks.append(page.get_text("text"))
        doc.close()
        text = "\n".join(chunks).strip()
    except Exception as exc:  # noqa: BLE001
        logger.warning("PyMuPDF failed: %s", exc)

    if len(text) < 40:
        try:
            import pdfplumber

            with pdfplumber.open(path) as pdf:
                pages = len(pdf.pages)
                chunks = [(p.extract_text() or "") for p in pdf.pages]
            text = "\n".join(chunks).strip()
        except Exception as exc:  # noqa: BLE001
            logger.warning("pdfplumber failed: %s", exc)

    return text, pages


def extract_text_from_bytes(data: bytes, filename: str) -> tuple[str, int]:
    import tempfile

    suffix = Path(filename).suffix or ".pdf"
    with tempfile.NamedTemporaryFile(delete=False, suffix=suffix) as tmp:
        tmp.write(data)
        tmp_path = tmp.name
    try:
        return extract_text_from_pdf(tmp_path)
    finally:
        Path(tmp_path).unlink(missing_ok=True)

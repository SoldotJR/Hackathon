"""PDF report generation."""

from __future__ import annotations

import io
from typing import TYPE_CHECKING

if TYPE_CHECKING:
    from schemas.recruitment import RecruitmentPlan


def build_pdf_report(plan: RecruitmentPlan) -> bytes:
    from reportlab.lib import colors
    from reportlab.lib.pagesizes import letter
    from reportlab.lib.styles import ParagraphStyle, getSampleStyleSheet
    from reportlab.platypus import Paragraph, SimpleDocTemplate, Spacer, Table, TableStyle

    buffer = io.BytesIO()
    doc = SimpleDocTemplate(buffer, pagesize=letter, title="TalentPilot AI Report")
    styles = getSampleStyleSheet()
    title_style = ParagraphStyle(
        "TPTitle",
        parent=styles["Heading1"],
        textColor=colors.HexColor("#4f46e5"),
        spaceAfter=12,
    )
    body = styles["BodyText"]

    story = [
        Paragraph("TalentPilot AI — Recruitment Report", title_style),
        Paragraph(f"Plan ID: {plan.id}", body),
        Paragraph(f"Created: {plan.createdAt}", body),
        Paragraph(f"Request: {plan.request}", body),
        Spacer(1, 12),
        Paragraph("Summary", styles["Heading2"]),
        Paragraph(
            f"Position: {plan.summary.position} | Candidates: {plan.summary.candidates} | "
            f"Avg Match: {plan.summary.averageMatch}% | Budget: ${plan.summary.budget}/mo | "
            f"Confidence: {int(plan.confidenceScore * 100)}%",
            body,
        ),
        Spacer(1, 12),
        Paragraph("Top Candidates", styles["Heading2"]),
    ]

    rows = [["Name", "Match", "Salary", "Recommendation"]]
    for c in plan.candidates[:8]:
        rows.append([c.name, f"{c.matchScore}%", f"${c.salary}", c.recommendation])

    table = Table(rows, colWidths=[160, 70, 80, 140])
    table.setStyle(
        TableStyle(
            [
                ("BACKGROUND", (0, 0), (-1, 0), colors.HexColor("#111827")),
                ("TEXTCOLOR", (0, 0), (-1, 0), colors.white),
                ("GRID", (0, 0), (-1, -1), 0.5, colors.grey),
                ("FONTNAME", (0, 0), (-1, 0), "Helvetica-Bold"),
                ("ROWBACKGROUNDS", (0, 1), (-1, -1), [colors.whitesmoke, colors.lightgrey]),
                ("LEFTPADDING", (0, 0), (-1, -1), 6),
                ("RIGHTPADDING", (0, 0), (-1, -1), 6),
                ("TOPPADDING", (0, 0), (-1, -1), 6),
                ("BOTTOMPADDING", (0, 0), (-1, -1), 6),
            ]
        )
    )
    story.append(table)
    story.append(Spacer(1, 16))
    story.append(Paragraph("Hiring Recommendations", styles["Heading2"]))
    for rec in plan.recommendations[:5]:
        story.append(
            Paragraph(
                f"<b>{rec.candidateName}</b> — {rec.level} (Risk: {rec.riskLevel})",
                body,
            )
        )
        story.append(Paragraph(rec.reasoning, body))
        story.append(Spacer(1, 8))

    doc.build(story)
    return buffer.getvalue()


def build_csv_candidates(plan: RecruitmentPlan) -> str:
    import csv
    import io as _io

    buf = _io.StringIO()
    writer = csv.writer(buf)
    writer.writerow(
        [
            "id",
            "name",
            "title",
            "experience",
            "matchScore",
            "salary",
            "recommendation",
            "location",
            "skills",
        ]
    )
    for c in plan.candidates:
        writer.writerow(
            [
                c.id,
                c.name,
                c.title,
                c.experience,
                c.matchScore,
                c.salary,
                c.recommendation,
                c.location,
                "; ".join(s.name for s in c.skills),
            ]
        )
    return buf.getvalue()

"""
API router for the Lab Report Intelligence Agent.

Endpoints:
  POST /upload-report  — Upload a PDF lab report and get structured JSON back.
"""

import logging

from fastapi import APIRouter, File, HTTPException, UploadFile, status

from app.llm_service import analyze_report_text
from app.pdf_extractor import extract_text_from_pdf
from app.schemas import LabReport

logger = logging.getLogger(__name__)

router = APIRouter(prefix="/api/v1", tags=["Lab Report"])

ALLOWED_CONTENT_TYPES = {"application/pdf", "application/octet-stream"}
MAX_FILE_SIZE_BYTES = 10 * 1024 * 1024  # 10 MB


def _validate_upload(file: UploadFile) -> None:
    """
    Guard against non-PDF or oversized uploads before reading bytes.

    Raises:
        HTTPException 415: If the file is not a PDF.
    """
    if file.content_type not in ALLOWED_CONTENT_TYPES and not (
        file.filename and file.filename.lower().endswith(".pdf")
    ):
        raise HTTPException(
            status_code=status.HTTP_415_UNSUPPORTED_MEDIA_TYPE,
            detail="Only PDF files are accepted.",
        )


@router.post(
    "/upload-report",
    response_model=LabReport,
    status_code=status.HTTP_200_OK,
    summary="Upload a lab report PDF",
    description=(
        "Accepts a PDF lab report, extracts its text, and returns a structured "
        "JSON analysis containing patient info and all detected lab parameters."
    ),
)
async def upload_report(
    file: UploadFile = File(..., description="Lab report PDF file"),
) -> LabReport:
    """
    Pipeline:
      1. Validate upload (type + size).
      2. Read file bytes.
      3. Extract text via pdfplumber.
      4. Analyze text with LLM.
      5. Return validated LabReport.
    """
    # -- Step 1: Validate file type --
    _validate_upload(file)

    # -- Step 2: Read bytes + enforce size limit --
    try:
        file_bytes = await file.read()
    except Exception as exc:
        logger.exception("Failed to read uploaded file.")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Could not read the uploaded file.",
        ) from exc

    if len(file_bytes) > MAX_FILE_SIZE_BYTES:
        raise HTTPException(
            status_code=status.HTTP_413_REQUEST_ENTITY_TOO_LARGE,
            detail=f"File exceeds the maximum allowed size of {MAX_FILE_SIZE_BYTES // (1024*1024)} MB.",
        )

    if not file_bytes:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Uploaded file is empty.",
        )

    # -- Step 3: Extract text from PDF --
    try:
        report_text = extract_text_from_pdf(file_bytes)
    except ValueError as exc:
        raise HTTPException(
            status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
            detail=str(exc),
        )
    except RuntimeError as exc:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=str(exc),
        )

    # -- Step 4: Analyze with LLM --
    try:
        lab_report = analyze_report_text(report_text)
    except ValueError as exc:
        raise HTTPException(
            status_code=status.HTTP_502_BAD_GATEWAY,
            detail=f"LLM returned an unexpected response: {exc}",
        )
    except RuntimeError as exc:
        raise HTTPException(
            status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
            detail=f"LLM service unavailable: {exc}",
        )

    logger.info(
        "Successfully processed report for patient: %s", lab_report.patient_name
    )

    # -- Step 5: Return --
    return lab_report

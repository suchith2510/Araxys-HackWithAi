"""
LLM service layer for lab report analysis.

Currently ships with a MOCK implementation that returns realistic
dummy data so the rest of the pipeline can be developed and tested
without a live LLM key.

To wire in a real LLM (e.g. Google Gemini, OpenAI):
  1. Replace the body of `_call_llm()` with real API calls.
  2. Keep `analyze_report_text()` unchanged — it handles validation.
"""

import json
import logging
from typing import Any

from app.schemas import LabReport

logger = logging.getLogger(__name__)

# ---------------------------------------------------------------------------
# System prompt that instructs the LLM on the exact output schema.
# ---------------------------------------------------------------------------
SYSTEM_PROMPT = """
You are a medical lab report analysis AI.

Given raw text extracted from a patient lab report, return ONLY a valid JSON
object conforming exactly to this schema — no markdown fences, no extra keys:

{
  "patient_name": "<string>",
  "report_date": "<YYYY-MM-DD string>",
  "parameters": [
    {
      "name": "<string>",
      "value": <number>,
      "unit": "<string>",
      "reference_low": <number>,
      "reference_high": <number>,
      "status": "<High | Low | Normal>"
    }
  ]
}

Rules:
- Extract every lab parameter you can find.
- value, reference_low, reference_high MUST be numbers (not strings).
- status must be exactly "High", "Low", or "Normal".
- If you cannot determine a field, use sensible defaults.
- Return ONLY the JSON object — no other text.
""".strip()


# ---------------------------------------------------------------------------
# Internal helpers
# ---------------------------------------------------------------------------

def _call_llm(report_text: str) -> dict[str, Any]:
    """
    Send report text to the LLM and return the parsed JSON response.

    *** MOCK IMPLEMENTATION ***
    Replace this function body with a real API call when ready.
    Expected return: a plain Python dict matching the LabReport schema.
    """
    logger.info("LLM called (MOCK). Text length: %d chars.", len(report_text))

    # ------------------------------------------------------------------
    # 🔧 REPLACE BELOW with your actual LLM call, e.g.:
    #
    # import google.generativeai as genai
    # genai.configure(api_key=settings.GOOGLE_API_KEY)
    # model = genai.GenerativeModel("gemini-1.5-flash")
    # response = model.generate_content(
    #     f"{SYSTEM_PROMPT}\n\nReport Text:\n{report_text}"
    # )
    # return json.loads(response.text)
    # ------------------------------------------------------------------

    mock_response: dict[str, Any] = {
        "patient_name": "John Doe",
        "report_date": "2024-01-15",
        "parameters": [
            {
                "name": "Hemoglobin",
                "value": 11.2,
                "unit": "g/dL",
                "reference_low": 13.5,
                "reference_high": 17.5,
                "status": "Low",
            },
            {
                "name": "Fasting Blood Glucose",
                "value": 98.0,
                "unit": "mg/dL",
                "reference_low": 70.0,
                "reference_high": 100.0,
                "status": "Normal",
            },
            {
                "name": "Total Cholesterol",
                "value": 215.0,
                "unit": "mg/dL",
                "reference_low": 0.0,
                "reference_high": 200.0,
                "status": "High",
            },
            {
                "name": "Creatinine",
                "value": 1.1,
                "unit": "mg/dL",
                "reference_low": 0.7,
                "reference_high": 1.3,
                "status": "Normal",
            },
        ],
    }
    return mock_response


def _validate_llm_response(raw: dict[str, Any]) -> LabReport:
    """
    Parse and validate the raw LLM dict against the LabReport Pydantic schema.

    Raises:
        ValueError: If the response doesn't match the expected schema.
    """
    try:
        return LabReport(**raw)
    except Exception as exc:
        logger.error("LLM response failed schema validation: %s", exc)
        raise ValueError(f"LLM returned an invalid response structure: {exc}") from exc


# ---------------------------------------------------------------------------
# Public API
# ---------------------------------------------------------------------------

def analyze_report_text(report_text: str) -> LabReport:
    """
    Main entry point: send PDF text to the LLM and return a validated LabReport.

    Args:
        report_text: Raw text extracted from the lab report PDF.

    Returns:
        A validated LabReport Pydantic model.

    Raises:
        ValueError:   LLM response didn't match the required schema.
        RuntimeError: LLM API call failed unexpectedly.
    """
    if not report_text or not report_text.strip():
        raise ValueError("Report text is empty — cannot analyze.")

    try:
        raw_response = _call_llm(report_text)
    except ValueError:
        raise
    except Exception as exc:
        logger.exception("LLM API call failed.")
        raise RuntimeError(f"LLM service error: {exc}") from exc

    return _validate_llm_response(raw_response)

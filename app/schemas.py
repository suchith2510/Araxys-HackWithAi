"""
Pydantic schemas that strictly define the data contract for the
Lab Report Intelligence Agent API.

⚠️ Do NOT modify the shape of these models — the LLM is
   instructed to return exactly this structure.
"""

from typing import List, Literal
from pydantic import BaseModel, Field


class LabParameter(BaseModel):
    """A single lab test result extracted from the report."""

    name: str = Field(..., description="Name of the lab parameter, e.g. 'Hemoglobin'")
    value: float = Field(..., description="Measured numeric value")
    unit: str = Field(..., description="Unit of measurement, e.g. 'g/dL'")
    reference_low: float = Field(..., description="Lower bound of the normal reference range")
    reference_high: float = Field(..., description="Upper bound of the normal reference range")
    status: Literal["High", "Low", "Normal"] = Field(
        ..., description="Comparison of value against reference range"
    )


class LabReport(BaseModel):
    """
    Structured representation of a parsed lab report.
    This is the EXACT schema the LLM must return.
    """

    patient_name: str = Field(..., description="Full name of the patient")
    report_date: str = Field(..., description="Date of the report (e.g. '2024-01-15')")
    parameters: List[LabParameter] = Field(
        ..., description="List of all lab parameters found in the report"
    )

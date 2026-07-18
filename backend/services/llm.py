"""LLM client — Gemini primary, Groq fallback, heuristic last resort."""

from __future__ import annotations

import json
import logging
import re
from typing import Any

from utils.config import get_settings

logger = logging.getLogger(__name__)


def _extract_json(text: str) -> Any:
    text = text.strip()
    if text.startswith("```"):
        text = re.sub(r"^```(?:json)?\s*", "", text)
        text = re.sub(r"\s*```$", "", text)
    try:
        return json.loads(text)
    except json.JSONDecodeError:
        match = re.search(r"\{[\s\S]*\}|\[[\s\S]*\]", text)
        if match:
            return json.loads(match.group(0))
        raise


class LLMService:
    def __init__(self) -> None:
        self.settings = get_settings()
        self._gemini = None
        self._groq = None

        if self.settings.gemini_api_key:
            try:
                import google.generativeai as genai

                genai.configure(api_key=self.settings.gemini_api_key)
                self._gemini = genai.GenerativeModel("gemini-2.0-flash")
            except Exception as exc:  # noqa: BLE001
                logger.warning("Gemini init failed: %s", exc)

        if self.settings.groq_api_key:
            try:
                from groq import Groq

                self._groq = Groq(api_key=self.settings.groq_api_key)
            except Exception as exc:  # noqa: BLE001
                logger.warning("Groq init failed: %s", exc)

    @property
    def provider(self) -> str:
        if self._gemini:
            return "gemini"
        if self._groq:
            return "groq"
        return "heuristic"

    async def complete(self, system: str, user: str) -> str:
        prompt = f"{system.strip()}\n\n{user.strip()}"

        if self._gemini:
            try:
                result = self._gemini.generate_content(prompt)
                return (result.text or "").strip()
            except Exception as exc:  # noqa: BLE001
                logger.warning("Gemini call failed: %s", exc)

        if self._groq:
            try:
                completion = self._groq.chat.completions.create(
                    model="llama-3.3-70b-versatile",
                    messages=[
                        {"role": "system", "content": system},
                        {"role": "user", "content": user},
                    ],
                    temperature=0.3,
                )
                return (completion.choices[0].message.content or "").strip()
            except Exception as exc:  # noqa: BLE001
                logger.warning("Groq call failed: %s", exc)

        return ""

    async def complete_json(
        self, system: str, user: str, fallback: Any
    ) -> Any:
        text = await self.complete(
            system + "\nRespond with valid JSON only. No markdown.",
            user,
        )
        if not text:
            return fallback
        try:
            return _extract_json(text)
        except Exception as exc:  # noqa: BLE001
            logger.warning("JSON parse failed: %s", exc)
            return fallback


_llm: LLMService | None = None


def get_llm() -> LLMService:
    global _llm
    if _llm is None:
        _llm = LLMService()
    return _llm

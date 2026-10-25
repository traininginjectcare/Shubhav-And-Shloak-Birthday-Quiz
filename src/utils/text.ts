/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

/**
 * Utility to strip any trailing bracketed English/Roman transliterations from Hindi text.
 * Prevents redundant repetition of English when English is already shown on screen.
 * E.g., "भरत जी की पत्नी का नाम क्या था? (Bharat ji ki patni ka naam kya tha?)" -> "भरत जी की पत्नी का नाम क्या था?"
 * E.g., "मांडवी (Mandavi)" -> "मांडवी"
 */
export function cleanHindiText(text?: string | null): string {
  if (!text) return '';
  return text
    .replace(/\s*\([A-Za-z0-9\s,.'\-–—/?!]+\)\s*$/, '')
    .trim();
}

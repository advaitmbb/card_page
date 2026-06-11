#!/usr/bin/env python3
"""Convert the published Google Sheet CSV (cards.csv) into cards.json.

Coerces TRUE/FALSE into real booleans and numeric columns into numbers,
folds benefit_1..benefit_3 into a single `benefits` array, and aborts
without writing if no rows parse (so a bad fetch never wipes good data).
"""
import csv
import json
import sys

BOOL_COLS = {"active", "elevated", "counts_524", "show_rates_fees"}
NUM_COLS = {"sort_order", "annual_fee", "offer_points", "cpp", "value"}


def convert(key, raw):
    val = (raw or "").strip()
    if key in BOOL_COLS:
        return val.upper() == "TRUE"
    if key in NUM_COLS:
        cleaned = val.replace("$", "").replace(",", "").strip()
        if cleaned == "":
            return None
        try:
            num = float(cleaned)
            return int(num) if num.is_integer() else num
        except ValueError:
            return None
    return val


def main():
    rows = []
    with open("cards.csv", newline="", encoding="utf-8") as f:
        for raw_row in csv.DictReader(f):
            card = {}
            benefits = []
            for key, raw in raw_row.items():
                if key is None:
                    continue
                if key.startswith("benefit_"):
                    if (raw or "").strip():
                        benefits.append(raw.strip())
                    continue
                card[key] = convert(key, raw)
            card["benefits"] = benefits
            rows.append(card)

    if not rows:
        sys.exit("No rows parsed — aborting so good data isn't overwritten.")

    with open("cards.json", "w", encoding="utf-8") as f:
        json.dump(rows, f, ensure_ascii=False, indent=0)

    print(f"Wrote {len(rows)} cards to cards.json")


if __name__ == "__main__":
    main()

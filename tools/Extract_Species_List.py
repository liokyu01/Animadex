import json
import csv

# -----------------------------
# CONFIGURATION (edit paths)
# -----------------------------
JSON_INPUT_PATH = "tools/entries_backup_2025-12-11.json"        # your original JSON
CSV_FAMILY_PATH = "tools/species.csv"   # the CSV we generated
JSON_OUTPUT_PATH = "tools/database_with_family.json"  # output file


# -----------------------------
# LOAD FAMILY MAP FROM CSV
# -----------------------------
def load_family_csv(csv_path):
    family_map = {}
    with open(csv_path, "r", encoding="utf-8") as f:
        reader = csv.reader(f)
        for row in reader:
            if len(row) < 2:
                continue
            latin_name = row[0].strip().lower()
            family = row[1].strip()
            family_map[latin_name] = family
    return family_map


# -----------------------------
# LOAD DATABASE JSON
# -----------------------------
def load_json(json_path):
    with open(json_path, "r", encoding="utf-8") as f:
        return json.load(f)


# -----------------------------
# UPDATE JSON WITH FAMILY FIELD
# -----------------------------
def update_database_with_family(data, family_map):
    missing = []
    for entry in data:
        latin_name = entry.get("latin", "").strip().lower()

        if latin_name in family_map:
            entry["family"] = family_map[latin_name]
        else:
            entry["family"] = None
            missing.append(entry.get("latin", ""))

    return data, missing


# -----------------------------
# WRITE OUTPUT JSON
# -----------------------------
def write_json(data, json_path):
    with open(json_path, "w", encoding="utf-8") as f:
        json.dump(data, f, ensure_ascii=False, indent=2)


# -----------------------------
# MAIN PROGRAM
# -----------------------------
def main():
    print("[1] Loading CSV family list...")
    family_map = load_family_csv(CSV_FAMILY_PATH)

    print("[2] Loading JSON database...")
    database = load_json(JSON_INPUT_PATH)

    print("[3] Updating database...")
    updated_database, missing = update_database_with_family(database, family_map)

    print("[4] Saving updated JSON...")
    write_json(updated_database, JSON_OUTPUT_PATH)

    print("\n✅ DONE!")
    print(f"➡ {JSON_OUTPUT_PATH} created.")

    if missing:
        print("\n⚠ Species not found in CSV:")
        for m in missing:
            print("  -", m)


if __name__ == "__main__":
    main()

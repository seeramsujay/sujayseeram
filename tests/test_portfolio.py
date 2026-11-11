"""Unit tests for the portfolio and project database manager."""

import json
import unittest
from pathlib import Path
from manage_projects import format_date, _parse_json_response


class TestPortfolioDatabase(unittest.TestCase):
    def setUp(self):
        self.root = Path(__file__).parent.parent
        self.db_path = self.root / "projects_db.json"
        self.html_path = self.root / "index.html"

    def test_database_json_validity(self):
        self.assertTrue(self.db_path.exists(), "projects_db.json should exist")
        with open(self.db_path, "r", encoding="utf-8") as f:
            data = json.load(f)

        self.assertIsInstance(data, list)
        self.assertGreater(len(data), 0)

        required_keys = {"name", "description", "githubLink"}
        for item in data:
            self.assertIsInstance(item, dict)
            for k in required_keys:
                self.assertIn(k, item, f"Missing required key '{k}' in project {item.get('name')}")
            self.assertIsInstance(item["name"], str)
            self.assertTrue(len(item["name"]) > 0)

    def test_format_date_helper(self):
        self.assertEqual(format_date("2026-02-15T10:00:00Z"), "Feb 2026")
        self.assertEqual(format_date("2025-11-01T00:00:00Z"), "Nov 2025")
        self.assertEqual(format_date("invalid-date-string"), "Unknown")
        self.assertEqual(format_date(None), "Unknown")

    def test_parse_json_response_clean_and_fenced(self):
        # Raw json
        raw = '{"name": "test", "status": "active"}'
        parsed = _parse_json_response(raw)
        self.assertEqual(parsed, {"name": "test", "status": "active"})

        # Fenced markdown json
        fenced = '```json\n{"name": "fenced", "tags": ["A", "B"]}\n```'
        parsed_fenced = _parse_json_response(fenced)
        self.assertEqual(parsed_fenced, {"name": "fenced", "tags": ["A", "B"]})

        # Malformed json raises JSONDecodeError
        with self.assertRaises(json.JSONDecodeError):
            _parse_json_response("not a json string")

    def test_index_html_presence(self):
        self.assertTrue(self.html_path.exists(), "index.html should exist")
        content = self.html_path.read_text(encoding="utf-8")
        self.assertIn("<!DOCTYPE html>", content)
        self.assertIn("<html", content)
        self.assertIn("</html>", content)


if __name__ == "__main__":
    unittest.main()

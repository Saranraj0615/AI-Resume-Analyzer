from flask import Flask, request, jsonify
from flask_cors import CORS
from dotenv import load_dotenv
from google import genai

import PyPDF2
import io
import os
import json

# Load .env
load_dotenv()

# Flask App
app = Flask(__name__)
CORS(app)

# Gemini Client
client = genai.Client(api_key=os.getenv("GEMINI_API_KEY"))


@app.route("/")
def home():
    return "AI Resume Analyzer Backend is Running!"


@app.route("/analyze", methods=["POST"])
def analyze_resume():

    if "resume" not in request.files:
        return jsonify({"error": "No file uploaded"}), 400

    file = request.files["resume"]

    if file.filename == "":
        return jsonify({"error": "No selected file"}), 400

    try:
        # Read PDF
        pdf_reader = PyPDF2.PdfReader(io.BytesIO(file.read()))

        extracted_text = ""

        for page in pdf_reader.pages:
            text = page.extract_text()

            if text:
                extracted_text += text + "\n"

        if extracted_text.strip() == "":
            return jsonify({"error": "No text found inside PDF"}), 400

        # Gemini Prompt
        prompt = f"""
You are an expert ATS Resume Analyzer.

Analyze the following resume.

Return ONLY valid JSON.

Example:

{{
  "ats_score": 86,
  "skills_found": 18,
  "experience": "2+ Years",
  "education": "B.E / CSE",
  "rating": "Excellent",
  "strengths": [
    "Good technical skills",
    "Relevant projects",
    "Strong resume structure"
  ],
  "weaknesses": [
    "No internship experience",
    "Weak summary"
  ],
  "missing_skills": [
    "Docker",
    "AWS",
    "CI/CD"
  ],
  "suggestions": [
    "Add GitHub",
    "Improve Projects",
    "Add Certifications"
  ]
}}

Resume:

{extracted_text}
"""

        # Gemini Response
        response = client.models.generate_content(
            model="gemini-2.5-flash",
            contents=prompt
        )

        text = response.text.strip()

        # Remove markdown if Gemini returns it
        text = text.replace("```json", "")
        text = text.replace("```", "")
        text = text.strip()

        analysis = json.loads(text)

        return jsonify({
            "success": True,
            **analysis
        })

    except Exception as e:
        return jsonify({
            "success": False,
            "error": str(e)
        }), 500


if __name__ == "__main__":
    app.run(debug=True, port=5000)
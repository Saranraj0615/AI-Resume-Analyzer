from flask import Flask, request, jsonify
from flask_cors import CORS
from dotenv import load_dotenv
import google.generativeai as genai
import PyPDF2
import io
import os
import json

# Load .env
load_dotenv()

# Gemini API
genai.configure(api_key=os.getenv("GEMINI_API_KEY"))
model = genai.GenerativeModel("gemini-2.5-flash")

app = Flask(__name__)

# Enable CORS
CORS(app)

@app.route("/")
def home():
    return jsonify({
        "status": "Backend Running Successfully"
    })

@app.route("/analyze", methods=["POST"])
def analyze_resume():

    if "resume" not in request.files:
        return jsonify({"success": False, "error": "No file uploaded"}), 400

    file = request.files["resume"]

    if file.filename == "":
        return jsonify({"success": False, "error": "No file selected"}), 400

    try:

        pdf_reader = PyPDF2.PdfReader(io.BytesIO(file.read()))

        resume_text = ""

        for page in pdf_reader.pages:
            text = page.extract_text()
            if text:
                resume_text += text + "\n"

        if resume_text.strip() == "":
            return jsonify({"success": False, "error": "PDF contains no text"}), 400

        prompt = f"""
You are an expert ATS Resume Analyzer.

Analyze this resume.

Return ONLY JSON.

{{
    "ats_score": 90,
    "skills_found": 15,
    "experience":"2 Years",
    "education":"B.E CSE",
    "rating":"Excellent",
    "strengths":[
        "Strong projects",
        "Good formatting"
    ],
    "weaknesses":[
        "Missing certifications"
    ],
    "missing_skills":[
        "Docker",
        "AWS"
    ],
    "suggestions":[
        "Add GitHub",
        "Add Internship"
    ]
}}

Resume:

{resume_text}
"""

        response = model.generate_content(prompt)

        result = response.text

        result = result.replace("```json", "")
        result = result.replace("```", "")
        result = result.strip()

        analysis = json.loads(result)

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
    app.run(debug=True)
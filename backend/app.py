from flask import Flask, request, jsonify
from flask_cors import CORS
from dotenv import load_dotenv
import google.generativeai as genai
import PyPDF2
import io
import os
import json

# Load environment variables
load_dotenv()

# Configure Gemini
genai.configure(api_key=os.getenv("GEMINI_API_KEY"))

# Create Gemini model
model = genai.GenerativeModel("gemini-2.5-flash")

# Flask App
app = Flask(__name__)

# Enable CORS
CORS(
    app,
    resources={r"/*": {"origins": "*"}},
    supports_credentials=True
)


@app.after_request
def after_request(response):
    response.headers["Access-Control-Allow-Origin"] = "*"
    response.headers["Access-Control-Allow-Headers"] = "Content-Type,Authorization"
    response.headers["Access-Control-Allow-Methods"] = "GET,POST,OPTIONS"
    return response


@app.route("/", methods=["GET"])
def home():
    return jsonify({
        "status": "Backend Running Successfully"
    })


@app.route("/analyze", methods=["POST", "OPTIONS"])
def analyze_resume():

    # Handle preflight request
    if request.method == "OPTIONS":
        return jsonify({"success": True}), 200

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
            return jsonify({"error": "No text found in PDF"}), 400

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

        response = model.generate_content(prompt)

        text = response.text.strip()

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
    app.run(host="0.0.0.0", port=5000, debug=True)
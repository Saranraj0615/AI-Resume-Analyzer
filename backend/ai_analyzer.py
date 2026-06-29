import os
from dotenv import load_dotenv
from google import genai

load_dotenv()

client = genai.Client(api_key=os.getenv("GEMINI_API_KEY"))

def analyze_resume(resume_text):
    prompt = f"""
You are an expert ATS Resume Analyzer.

Analyze the following resume and provide:

1. Overall ATS Score (out of 100)
2. Strengths
3. Weaknesses
4. Missing Skills
5. Suggested Improvements
6. Best Suitable Job Roles

Resume:
{resume_text}
"""

    try:
        response = client.models.generate_content(
            model="gemini-2.5-flash",
            contents=prompt
        )
        return response.text

    except Exception as e:
        return f"Error: {str(e)}"
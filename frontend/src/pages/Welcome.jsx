import "../styles/Welcome.css";
import Navbar from "../components/Navbar";
import robot from "../assets/images/robot.png";
import triangle from "../assets/images/shapes/triangle.png";
import cube from "../assets/images/shapes/cube.png";
import ring from "../assets/images/shapes/ring.png";
import { useNavigate } from "react-router-dom";

function Welcome() {

  const navigate = useNavigate();   // ✅ Put it here

  return (
    <div className="welcome-page">

      <img src={triangle} className="shape triangle" alt="" />
      <img src={cube} className="shape cube" alt="" />
      <img src={ring} className="shape ring" alt="" />

      <Navbar />

      <div className="hero">

        <div className="left">

          <h3>Welcome to</h3>

          <h1>
            AI <span>Resume</span>
            <br />
            <span>Analyzer</span>
          </h1>

          <p>
            Get intelligent insights, improve your resume,
            and land your dream job with AI-powered analysis.
          </p>

          <div className="buttons">

            <button
              className="primary-btn"
              onClick={() => navigate("/upload")}
            >
              Get Started
            </button>

           <button
  className="secondary-btn"
  onClick={() =>
    navigate("/result", {
      state: {
        ats_score: 88,
        skills_found: 15,
        experience: "2+ Years",
        education: "B.E Computer Science",
        rating: "Excellent",
        strengths: [
          "Strong technical skills",
          "Good project experience",
          "Professional resume format"
        ],
        weaknesses: [
          "No internship experience",
          "Missing certifications"
        ],
        missing_skills: [
          "Docker",
          "AWS",
          "CI/CD"
        ],
        suggestions: [
          "Add GitHub profile",
          "Include certifications",
          "Improve project descriptions"
        ]
      }
    })
  }
>
  See Demo
</button>

          </div>

        </div>

        <div className="right">
          <img src={robot} alt="Robot" className="robot-image" />
        </div>

      </div>

    </div>
  );
}

export default Welcome;
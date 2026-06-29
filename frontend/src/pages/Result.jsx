import "../styles/Result.css";
import { useLocation, useNavigate } from "react-router-dom";
import { CircularProgressbar, buildStyles } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";
import { downloadReport } from "../utils/pdfGenerator";

function Result() {
  const location = useLocation();
  const navigate = useNavigate();

  const data = location.state;

  if (!data) {
    return (
      <div
        style={{
          color: "white",
          textAlign: "center",
          marginTop: "100px",
        }}
      >
        <h2>No analysis found.</h2>

        <button
          onClick={() => navigate("/upload")}
          style={{
            padding: "12px 25px",
            marginTop: "20px",
            borderRadius: "10px",
            cursor: "pointer",
          }}
        >
          Go Back
        </button>
      </div>
    );
  }

  return (
    <div className="result-page">

      {/* Header */}
      <div className="result-header">

        <div>
          <h2>🎉 Analysis Completed Successfully!</h2>
          <p>Here is your AI-powered resume analysis.</p>
        </div>

        <div className="header-buttons">

          <button onClick={() => downloadReport(data)}>
            ⬇ Download PDF
          </button>
<button onClick={() => navigate("/")}>
  🔄 HOME
</button>
        </div>

      </div>

      {/* Dashboard */}
      <div className="dashboard">

        {/* ATS Card */}
        <div className="left-panel">

          <div className="ats-card">

            <h2>ATS SCORE</h2>

            <div
              style={{
                width: "180px",
                height: "180px",
                margin: "25px auto",
              }}
            >
              <CircularProgressbar
                value={data.ats_score}
                text={`${data.ats_score}%`}
                strokeWidth={10}
                styles={buildStyles({
                  textColor: "#ffffff",
                  pathColor: "#00E5FF",
                  trailColor: "rgba(255,255,255,0.08)",
                  textSize: "16px",
                  pathTransitionDuration: 2,
                  rotation: 0.25,
                  strokeLinecap: "round",
                })}
              />
            </div>

            <h2 style={{ marginTop: "20px" }}>
              {data.rating}
            </h2>

            <p style={{ color: "#9FB6FF" }}>
              Better than {data.ats_score}% of resumes
            </p>

          </div>

        </div>

        {/* Right Side */}
        <div className="right-panel">

          {/* Summary Cards */}
          <div className="top-summary">

            <div className="summary-card">
              <h3>💼 Skills</h3>
              <h2>{data.skills_found}</h2>
            </div>

            <div className="summary-card">
              <h3>🏆 Experience</h3>
              <h2>{data.experience}</h2>
            </div>

            <div className="summary-card">
              <h3>🎓 Education</h3>
              <h2>{data.education}</h2>
            </div>

            <div className="summary-card">
              <h3>⭐ Rating</h3>
              <h2>{data.rating}</h2>
            </div>

          </div>

          {/* Detail Cards */}
          <div className="bottom-cards">

            <div className="info-card">
              <h3>✅ Strengths</h3>
              <ul>
                {data.strengths?.map((item, index) => (
                  <li key={index}>{item}</li>
                ))}
              </ul>
            </div>

            <div className="info-card">
              <h3>❌ Weaknesses</h3>
              <ul>
                {data.weaknesses?.map((item, index) => (
                  <li key={index}>{item}</li>
                ))}
              </ul>
            </div>

            <div className="info-card">
              <h3>⚠ Missing Skills</h3>
              <ul>
                {data.missing_skills?.map((item, index) => (
                  <li key={index}>{item}</li>
                ))}
              </ul>
            </div>

            <div className="info-card">
              <h3>💡 Suggestions</h3>
              <ul>
                {data.suggestions?.map((item, index) => (
                  <li key={index}>{item}</li>
                ))}
              </ul>
            </div>

          </div>

        </div>

      </div>

    </div>
  );
}

export default Result;
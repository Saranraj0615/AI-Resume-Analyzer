import "../styles/Upload.css";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { analyzeResume } from "../services/api";

function Upload() {
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const handleFileChange = (e) => {
    if (e.target.files.length > 0) {
      setFile(e.target.files[0]);
    }
  };

  const handleAnalyze = async () => {
    if (!file) {
      alert("Please select a resume first.");
      return;
    }

    try {
      setLoading(true);

      const result = await analyzeResume(file);

      navigate("/result", {
        state: result,
      });

    } catch (error) {
      console.error(error);
      alert("Analysis failed!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="upload-page">

      {/* Progress Bar */}
      <div className="progress">
        <div className="step active">1</div>
        <div className="line"></div>

        <div className="step current">2</div>
        <div className="line"></div>

        <div className="step">3</div>
      </div>

      <h1>
        Upload <span>Your Resume</span>
      </h1>

      <p>
        Upload your resume in PDF format and let AI analyze it.
      </p>

      <div className="upload-box">

        <div className="upload-icon">📄</div>

        <h3>Drag & Drop your PDF here</h3>

        <input
          type="file"
          accept=".pdf"
          id="resume"
          hidden
          onChange={handleFileChange}
        />

        <label htmlFor="resume" className="choose-btn">
          Choose File
        </label>

      </div>

      {file && (
        <>
          <div className="selected-file">

            <div className="file-left">
              <span className="pdf-icon">📄</span>

              <div className="file-info">
                <h4>{file.name}</h4>

                <p>
                  {file.size < 1024 * 1024
                    ? `${(file.size / 1024).toFixed(1)} KB`
                    : `${(file.size / 1024 / 1024).toFixed(2)} MB`}
                </p>
              </div>
            </div>

            <div className="file-right">
              <span className="success">✔</span>

              <button
                className="remove-btn"
                onClick={() => setFile(null)}
              >
                ✖
              </button>
            </div>

          </div>

          <button
            className="analyze-btn"
            onClick={handleAnalyze}
            disabled={loading}
          >
            {loading ? "Analyzing..." : "Analyze Resume →"}
          </button>
        </>
      )}

    </div>
  );
}

export default Upload;
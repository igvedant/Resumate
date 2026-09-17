import { useRef, useState } from "react";
import "../interviewReport.css";
import { useReport } from "../hooks/useReport";
import { useNavigate } from "react-router";
import { ThreeDot } from "react-loading-indicators";

const Home = () => {
  const navigate = useNavigate();
  const [selfDescription, setSelfDescription] = useState("");
  const [jobDescription, setJobDescription] = useState("");
  const [resumeName, setResumeName] = useState("");
  const [formError, setFormError] = useState("");
  const resumeRef = useRef(null);
  const { handleGenerateReport, loading, error, reportIds } = useReport();
  const handleSubmit = async (event) => {
    event.preventDefault();
    setFormError("");
    const resume = resumeRef.current.files?.[0];

    if (!resume || resume.type !== "application/pdf") {
      setFormError("Please choose a PDF resume.");
      return;
    }

    if (resume.size > 3 * 1024 * 1024) {
      setFormError("Your resume must be 3 MB or smaller.");
      return;
    }

    const id = await handleGenerateReport({
      resume,
      selfDescription,
      jobDescription,
    });
    if (id) navigate("/report/" + id);
  };

  if (loading) {
    return (
      <div className="loading">
        <ThreeDot color="rgb(236,49,90)" size="medium" text="" textColor="" />
      </div>
    );
  }

  return (
    <main className="report-page">
      <section className="report-shell" aria-labelledby="report-title">
        <div className="report-intro">
          <p className="eyebrow">Interview readiness</p>
          <h1 id="report-title">Build your interview report</h1>
          <p className="report-subtitle">
            Share the role, your experience, and your resume. We will use them
            to prepare focused interview feedback for you.
          </p>
        </div>

        <form className="report-form" onSubmit={handleSubmit}>
          <div className="field-group field-group-wide">
            <label htmlFor="job-description">Job Description</label>
            <textarea
              id="job-description"
              name="jobDescription"
              placeholder="Paste the job description here..."
              rows="7"
              maxLength={15000}
              required
              onChange={(e) => setJobDescription(e.target.value)}
            />
          </div>

          <div className="field-group">
            <label htmlFor="resume">Resume</label>
            <label className="file-input" htmlFor="resume">
              <span className="file-icon" aria-hidden="true">
                +
              </span>
              <span>
                <strong>{resumeName || "Upload your resume"}</strong>
                <small>PDF files only</small>
              </span>
              <input
                id="resume"
                name="resume"
                type="file"
                accept="application/pdf,.pdf"
                required
                ref={resumeRef}
                onChange={(event) => {
                  setResumeName(event.target.files?.[0]?.name || "");
                }}
              />
            </label>
          </div>

          <div className="field-group">
            <label htmlFor="self-description">Self Description</label>
            <textarea
              id="self-description"
              name="selfDescription"
              placeholder="Tell us about your strengths, goals, and experience..."
              rows="7"
              maxLength={15000}
              required
              onChange={(e) => setSelfDescription(e.target.value)}
            />
          </div>

          <button className="generate-button" type="submit" disabled={loading}>
            Generate Report <span aria-hidden="true">-&gt;</span>
          </button>
          {(formError || error) && (
            <p className="form-error" role="alert">
              {formError || error}
            </p>
          )}
        </form>

        <section className="allReports" aria-labelledby="reports-heading">
          <div className="reports-heading">
            <div>
              <p className="section-kicker">Your workspace</p>
              <h2 id="reports-heading">Previously generated reports</h2>
            </div>
            <span className="report-count">
              {reportIds?.length || 0}{" "}
              {reportIds?.length === 1 ? "report" : "reports"}
            </span>
          </div>

          {reportIds?.length ? (
            <ul className="report-list">
              {reportIds.map((report) => (
                <li key={report._id}>
                  <a className="report-card" href={`/report/${report._id}`}>
                    <div className="report-card-mark" aria-hidden="true">
                      {report.jobTitle?.charAt(0) || "R"}
                    </div>
                    <div className="report-card-content">
                      <h3>{report.jobTitle || "Interview report"}</h3>
                      <p>
                        Created{" "}
                        {new Date(report.createdAt).toLocaleDateString(
                          undefined,
                          { month: "short", day: "numeric", year: "numeric" },
                        )}
                      </p>
                    </div>
                    <div className="report-card-score">
                      {report.matchScore ? (
                        <>
                          <strong>{report.matchScore}</strong>
                          <span>/100 match</span>
                        </>
                      ) : (
                        <span>View report</span>
                      )}
                    </div>
                    <span className="report-card-arrow" aria-hidden="true">
                      -&gt;
                    </span>
                  </a>
                </li>
              ))}
            </ul>
          ) : (
            <div className="reports-empty">
              <span className="reports-empty-icon" aria-hidden="true">
                +
              </span>
              <div>
                <h3>Your report library is empty</h3>
                <p>Generate your first report and it will appear here.</p>
              </div>
            </div>
          )}
        </section>
      </section>
    </main>
  );
};

export default Home;

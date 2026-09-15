import React from "react";
import "../interviewReport.css";

const Home = () => {
  const handleSubmit = (event) => {
    event.preventDefault();
  };

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
              required
            />
          </div>

          <div className="field-group">
            <label htmlFor="resume">Resume</label>
            <label className="file-input" htmlFor="resume">
              <span className="file-icon" aria-hidden="true">
                +
              </span>
              <span>
                <strong>Upload your resume</strong>
                <small>PDF files only</small>
              </span>
              <input
                id="resume"
                name="resume"
                type="file"
                accept="application/pdf,.pdf"
                required
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
              required
            />
          </div>

          <button className="generate-button" type="submit">
            Generate Report <span aria-hidden="true">-&gt;</span>
          </button>
        </form>
      </section>
    </main>
  );
};

export default Home;

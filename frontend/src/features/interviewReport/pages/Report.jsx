import { useState } from "react";
import { useReport } from "../hooks/useReport";
import "../interviewReport.css";
import { ThreeDot } from "react-loading-indicators";

const tabs = [
  { id: "overview", label: "Overview" },
  { id: "technical", label: "Technical" },
  { id: "behavioural", label: "Behavioural" },
  { id: "skills", label: "Skill gaps" },
  { id: "plan", label: "Preparation plan" },
  { id: "inputs", label: "Your inputs" },
];

const QuestionCard = ({ item, index }) => (
  <article className="question-card">
    <div className="question-number">{String(index + 1).padStart(2, "0")}</div>
    <div>
      <h3>{item.question}</h3>
      <div className="answer-block">
        <span>What they are assessing</span>
        <p>{item.intention}</p>
      </div>
      <div className="answer-block">
        <span>How to approach it</span>
        <p>{item.answer}</p>
      </div>
    </div>
  </article>
);

const Report = () => {
  const [activeTab, setActiveTab] = useState("overview");
  const [downloadingResume, setDownloadingResume] = useState(false);
  const [downloadError, setDownloadError] = useState("");
  const { report, loading, handleUpdateResume } = useReport();

  if (loading || !report) {
    return (
      <div className="loading">
        <ThreeDot color="rgb(236,49,90)" size="medium" text="" textColor="" />
      </div>
    );
  }

  const handleDownloadResume = async () => {
    setDownloadingResume(true);
    setDownloadError("");

    try {
      const resumePdf = await handleUpdateResume({ reportId: report._id });
      const downloadUrl = URL.createObjectURL(resumePdf);
      const link = document.createElement("a");
      const fileName = (report.jobTitle || "targeted-resume")
        .replace(/[^a-z0-9]+/gi, "-")
        .replace(/^-|-$/g, "")
        .toLowerCase();

      link.href = downloadUrl;
      link.download = `${fileName || "targeted-resume"}-resume.pdf`;
      document.body.appendChild(link);
      link.click();
      link.remove();
      URL.revokeObjectURL(downloadUrl);
    } catch {
      setDownloadError(
        "We could not create your tailored resume. Please try again.",
      );
    } finally {
      setDownloadingResume(false);
    }
  };

  const renderQuestions = (questions) => (
    <div className="question-list">
      {questions?.length ? (
        questions.map((item, index) => (
          <QuestionCard
            key={`${item.question}-${index}`}
            item={item}
            index={index}
          />
        ))
      ) : (
        <p className="empty-state">
          No questions were generated for this section.
        </p>
      )}
    </div>
  );

  return (
    <main className="report-page report-view-page">
      <section
        className="report-shell report-view-shell"
        aria-labelledby="report-page-title"
      >
        <header className="report-header">
          <div>
            <p className="eyebrow">Interview readiness / report</p>
            <h1 id="report-page-title">Your interview report</h1>
            <p className="report-subtitle">
              A focused guide to help you prepare with intention.
            </p>
          </div>
          <div
            className="score-card"
            aria-label={`Match score ${report.matchScore} out of 100`}
          >
            <span>Match score</span>
            <strong>
              {report.matchScore}
              <small>/100</small>
            </strong>
            <div className="score-track">
              <span style={{ width: `${report.matchScore}%` }} />
            </div>
          </div>
          <div className="resume-download">
            <button
              className="download-button"
              type="button"
              onClick={handleDownloadResume}
              disabled={downloadingResume}
            >
              <span aria-hidden="true">↓</span>
              {downloadingResume
                ? "Preparing resume..."
                : "Download targeted resume"}
            </button>
            <small>Tailored to this job from your verified experience.</small>
            {downloadError && (
              <p className="download-error" role="alert">
                {downloadError}
              </p>
            )}
          </div>
        </header>

        <nav className="report-tabs" aria-label="Report sections">
          {tabs.map((tab) => (
            <button
              className={activeTab === tab.id ? "active" : ""}
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id)}
              aria-selected={activeTab === tab.id}
              role="tab"
            >
              {tab.label}
            </button>
          ))}
        </nav>

        <section className="report-content" role="tabpanel">
          {activeTab === "overview" && (
            <div className="overview-grid">
              <article className="overview-card overview-card-large">
                <span className="section-kicker">Read first</span>
                <h2>Your preparation snapshot</h2>
                <p>
                  Use the question sets to rehearse specific examples, then
                  follow the preparation plan in order. Focus on explaining your
                  thinking clearly, not memorizing perfect answers.
                </p>
                <div className="overview-stats">
                  <div>
                    <strong>{report.technicalQuestions?.length || 0}</strong>
                    <span>technical questions</span>
                  </div>
                  <div>
                    <strong>{report.behaviouralQuestions?.length || 0}</strong>
                    <span>behavioural questions</span>
                  </div>
                  <div>
                    <strong>{report.skillGaps?.length || 0}</strong>
                    <span>skill gaps</span>
                  </div>
                </div>
              </article>
              <article className="overview-card">
                <span className="section-kicker">Priority areas</span>
                <h2>Close these gaps first</h2>
                <div className="priority-list">
                  {(report.skillGaps || []).slice(0, 3).map((gap) => (
                    <div className="priority-item" key={gap.skill}>
                      <span className={`severity-dot ${gap.severnity}`} />
                      <span>{gap.skill}</span>
                      <small>{gap.severnity}</small>
                    </div>
                  ))}
                </div>
              </article>
            </div>
          )}

          {activeTab === "technical" && (
            <SectionHeading
              eyebrow="Technical interview"
              title="Questions worth rehearsing"
              description="Practice explaining your reasoning, trade-offs, and real experience."
            />
          )}
          {activeTab === "technical" &&
            renderQuestions(report.technicalQuestions)}
          {activeTab === "behavioural" && (
            <SectionHeading
              eyebrow="Behavioural interview"
              title="Stories that show how you work"
              description="Keep your answers specific, honest, and grounded in what you actually did."
            />
          )}
          {activeTab === "behavioural" &&
            renderQuestions(report.behaviouralQuestions)}
          {activeTab === "skills" && <SkillGaps gaps={report.skillGaps} />}
          {activeTab === "plan" && (
            <PreparationPlan plan={report.preperationPlan} />
          )}
          {activeTab === "inputs" && <InputSummary report={report} />}
        </section>
      </section>
    </main>
  );
};

const SectionHeading = ({ eyebrow, title, description }) => (
  <div className="tab-heading">
    <span className="section-kicker">{eyebrow}</span>
    <h2>{title}</h2>
    <p>{description}</p>
  </div>
);

const SkillGaps = ({ gaps = [] }) => (
  <div>
    <SectionHeading
      eyebrow="Growth areas"
      title="Skills to strengthen"
      description="Prioritize high-severity gaps first, then use the lower-severity areas to polish your profile."
    />
    <div className="skill-grid">
      {gaps.map((gap) => (
        <article className="skill-card" key={gap.skill}>
          <div className={`severity-dot ${gap.severnity}`} />
          <h3>{gap.skill}</h3>
          <span className={`severity-label ${gap.severnity}`}>
            {gap.severnity} priority
          </span>
        </article>
      ))}
    </div>
  </div>
);

const PreparationPlan = ({ plan = [] }) => (
  <div>
    <SectionHeading
      eyebrow="Your roadmap"
      title="A practical preparation plan"
      description="Move through the days in sequence and keep each session focused."
    />
    <div className="plan-list">
      {plan.map((day) => (
        <article className="plan-day" key={day.day}>
          <div className="day-number">{String(day.day).padStart(2, "0")}</div>
          <div>
            <span className="section-kicker">Day {day.day}</span>
            <h3>{day.focus}</h3>
            <ul>
              {day.tasks?.map((task) => (
                <li key={task}>{task}</li>
              ))}
            </ul>
          </div>
        </article>
      ))}
    </div>
  </div>
);

const InputSummary = ({ report }) => (
  <div>
    <SectionHeading
      eyebrow="Your context"
      title="Inputs used for this report"
      description="These are the details the report was built from."
    />
    <div className="input-summary-grid">
      <InputCard title="JobTitle" value={report.jobTitle} />
      <InputCard title="Job description" value={report.jobDescription} />
      <InputCard title="Self description" value={report.selfDescription} />
    </div>
  </div>
);

const InputCard = ({ title, value }) => (
  <article className="input-summary-card">
    <h3>{title}</h3>
    <p>{value || "No input available."}</p>
  </article>
);

export default Report;

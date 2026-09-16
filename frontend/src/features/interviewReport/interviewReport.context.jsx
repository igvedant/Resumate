import { createContext, useState } from "react";

export const InterviewReportContext = createContext();

export const InterviewReportProvider = ({ children }) => {
  const [loading, setLoading] = useState(true);
  const [report, setReport] = useState(null);
  const [reportIds, setReportIds] = useState(null);

  return (
    <InterviewReportContext.Provider
      value={{
        loading,
        setLoading,
        report,
        setReport,
        reportIds,
        setReportIds,
      }}
    >
      {children}
    </InterviewReportContext.Provider>
  );
};

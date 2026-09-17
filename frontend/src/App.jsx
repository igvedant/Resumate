import "./App.css";
import { RouterProvider } from "react-router";
import { router } from "./app.routes";
import { AuthProvider } from "./features/auth/auth.provider";
import { InterviewReportProvider } from "./features/interviewReport/interviewReport.provider";

function App() {
  return (
    <AuthProvider>
      <InterviewReportProvider>
        <RouterProvider router={router}></RouterProvider>
      </InterviewReportProvider>
    </AuthProvider>
  );
}

export default App;

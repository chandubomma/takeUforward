import React from 'react'
import { BrowserRouter as Router,Routes, Route } from 'react-router-dom';
import CodeSubmissionForm from './pages/CodeSubmissionForm';
import CodeSubmissions from './pages/CodeSubmissions';
import { Toaster } from "sonner";

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<CodeSubmissionForm />} />
        <Route path="/submissions" element={<CodeSubmissions />} />
      </Routes>
      <Toaster position="top-center" richColors />
    </Router>
  )
}

export default App

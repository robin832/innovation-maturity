import { BrowserRouter, Routes, Route } from "react-router-dom";
import Landing   from "./pages/Landing";
import Report    from "./pages/Report";
import Proposal  from "./pages/Proposal";
import NotFound  from "./pages/NotFound";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/"         element={<Landing />} />
        <Route path="/report"   element={<Report />} />
        <Route path="/proposal" element={<Proposal />} />
        <Route path="*"         element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
}

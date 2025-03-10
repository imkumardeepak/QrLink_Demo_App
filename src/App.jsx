import { BrowserRouter, Route, Routes } from "react-router-dom";
import "./App.css";
import EmployeePage from "./pages/EmployeePage";
import EmployeeDetail from "./pages/EmployeeDetail";
import EmployeeProfile from "./pages/EmployeeProfile";

function App() {
  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<EmployeePage />} />
          <Route path="/employee/:id" element={<EmployeeDetail />} />
          <Route path="/employee/qrcode/:id" element={<EmployeeProfile />} />
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;

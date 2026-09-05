import { BrowserRouter } from "react-router-dom";

import Navbar from "./components/Navbar";
import Toast from "./components/Toast";
import AppRoutes from "./routes/AppRoutes";
import "./App.css";

function App() {
  return (
    <BrowserRouter>
      <Navbar />
      <Toast />
      <main className="main-content">
        <div className="container">
          <AppRoutes />
        </div>
      </main>
    </BrowserRouter>
  );
}

export default App;
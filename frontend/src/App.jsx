import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Menu from "./pages/Menu";
import About from "./pages/About";
import Reservations from "./pages/Reservations";
import Locations from "./pages/Locations";
import Order from "./pages/Order";
import Cart from "./pages/Cart";

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-black text-white selection:bg-red-500 selection:text-white">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/menu" element={<Menu />} />
          <Route path="/order" element={<Order />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/about" element={<About />} />

          <Route path="/reservations" element={<Reservations />} />
          <Route path="/locations" element={<Locations />} />
        </Routes>

      </div>
    </Router>
  );
}

export default App;

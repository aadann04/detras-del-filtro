import Navbar from "./components/Navbar.jsx";
import Hero from "./components/Hero.jsx";
import ModuleOne from "./components/ModuleOne.jsx";
import ModuleTwo from "./components/ModuleTwo.jsx";

import Footer from "./components/Footer.jsx";

import MissionTracker from "./components/MissionTracker";

function App() {
  return (
    <div className="bg-[#050608] min-h-screen text-white font-sans selection:bg-teal-500/30">
      <Navbar />
      <MissionTracker />
      <Hero />
      <main>
        <ModuleOne />
        <ModuleTwo />

      </main>
      <Footer />
    </div>
  );
}

export default App;

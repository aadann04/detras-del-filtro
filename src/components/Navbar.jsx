import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { GripHorizontal } from "lucide-react";

const navItems = [
    { id: "modulo1", label: "Módulo 1" },
    { id: "modulo2", label: "Módulo 2" },
];

const Navbar = () => {
    const [isExpanded, setIsExpanded] = useState(false);
    const [hoveredTab, setHoveredTab] = useState(null);
    const [showInicio, setShowInicio] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            if (window.scrollY > window.innerHeight * 0.5) {
                setShowInicio(true);
            } else {
                setShowInicio(false);
            }
        };

        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    const scrollToSection = (id) => {
        const element = document.getElementById(id);
        if (element) {
            const offset = 50;
            const elementPosition = element.getBoundingClientRect().top + window.scrollY;
            const offsetPosition = elementPosition + offset;

            window.scrollTo({
                top: offsetPosition,
                behavior: "smooth"
            });
        }
    };

    return (
        <div className="fixed top-8 left-0 right-0 z-50 flex justify-center pointer-events-none">
            <motion.nav
                layout
                initial={{ borderRadius: 50, width: "auto" }}
                animate={{
                    width: "auto",
                    padding: isExpanded ? "6px" : "12px"
                }}
                transition={{ type: "spring", stiffness: 300, damping: 30 }}
                className="pointer-events-auto bg-black/50 backdrop-blur-md border border-white/10 shadow-2xl flex items-center justify-center overflow-hidden"
                style={{ borderRadius: 50 }}
                onMouseEnter={() => setIsExpanded(true)}
                onMouseLeave={() => { setIsExpanded(false); setHoveredTab(null); }}
            >
                <AnimatePresence mode="popLayout" initial={false}>
                    {!isExpanded ? (
                        <motion.div
                            key="collapsed"
                            initial={{ opacity: 0, scale: 0.5 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.5 }}
                            transition={{ duration: 0.2 }}
                            className="flex items-center justify-center"
                        >
                            <GripHorizontal className="text-white/80" size={20} />
                        </motion.div>
                    ) : (
                        <motion.div
                            key="expanded"
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            transition={{ duration: 0.2, delay: 0.1 }}
                            className="flex items-center gap-1"
                        >
                            <AnimatePresence mode="popLayout">
                                {showInicio && (
                                    <motion.button
                                        layout
                                        initial={{ width: 0, opacity: 0, scale: 0.8 }}
                                        animate={{ width: "auto", opacity: 1, scale: 1 }}
                                        exit={{ width: 0, opacity: 0, scale: 0.8 }}
                                        transition={{ type: "spring", stiffness: 400, damping: 30 }}
                                        key="inicio"
                                        onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                                        onMouseEnter={() => setHoveredTab("inicio")}
                                        className="relative px-5 py-2.5 text-sm font-medium text-white/80 hover:text-white transition-colors rounded-full overflow-hidden whitespace-nowrap"
                                    >
                                        {hoveredTab === "inicio" && (
                                            <motion.div
                                                layoutId="nav-highlight"
                                                className="absolute inset-0 bg-white/10 rounded-full"
                                                initial={false}
                                                transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                                            />
                                        )}
                                        <span className="relative z-10">Inicio</span>
                                    </motion.button>
                                )}
                            </AnimatePresence>

                            {navItems.map((item) => (
                                <motion.button
                                    layout
                                    key={item.id}
                                    onClick={() => scrollToSection(item.id)}
                                    onMouseEnter={() => setHoveredTab(item.id)}
                                    className="relative px-5 py-2.5 text-sm font-medium text-white/80 hover:text-white transition-colors rounded-full whitespace-nowrap"
                                >
                                    {hoveredTab === item.id && (
                                        <motion.div
                                            layoutId="nav-highlight"
                                            className="absolute inset-0 bg-white/10 rounded-full"
                                            initial={false}
                                            transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                                        />
                                    )}
                                    <span className="relative z-10">{item.label}</span>
                                </motion.button>
                            ))}
                        </motion.div>
                    )}
                </AnimatePresence>
            </motion.nav>
        </div>
    );
};

export default Navbar;

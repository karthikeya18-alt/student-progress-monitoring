import React from "react";
import { Link } from "react-router-dom";
import Particles from "react-tsparticles";
import { loadFull } from "tsparticles";
import "./page.css";

const LandingPage = () => {
    const particlesInit = async (main) => {
        await loadFull(main);
    };

    return (
        <div className="landing-container">
            <Particles
                id="tsparticles"
                init={particlesInit}
                options={{
                    fpsLimit: 60,
                    interactivity: {
                        events: {
                            onHover: { enable: true, mode: "repulse" },
                            resize: true,
                        },
                        modes: {
                            repulse: { distance: 100, duration: 0.4 },
                        },
                    },
                    particles: {
                        color: { value: "#ffffff" },
                        links: { enable: true, color: "#ffffff", distance: 150 },
                        move: { enable: true, speed: 2 },
                        number: { value: 80 },
                        opacity: { value: 0.5 },
                        shape: { type: "circle" },
                        size: { value: { min: 1, max: 3 } },
                    },
                }}
            />

            <div className="content">
                {/* Removed typewriter class here */}
                <h1 className="typewriter">Welcome to DataValley</h1>
                <Link to="/login">
                    <button className="login-btn">Login</button>
                </Link>
            </div>
        </div>
    );
};

export default LandingPage;

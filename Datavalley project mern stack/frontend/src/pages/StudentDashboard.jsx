import React, { useEffect, useState } from 'react';
import { getPerformanceData } from './api';
import { useNavigate } from "react-router-dom";

const StudentDashboard = () => {
    const navigate = useNavigate();
    const [students, setStudents] = useState([]);
    const [user, setUser] = useState(null);
    const [progressList, setProgressList] = useState([]);
    const [animatedProgress, setAnimatedProgress] = useState([]);
    const [showCourses, setShowCourses] = useState(true);
    const [courses, setCourses] = useState([]);
    const [shouldFetchPerformance, setShouldFetchPerformance] = useState(true);

    // Load user from localStorage once
    useEffect(() => {
        const storedUser = JSON.parse(localStorage.getItem('user'));
        if (storedUser) setUser(storedUser);
    }, []);

    // Fetch all students performance data once
    useEffect(() => {
        getPerformanceData()
            .then(data => setStudents(data))
            .catch(error => console.error("Error fetching data:", error));
    }, []);

    // When triggered, match current user and build progressList + animate bars
    useEffect(() => {
        if (shouldFetchPerformance && user && students.length > 0) {
            const matchedStudent = students.find(s => s.name === user.name);
            if (matchedStudent && Array.isArray(matchedStudent.subject) && Array.isArray(matchedStudent.progress)) {
                const subjects = matchedStudent.subject;
                const progress = matchedStudent.progress.map(p => parseInt(p) || 0);
                const initialAnimated = subjects.map(() => 0);

                setProgressList(subjects.map((sub, i) => ({
                    subject: sub,
                    progress: progress[i]
                })));
                setAnimatedProgress(initialAnimated);

                progress.forEach((target, i) => {
                    let value = 0;
                    const interval = setInterval(() => {
                        value += 10;
                        setAnimatedProgress(prev => {
                            const updated = [...prev];
                            updated[i] = Math.min(value, target);
                            return updated;
                        });
                        if (value >= target) clearInterval(interval);
                    }, 50);
                });
            }
            setShouldFetchPerformance(false);
        }
    }, [shouldFetchPerformance, students, user]);

    // Generate dynamic courses from progressList with status
    const fetchCourses = () => {
        const dynamicCourses = progressList.map((entry, index) => {
            const status = entry.progress >= 90 ? "Completed" : entry.progress >= 40 ? "In Progress" : "Not Started";
            return {
                id: index + 1,
                title: entry.subject,
                status
            };
        });
        return Promise.resolve(dynamicCourses);
    };

    // Handle showing courses - fetch performance first if needed
    const handleShowCourses = () => {
        if (progressList.length === 0) {
            setShouldFetchPerformance(true);
            setShowCourses(true);
        } else {
            fetchCourses().then(data => setCourses(data));
            setShowCourses(true);
        }
    };

    // Handle showing performance bars
    const handleShowProgress = () => {
        setShowCourses(false);
        setShouldFetchPerformance(true);
    };

    // When performance is ready and "My Course" active, update courses dynamically
    useEffect(() => {
        if (!shouldFetchPerformance && showCourses && progressList.length > 0) {
            fetchCourses().then(data => setCourses(data));
        }
    }, [shouldFetchPerformance, showCourses, progressList]);

    return (
        <div style={{ textAlign: "center", fontFamily: "Arial, sans-serif", backgroundColor: "#f5f5f5", margin: "-10px", height: "100vh" }}>
            <div className='admin-dashboard'>
                <div style={{ position: "absolute", top: "20px", right: "20px" }}>
                    <button
                        style={{
                            padding: "10px 20px",
                            fontSize: "16px",
                            backgroundColor: "#ff4d4d",
                            color: "white",
                            border: "none",
                            borderRadius: "5px",
                            cursor: "pointer"
                        }}
                        onClick={() => navigate("/login")}
                    >
                        Logout
                    </button>
                </div>
                {user && (
                    <h2 style={{fontSize: "24px", marginBottom: "10px" }}>
                        Welcome, {user.name}!
                    </h2>
                )}

                <div style={{ display: "flex", justifyContent: "center", gap: "16px", marginBottom: "20px" }}>
                    <button
                        onClick={handleShowCourses}
                        style={{
                            padding: "10px 20px",
                            fontSize: "16px",
                            backgroundColor: showCourses ? "#2196F3" : "#90caf9",
                            color: "white",
                            border: "none",
                            borderRadius: "5px",
                            cursor: "pointer",
                            width: "150px"
                        }}
                    >
                        My Course
                    </button>
                    <button
                        onClick={handleShowProgress}
                        style={{
                            padding: "10px 20px",
                            fontSize: "16px",
                            backgroundColor: !showCourses ? "#4CAF50" : "#a5d6a7",
                            color: "white",
                            border: "none",
                            borderRadius: "5px",
                            cursor: "pointer",
                            width: "150px"
                        }}
                    >
                        Get My Performance
                    </button>
                </div>
            </div>

            <div style={{ width: "80%", margin: "0 auto" }}>
                    {showCourses ? (
                        <div>
                            <h3 style={{ color: "#333", marginBottom: "15px", fontWeight: "600" }}></h3>
                            {courses.length > 0 ? (
                                courses.map(course => (
                                    <div key={course.id} style={{
                                        background: "#fff",
                                        padding: "12px 16px",
                                        borderRadius: "6px",
                                        boxShadow: "0 2px 6px rgba(0,0,0,0.08)",
                                        marginBottom: "15px",
                                        textAlign: "left"
                                    }}>
                                        <p style={{ fontWeight: "700", fontSize: "16px", marginBottom: "4px" }}>{course.title}</p>
                                        <p style={{ fontSize: "14px", color: course.status === "Completed" ? "#388E3C" : course.status === "In Progress" ? "#FBC02D" : "#D32F2F", fontWeight: "600" }}>
                                            Status: {course.status}
                                        </p>
                                        <button style={{
                                            padding: "8px 16px",
                                            backgroundColor: "#4CAF50",
                                            color: "white",
                                            border: "none",
                                            borderRadius: "4px",
                                            cursor: "pointer"
                                        }}>Go To Course</button>
                                    </div>
                                ))
                            ) : (
                                <p>No courses enrolled.</p>
                            )}
                        </div>
                    ) : (
                        <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
                            {progressList.map((entry, index) => (
                                <div
                                    key={index}
                                    style={{
                                        width: "80%",
                                        background: "#fff",
                                        padding: "12px 16px",
                                        borderRadius: "6px",
                                        boxShadow: "0 2px 6px rgba(0,0,0,0.08)",
                                        textAlign: "left",
                                        margin: "10px"
                                    }}
                                >
                                    <h3 style={{ color: "#333", marginBottom: "8px", fontWeight: "600", fontSize: "16px" }}>
                                        Your Progress in
                                    </h3>
                                    <p style={{ fontWeight: "700", color: "#4CAF50", fontSize: "16px", marginBottom: "6px", textTransform: "uppercase" }}>
                                        {entry.subject}
                                    </p>
                                    <div style={{ width: "100%", background: "#ddd", height: "16px", borderRadius: "8px", overflow: "hidden" }}>
                                        <div
                                            style={{
                                                width: `${animatedProgress[index]}%`,
                                                height: "100%",
                                                background: "#4CAF50",
                                                borderRadius: "8px",
                                                transition: "width 0.3s ease-in-out",
                                            }}
                                        ></div>
                                    </div>
                                    <p style={{ fontSize: "12px", color: "#555", marginTop: "6px", fontWeight: "600", textAlign: "right" }}>
                                        {animatedProgress[index]}%
                                    </p>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
        </div>
    );
};

export default StudentDashboard;

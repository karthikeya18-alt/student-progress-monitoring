import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from "react-router-dom";

const BACKEND_URL = "http://localhost:3000";  // adjust to your backend base URL

const Faculty = () => {
  const [students, setStudents] = useState([]);
  const [user, setUser] = useState(null);
  const [newCourseInputs, setNewCourseInputs] = useState({}); // key: studentId, value: input text
  const navigate = useNavigate();
    useEffect(() => {
            const storedUser = JSON.parse(localStorage.getItem('user'));
            if (storedUser) setUser(storedUser);
        }, []);

  useEffect(() => {
    // Fetch and normalize data
    axios.get(`${BACKEND_URL}/performance`)
      .then(({ data }) => {
        const initialized = data.map(student => {
          const subjects = Array.isArray(student.subject)
            ? student.subject
            : typeof student.subject === 'string'
              ? student.subject.split(',').map(s => s.trim())
              : [];

          let progress = [];
          if (Array.isArray(student.progress)) {
            progress = student.progress.map(p => parseInt(p));
          } else if (typeof student.progress === 'string') {
            progress = student.progress.split(',').map(p => parseInt(p.trim()));
          } else if (typeof student.progress === 'number') {
            progress = [student.progress];
          }

          const animatedProgress = progress.map(() => 0);

          return {
            ...student,
            subject: subjects,
            progress,
            animatedProgress,
          };
        });

        setStudents(initialized);

        // Animate progress bars
        initialized.forEach((student, studentIndex) => {
          student.progress.forEach((targetProgress, subjectIndex) => {
            const interval = setInterval(() => {
              setStudents(prev => {
                const updated = [...prev];
                const animated = updated[studentIndex].animatedProgress[subjectIndex];

                if (animated < targetProgress) {
                  updated[studentIndex].animatedProgress[subjectIndex] = Math.min(animated + 2, targetProgress);
                } else {
                  clearInterval(interval);
                }

                return updated;
              });
            }, 50);
          });
        });
      })
      .catch(error => console.error("Error fetching data:", error));
  }, []);

  const handleInputChange = (studentId, value) => {
    setNewCourseInputs(prev => ({ ...prev, [studentId]: value }));
  };

  const clearInput = (studentId) => {
    setNewCourseInputs(prev => ({ ...prev, [studentId]: '' }));
  };

  const handleSaveCourse = async (studentId) => {
    const newCourse = newCourseInputs[studentId];
    if (!newCourse || !newCourse.trim()) return;

    try {
      const response = await axios.put(`${BACKEND_URL}/performance/${studentId}`, {
        newSubject: newCourse.trim()
      });

      if (response.status === 200 || response.status === 204) {
        setStudents(prev => prev.map(student => {
          if (student._id === studentId) {
            return {
              ...student,
              subject: [...student.subject, newCourse.trim()],
              progress: [...student.progress, 0],
              animatedProgress: [...student.animatedProgress, 0],
            };
          }
          return student;
        }));
        clearInput(studentId);
      } else {
        console.error("Failed to add course", response);
      }
    } catch (error) {
      console.error("Failed to add course", error);
    }
  };

  return (
    <div style={{
      textAlign: "center",
      fontFamily: "Arial, sans-serif",
      backgroundColor: "#f5f5f5",
      minHeight: "100vh",
      margin: "-10px",
      paddingBottom: "30px"
    }}>
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
        <h2 style={{ color: "#4CAF50", fontSize: "24px", marginBottom: "20px" }}>Students Performance</h2>
      </div>

      <div style={{ display: "flex", flexWrap: "wrap", justifyContent: "center" }}>
        {students.length > 0 ? (
          students.map((student, studentIndex) => (
            <div key={student._id} style={{
              width: "80%",
              background: "#fff",
              padding: "20px",
              margin: "15px",
              borderRadius: "8px",
              boxShadow: "0 4px 10px rgba(0,0,0,0.1)",
              textAlign: "left"
            }}>
              <h3 style={{ color: "#333", marginBottom: "15px", textTransform: "capitalize" }}>{student.name}</h3>

              {student.subject.map((subj, subjIndex) => (
                <div key={subjIndex} style={{ marginBottom: "15px" }}>
                  <p style={{ fontWeight: "bold", color: "#555", marginBottom: "6px" }}>{subj}</p>
                  <div style={{
                    width: "100%",
                    background: "#ddd",
                    height: "20px",
                    borderRadius: "10px",
                    overflow: "hidden",
                    position: "relative"
                  }}>
                    <div style={{
                      width: `${student.animatedProgress[subjIndex]}%`,
                      height: "100%",
                      background: "#4CAF50",
                      transition: "width 0.3s ease-in-out",
                      borderRadius: "10px"
                    }}></div>
                  </div>
                  <p style={{
                    fontSize: "14px",
                    color: "#777",
                    marginTop: "5px"
                  }}>{student.animatedProgress[subjIndex]}%</p>
                </div>
              ))}

              {/* Add Course Input & Button */}
              <div style={{ marginTop: "15px" }}>
                <input
                  type="text"
                  value={newCourseInputs[student._id] || ''}
                  onChange={(e) => handleInputChange(student._id, e.target.value)}
                  placeholder="Enter new course"
                  style={{
                    padding: "8px",
                    fontSize: "14px",
                    width: "60%",
                    marginRight: "10px",
                    borderRadius: "4px",
                    border: "1px solid #ccc"
                  }}
                />
                <button
                  onClick={() => handleSaveCourse(student._id)}
                  style={{
                    padding: "8px 16px",
                    backgroundColor: "#4CAF50",
                    color: "white",
                    border: "none",
                    borderRadius: "4px",
                    cursor: "pointer"
                  }}
                >
                  Save
                </button>
              </div>
            </div>
          ))
        ) : (
          <p style={{ color: "#999", fontSize: "18px" }}>Loading student data...</p>
        )}
      </div>
    </div>
  );
};

export default Faculty;

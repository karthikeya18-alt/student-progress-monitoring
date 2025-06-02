import React, { useState, useEffect } from 'react';
import axios from 'axios';
import styled from 'styled-components';
import { getUsers, saveUser } from './api';
import './page.css';
import { Link } from "react-router-dom";

const StyledWrapper = styled.div`
  display: flex;
  justify-content: center;
  flex-wrap: wrap;
  gap: 10px;
  margin: 20px 0;
`;

const TopRightButtonWrapper = styled.div`
  position: absolute;
  top: 20px;
  right: 20px;
`;

const StyledCard = styled.div`
  background: white;
  color: #1c1c1e;
  border: 1px solid #ccc;
  border-radius: 16px;
  padding: 24px;
  width: 60%;
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin: 12px auto;
  box-shadow: 0 6px 18px rgba(0, 0, 0, 0.1);
  transition: all 0.3s ease-in-out;
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;

  &:hover {
    transform: translateY(-4px);
    box-shadow: 0 8px 24px rgba(0, 0, 0, 0.15);
  }
`;

const UserInfo = styled.div`
  flex: 0.4;
  padding-left: 10px;
`;

const ButtonContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
  padding-right: 10px;
`;

const StyledButton = styled.button`
  padding: 10px 18px;
  border: none;
  background: #007bff;
  color: white;
  font-weight: bold;
  border-radius: 8px;
  cursor: pointer;
  transition: background 0.3s;

  &:hover {
    background: #0056b3;
  }
`;

const DeleteButton = styled.button`
  padding: 10px 18px;
  border: none;
  background: #ff4d4d;
  color: white;
  font-weight: bold;
  border-radius: 8px;
  cursor: pointer;
  transition: background 0.3s;

  &:hover {
    background: #cc0000;
  }
`;

const Input = styled.input`
  margin: 6px 0;
  padding: 8px;
  width: 90%;
  border-radius: 6px;
  border: 1px solid #ccc;
  background-color: #f9f9f9;
  color: #333;
`;

const RoleLabel = styled.div`
  margin: 6px 0;
  padding: 8px;
  width: 90%;
  border-radius: 6px;
  background-color: #eee;
  color: #666;
  font-weight: bold;
  text-align: center;
`;

const Admin = () => {
  const [section, setSection] = useState(null);
  const [data, setData] = useState([]);
  const [editingUserId, setEditingUserId] = useState(null);
  const [editedUser, setEditedUser] = useState(null);
  const [addingUser, setAddingUser] = useState(false);
  const [newUser, setNewUser] = useState({ name: '', email: '', password: '', role: '' });

  useEffect(() => {
    if (section) {
      getUsers()
        .then(res => setData(res.filter(user => user.role === section)))
        .catch(err => console.error("Error fetching users:", err));
    }
  }, [section]);

  const handleSectionChange = (newSection) => {
    setSection(newSection);
    setAddingUser(false);
  };

  const handleEdit = (user) => {
    setEditingUserId(user._id);
    setEditedUser({ ...user });
  };

  const handleInputChange = (field, value) => {
    setEditedUser(prev => ({ ...prev, [field]: value }));
  };

  const handleSave = async () => {
    if (!editedUser || !editedUser.name || !editedUser.email) {
      alert("Please fill all required fields.");
      return;
    }

    const updatedData = {
      name: editedUser.name,
      email: editedUser.email,
      password: editedUser.password,
      role: editedUser.role,
    };

    try {
      await saveUser(editingUserId, updatedData);
      setEditingUserId(null);
      setEditedUser(null);
      const updated = await getUsers();
      setData(updated.filter(u => u.role === section));
    } catch (error) {
      console.error("Error saving user:", error);
      alert("Failed to save. Check console for error.");
    }
  };

  const handleDelete = async (user) => {
    if (!window.confirm(`Are you sure you want to delete ${user.name}?`)) return;
    try {
      await axios.delete(`http://localhost:3000/users/${user._id}`);
      const updated = await getUsers();
      setData(updated.filter(u => u.role === section));
    } catch (error) {
      console.error("Error deleting user:", error);
    }
  };

  const handleNewUserChange = (field, value) => {
    setNewUser(prev => ({ ...prev, [field]: value }));
  };

  const handleAddUser = async () => {
    if (!newUser.name || !newUser.email || !newUser.password || !newUser.role) {
      alert("Fill all fields!");
      return;
    }

    try {
      await axios.post('http://localhost:3000/users', newUser);
      setNewUser({ name: '', email: '', password: '', role: '' });
      setAddingUser(false);
      const updated = await getUsers();
      setData(updated.filter(u => u.role === section));
    } catch (error) {
      console.error("Error adding user:", error);
      alert("Add user failed");
    }
  };

  return (
    <div className="main-admin-con">
      <TopRightButtonWrapper>
        <StyledButton onClick={() => setAddingUser(!addingUser)}>
          {addingUser ? "Cancel" : "Add User"}
        </StyledButton>
        <Link to="/login">
          <StyledButton style={{ background: "#ff4d4d", marginLeft: "10px" }}>Logout</StyledButton>
        </Link>
      </TopRightButtonWrapper>

      <div className="admin-dashboard" style={{ textAlign: "center" }}>
        <h2 style={{ color: "#333" }}>Admin Dashboard</h2>
        <StyledWrapper>
          <StyledButton onClick={() => handleSectionChange("student")}>Manage Students</StyledButton>
          <StyledButton onClick={() => handleSectionChange("faculty")}>Manage Faculty</StyledButton>
          <StyledButton onClick={() => handleSectionChange("admin")}>Manage Admins</StyledButton>
        </StyledWrapper>
      </div>

      <div className="" style={{ padding: "20px" }}>
        {addingUser && (
          <div style={{ margin: "20px 0", display: "flex", flexDirection: "column", alignItems: "center" }}>
            <Input type="text" placeholder="Name" value={newUser.name} onChange={e => handleNewUserChange("name", e.target.value)} />
            <Input type="email" placeholder="Email" value={newUser.email} onChange={e => handleNewUserChange("email", e.target.value)} />
            <Input type="text" placeholder="Password" value={newUser.password} onChange={e => handleNewUserChange("password", e.target.value)} />
            <Input type="text" placeholder="Role" value={newUser.role} onChange={e => handleNewUserChange("role", e.target.value)} />
            <StyledButton onClick={handleAddUser} style={{ marginTop: "10px" }}>Save User</StyledButton>
          </div>
        )}

        {data.map(user => (
          <StyledCard key={user._id}>
            {editingUserId === user._id ? (
              <>
                <UserInfo>
                  <Input type="text" value={editedUser.name} onChange={e => handleInputChange("name", e.target.value)} placeholder="Name" />
                  <Input type="email" value={editedUser.email} onChange={e => handleInputChange("email", e.target.value)} placeholder="Email" />
                  <Input type="text" value={editedUser.password} onChange={e => handleInputChange("password", e.target.value)} placeholder="Password" />
                  <Input type="text" value={editedUser.role} onChange={e => handleInputChange("role", e.target.value)} placeholder="Role" />
                </UserInfo>
                <ButtonContainer>
                  <StyledButton onClick={handleSave}>Save</StyledButton>
                  <DeleteButton onClick={() => {
                    setEditingUserId(null);
                    setEditedUser(null);
                  }}>Cancel</DeleteButton>
                </ButtonContainer>
              </>
            ) : (
              <>
                <UserInfo>
                  <h4>{user.name}</h4>
                  <p>{user.email}</p>
                  <RoleLabel>{user.role}</RoleLabel>
                </UserInfo>
                <ButtonContainer>
                  <StyledButton onClick={() => handleEdit(user)}>Edit</StyledButton>
                  <DeleteButton onClick={() => handleDelete(user)}>Delete</DeleteButton>
                </ButtonContainer>
              </>
            )}
          </StyledCard>
        ))}
      </div>
    </div>
  );
};

export default Admin;

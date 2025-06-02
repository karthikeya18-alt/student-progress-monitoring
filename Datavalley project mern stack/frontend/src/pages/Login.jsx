import React, { useState } from 'react';
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {getUsers,validateUser} from './api'
import StudentDashboard from './StudentDashboard';
import './page.css'

const Login = () => {
    const navigate = useNavigate()
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [data,setData] = useState({data:undefined,success:"hi"});

    async function callvalidateUser(e){
        e.preventDefault()
        let x={
            email:email,
            password:password
        }
        let pro= await validateUser(x)
        console.log(pro.data.data);
        let xx=pro.data
        console.log(xx)
        setData(xx)
    }

    useEffect(()=>{
        console.log(data.data)
        if(data.success==true){
            if(data.data.role=="student"){
                navigate("/StudentDashboard")
            }
            else if(data.data.role=="faculty"){
                navigate("/Faculty")
            }
            else if(data.data.role=="admin"){
                navigate("/Admin")
            }
            else{
                alert("Invalid User,Unidentifies role")
            }
            localStorage.setItem('user', JSON.stringify(data.data)); // Stores an array
        }else{
            if(data.success==false){
                alert(data.message)
            }
        }
        
    },[data])
    return (
        <div className='login-main-con'>
            <form className="form">
                <p className="form-title">Log in to your account</p>
                <div className="input-container">
                <input type="email" placeholder="Email" onChange={(e) => setEmail(e.target.value)} />
                </div>
                <div className="input-container">
                <input type="password" placeholder="Password" onChange={(e) => setPassword(e.target.value)} />
                </div>
                <button className="submit" type="submit"  onClick={callvalidateUser}>
                Login
                </button>
                
            </form>
        </div>
        
    );
};


export default Login;
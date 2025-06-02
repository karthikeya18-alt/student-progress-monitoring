import axios from "axios"

export async function getUsers(){
    const res = await axios.get('http://localhost:3000/users')
            console.log(res.data)
            if (res.status==200){
                return res.data
            }
}

export async function validateUser(user){
    const res = await axios.post('http://localhost:3000/users/login',user)
    console.log(res)
    if(res.data.success)
    {
        return res
    }
    else{
        return res
    }

}

export async function getPerformanceData(){
    const res = await axios.get('http://localhost:3000/performance')
            console.log(res.data)
            if (res.status==200){
                return res.data
            }
}

export async function saveUser(id,data){
    console.log(id)
    console.log(data)
    const res = await axios.put(`http://localhost:3000/users/${id}`, data)
            console.log(res.data)
            if (res.status==200){
                return res.data
            }
}

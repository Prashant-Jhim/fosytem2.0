"use client"
import { collection, deleteDoc, doc, getDocs, getFirestore, updateDoc } from 'firebase/firestore'
import { useEffect,useState } from 'react'
import app from '../database/db'
const Auth = () =>{
    const db = getFirestore(app)
    const colref = collection(db,'users')
    const [users,changeuserdata] = useState([])
    // Function To Fetch All The Users Details
    const FetchUsers = async() =>{
        const GetDocInstance = await getDocs(colref)
        const Docs = GetDocInstance.docs.map((snapshot)=>{
            const Data = snapshot.data()
            return {Type:Data.Type,Name:Data.Name,Email:Data.Email,id:snapshot.id}
        })
        console.log(Docs)
        changeuserdata(Docs)
    }
    // Function To Call Search For Particular Keyword 
    const SearchThrough = (event)=>{
       
    }
    // UseEffect To Run During Rendering 
    useEffect(()=>{
        FetchUsers()
    },[])
    // Card Component for searched employee
    const Card = (props) =>{
        // Function To Make User Employee or Simple User 
        const UserOrEmp = async(event) =>{
            const type = event.target.value
            const Doc = doc(db,"users",props.id)
            console.log(props.id)
            console.log(type)
            if (type == "User"){
                const update = await updateDoc(Doc,{Type:"Employee"})
                FetchUsers()
            }
            if (type == "Employee"){
                const update = await updateDoc(Doc,{Type:"User"})
                FetchUsers()
            }
            if (type == "Delete"){
                const Del = await deleteDoc(Doc)
                FetchUsers()
            }
        }
        
        if (props.Type == "User"){
            return (
                <div className = "flex rounded border mt-3 p-6 border-black shadow-lg flex-col">
                    <h3>{props.Name}</h3>
                    <p>{props.Email}</p>
                    <div className = "mt-3">
                        <button value = "User" onClick = {UserOrEmp} className = "border-2 border-black p-3 bg-green-500 text-white rounded">Make Employee</button>
                        <button value = "Delete" onClick = {UserOrEmp} className = "border-2 border-black p-3 bg-red-500 text-white rounded ml-4">Delete User</button>
                    </div>
                </div>
            )
        }
        if (props.Type == "Employee"){
            return (
                <div className = "flex rounded border mt-3 p-6 border-black shadow-lg flex-col">
                    <h3>{props.Name}</h3>
                    <p>{props.Email}</p>
                    <div className = "mt-3">
                        <button value = "Employee" onClick = {UserOrEmp} className = "border-2 border-black p-3 bg-green-500 text-white rounded">Make Customer</button>
                        <button value = "Delete" onClick = {UserOrEmp} className = "border-2 border-black p-3 bg-red-500 text-white rounded ml-4">Delete User</button>
                    </div>
                </div>
            )
        }
    }
    return(
        <div className = "flex flex-col w-full">
            <button className = "fixed top-3 left-3 text-3xl">⏪Back</button>
            <h1 className = "self-center mt-24 font-title text-5xl">FOSystem2.0🥗</h1>
            <div className = 'mt-14 self-center'>
                <input className = "w-80 xl:w-80 2xl:w-80 md:w-80 sm:w-11/12 border-0 border-b-2 border-black text-xl p-3" type = "text" placeholder = "Enter The UserName;" />
                <h3 className = 'mt-6 mb-3'>Search Result : {users.length}</h3> 
               {users.map((data)=> <Card Type = {data.Type} Name = {data.Name} id = {data.id} Email = {data.Email}/>)}
            </div>
        </div>
    )
}
export default Auth
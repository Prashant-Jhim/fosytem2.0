"use client"
import { useRouter } from "next/navigation"
import app from '../database/db'
import {useEffect ,useState} from 'react'
import {  doc, getDoc, getFirestore, updateDoc } from "firebase/firestore"
const Profile = () =>{
    // Details 
    const [Details,ChangeDetails] = useState({Name:"",Email:""})
    // Database Collection Ref
    const db = getFirestore(app)
    const Router = useRouter()
    // Function to Get Back To Menu 
    const Back =  ( ) =>{
        Router.push('/menu')
    }
    // function To Change Time for Link Validation 
    const TimeChange = async() =>{
        const id = window.localStorage.getItem("ID")
        const docs = doc(db,'users',id)
        const update = {time:Date.now()}
        const sendtodb = await updateDoc(docs,update)
        console.log(sendtodb)
        
    }

    // function To Change The Password 
    const ChangePassword = async() =>{
        const details = {
            Type:"Change",
            Name:Details.Name,
            Email:Details.Email,
            id :window.localStorage.getItem("ID"),
            url:window.location.origin
        }
        const Request = await fetch('/api/email',{
            method:"POST",
            headers:{"Content-Type":"application/json"},
            body:JSON.stringify(details)
        })
        const Response = await Request.json()
        if (Response.status == true){
            TimeChange()
            document.getElementById("alert").style.display = 'flex'

            setTimeout(()=>{
                document.getElementById("alert").style.display = 'none'
            },3000)
        }
    }
    // Function To Delete The Password 
    const DeleteAcc = async( )=>{
        const details = {
            Type:"Delete",
            Name:Details.Name,
            Email:Details.Email,
            id :window.localStorage.getItem("ID"),
            url:window.location.origin
        }
        const Request = await fetch('/api/email',{
            method:"POST",
            headers:{"Content-Type":"application/json"},
            body:JSON.stringify(details)
        })
        const Response = await Request.json()
        if (Response.status == true){
            TimeChange()
            document.getElementById("alert").style.display = 'flex'
            setTimeout(()=>{
                document.getElementById("alert").style.display = 'none'
            },3000)
        }
    }
    // Function To Check User is Login or Not 
    const LoginOrNot = async( ) =>{
        const ID = window.localStorage.getItem("ID")
        if (ID != undefined){
            const docinstance = doc(db,'users',ID)
            const getdocInstance = await getDoc(docinstance)
            const Data = getdocInstance.data()
            if (Data != undefined){
                ChangeDetails(Data)
            }
            if (Data == undefined){
                Router.push("/")
            }

        }
        if (ID == undefined){
            Router.push("/")
        }
    }

    // UseEffect To Call Function 
    useEffect(()=>{
        LoginOrNot()
    },[])


    return (
        <div className = "flex flex-col w-full items-center">
        <button onClick = {Back} className = "fixed top-3 left-6 text-3xl">⏮️Back</button>
        <h1 className = "text-5xl mt-24 text-red-600 font-title">FOSystem2.0🥗</h1>
        <p id = "alert" className = 'text-lg p-3 mt-6 hidden border border-black bg-green-400 text-black rounded'>Link Sent To Email 📧</p>
        <div className = "flex mt-24 flex-col">
            <label className='text-2xl'>Name</label>
            <input className="text-xl border-0 border-b-2 outline-none border-b-black h-14 p-6 mb-6" type = "text" placeholder = {Details.Name}/>
            <label className = "text-2xl">Email</label>
            <input className="text-xl border-0 outline-none border-b-2 border-b-black h-14 p-6 mb-6" type = "text" value = {Details.Email} />
            <button className = "border border-2 border-black h-14 text-2xl rounded bg-green-500 text-white active:bg-white active:text-green-500 active:shadow-lg">Save✅</button>
        </div>
        <h2 className = "mt-6 mb-6 ">OR</h2>
        <div className = "flex flex-row ">
            <button onClick = {ChangePassword} className = 'border border-black p-4 rounded mr-3 shadow-lg text-black  bg-blue-200 active:bg-white active:text-blue-500 active:shadow-xl '>Change Password🆕</button>
            <button onClick = {DeleteAcc} className = "border border-black p-4 rounded shadow-lg bg-red-500 text-white active:bg-white active:text-red-500 active:shadow-xl">Delete Password</button>
        </div>
        </div>
    )
}
export default Profile
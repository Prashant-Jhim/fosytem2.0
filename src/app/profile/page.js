"use client"
import { useRouter } from "next/navigation"
import app from '../database/db'
import {useEffect ,useState} from 'react'
import { doc, getDoc, getFirestore } from "firebase/firestore"
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
        <div className = "flex mt-24 flex-col">
            <label className='text-2xl'>Name</label>
            <input className="text-xl border-0 border-b-2 outline-none border-b-black h-14 p-6 mb-6" type = "text" placeholder = {Details.Name}/>
            <label className = "text-2xl">Email</label>
            <input className="text-xl border-0 outline-none border-b-2 border-b-black h-14 p-6 mb-6" type = "text" value = {Details.Email} />
            <button className = "border border-2 border-black h-14 text-2xl rounded bg-green-500 text-white active:bg-white active:text-green-500 active:shadow-lg">Save✅</button>
        </div>
        <h2 className = "mt-6 mb-6 ">OR</h2>
        <div className = "flex flex-row ">
            <button className = 'border border-black p-4 rounded mr-3 shadow-lg text-black  bg-blue-200 active:bg-white active:text-blue-500 active:shadow-xl '>Change Password🆕</button>
            <button className = "border border-black p-4 rounded shadow-lg bg-red-500 text-white active:bg-white active:text-red-500 active:shadow-xl">Delete Password</button>
        </div>
        </div>
    )
}
export default Profile
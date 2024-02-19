'use client'
import app from './db/db'
import { useEffect,useState } from 'react'
import { useParams, useRouter } from "next/navigation"
import {addDoc,updateDoc,doc, collection,getDocs,query,where, getFirestore, getDoc, deleteDoc} from 'firebase/firestore'
const bcrypt = require('bcryptjs')

const page = () =>{
    // part To change username 
    const [User,Changeuser] = useState("")
    // to Navigate to Other part
    const Router = useRouter()
    // part to get id of user
    const params = useParams()
    const id = params.id 
    const split = id.split("~")
    const Type = split[0]
    const IDofUser = split[1]
    // collection ref
    const db = getFirestore(app)
    const colref = collection(db,"users")
   
    // preload function 
    const preload = async()=>{
      
       const docs = doc(db,"users",IDofUser)
        const data = await getDoc(docs)
        const details = data.data()
        if(details == undefined){
            alert("Link is Invalid ❌")
            Router.push("/")
        }
        if (details != undefined){
            Changeuser(details.Name)
        }
    }
     // to Check The Document exist or not 
     useEffect(()=>{
       preload()
     }
     ,[])
      // Function To Verify the Account 
    const Verify = async() =>{
        // Fetch user data
        const docs = doc(db,'users',IDofUser)
        const Doc = await getDoc(docs)
        const data = Doc.data()
        console.log(data)
        
        // to Check if it is expired or not if not verfied account
        const timerequire = 300000
        const current = Date.now()
        const prev = data.time
        const sub = current - prev
        console.log(sub)
        if (sub <= timerequire){
            if (Type == "Verify"){
                const update = await updateDoc(docs,{Verifed:true})
                Router.push('/')
            }
            if (Type == "Delete"){
                const Delete = await deleteDoc(docs)
            }
            if (Type == "Change"){
                const pass1 = document.getElementById("pass1").value 
                const pass2 = document.getElementById("pass2").value 
                if ( pass1 == pass2){
                    const hashed = bcrypt.hashSync(document.getElementById("pass1").value,10)
                    const update = await updateDoc(docs,{Password:hashed})
                    Router.push('/')
                }
                if (pass1 != pass2){
                    document.getElementById("pass2").style.borderBottomColor = "crimson"
                    setTimeout(()=>{
                        document.getElementById("pass2").style.borderBottomColor = "black"
                    },300)
                }
                
            }
        }
        if (sub > timerequire){
            alert("Your Link Has Been Expired ❌")
            Router.push('/')
        }
    }
   // Match Password 
   const MatchPassword = () =>{
    const pass1 = document.getElementById("pass1").value 
    const pass2 = document.getElementById("pass2").value 
    if (pass1 != pass2){
        document.getElementById("pass2").style.borderBottomColor = "crimson"
    }
    if (pass1 == pass2){
        document.getElementById("pass2").style.borderBottomColor = "green"
    }
   }
    // Card Component 
    const Card = () =>{
        if (Type == "Verify"){
            return (
            <>
            <p className = "2xl:text-2xl xl:text-xl md:text-md sm:text-sm  mb-14">Click The button Below To Verify your Account ✅</p>
            <button onClick={Verify} className = "border-2 shadow-lg active:shadow-gray-600 active:border active:text-green-400 active:bg-white border-black w-36 h-14 text-xl rounded bg-green-500 text-white">Verify</button>
            </>
            )
        }
        if (Type == "Delete"){
            return (
                <>
                <p className = "2xl:text-2xl xl:text-xl md:text-md sm:text-sm  mb-14">Click The button Below To Delete your Account ❌</p>
            <button onClick={Verify} className = "border-2 shadow-lg active:shadow-gray-600 active:border active:text-red-400 active:bg-white border-black w-36 h-14 text-xl rounded bg-red-500 text-white">Delete</button>
            
                </>
            )
        }

        if (Type == "Change"){
            return (
                <>
                <p className = "2xl:text-2xl xl:text-xl md:text-md sm:text-sm  mb-14">Change Password 🆕</p>
                <input id = "pass1" className = "border-0 border-b-2 mb-6 w-72 text-md p-3 outline-none h-14 border-b-black" type = "text" placeholder = "Enter The New Password" />
                <input onChange={MatchPassword} id = "pass2" className = "border-0 border-b-2 text-md  w-72  p-3 outline-none h-14 border-b-black" type = "text" placeholder="Confirm The New Password" />
                <button onClick = {Verify} className = "border border-black text-xl p-3 rounded mt-14 bg-green-500 shadow-md active:shadow-lg active:bg-white active:text-green-500 text-white">Save✅</button>
                </>
            )
        }
    }
    return (
        <div className = "flex flex-col w-full pt-14 items-center">
                        <h1 className="mb-16 mt-16 text-red-600 text-6xl font-title">FOSystem2.0 🍲</h1>
                        <p className = "text-2xl mb-6">Hi {User} 🙋🏼‍♂️</p>
                        <p className="2xl:text-2xl xl:text-xl md:text-md sm:text-sm ml-3 mr-3 mb-3">Thank u for choosing FOSystem2.0</p>
                        <Card/>
                        </div>
    )
}
export default  page
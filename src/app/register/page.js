"use client"

import { useRouter } from "next/navigation"
const validator = require('email-validator')
import {useState,useEffect} from 'react'
import app from '../database/db'
import {getFirestore} from "@firebase/firestore"
const bcrypt = require("bcryptjs")
import { passwordStrength } from "check-password-strength"
import {addDoc,deleteDoc,doc, collection,getDocs,query,where} from 'firebase/firestore'


const page = () =>{
    // Part To Change Page
    const Router = useRouter()

    // Database Connection Part
    const db = getFirestore(app)
    const colref = collection(db,'users')

    // Part To change Type of Password input field 
    const [type,Changetype] = useState("password")
    // Part To Show Alert Portion 
    const [Alert,ChangeAlert] = useState("")
    const [Alert2,ChangeAlert2] = useState("")
    // Function To Go To Login Page 
  const GoToLogin = () =>{
    Router.push('/')
  }
   // Function To Validate Email
   const EmailValidator = async() =>{
     const Email = document.getElementById("Email").value
     const Check1 = validator.validate(Email)
     const Check2 = await CheckEmail(Email)
     if (Check1 == true && Check2 == true){
        document.getElementById("Email").style.borderBottomColor = "green"
        return true
     }
     if (Check1 == false){
        document.getElementById("Email").style.borderBottomColor="crimson"
        return false
     }
     if (Check2 == false){
        document.getElementById("Email").style.borderBottomColor="crimson"
        return false
     }
   }
   
   // Function To Check Whether User Exists or Not 
   const CheckEmail = async(Email) =>{
     const q = query(colref,where("Email","==",Email))
     const Data = await getDocs(q)
     const Arr = Data.docs.map((snapshot)=>{
     return (
     {...snapshot.data(),id:snapshot.id})}) 
     if (Arr.length == 0){
        return true
     }
     if (Arr.length != 0){
        const Data = Arr[0]
        console.log(Data)
        if (Data.Verifed == true){
            return false
        }
        if (Data.Verifed == false){
            const docs = doc(db,"users",Data.id)
            const DelDoc = await deleteDoc(docs)
            return true
        }
        
     }
   }

   // Function To Check Both Password matched or not 
   const MatchPassword = () =>{
    const pass1 = document.getElementById("pass1").value 
    const pass2 = document.getElementById("pass2").value 
    if (pass1 == pass2){
        document.getElementById("pass2").style.borderBottomColor = "green"
        return true
    }
    if (pass1 != pass2){
        if (pass2 != ""){
        document.getElementById("pass2").style.borderBottomColor="crimson"
        return false
        }
        if (pass2 == ""){
            document.getElementById("pass2").style.borderBottomColor="black"
        return false
        }
    }
   }
    // Function to Show Password 
    const ShowPass = () =>{
        if (type == "password"){
            Changetype("text")
            return 0
        }
        if (type == "text"){
            Changetype("password")
            return 0
        }
    }

    // Function To Check Password Strength 
    const PassStrength = () =>{
        const pass1 = document.getElementById("pass1").value
        const value = passwordStrength(pass1).value 
        if (value == "Strong"){
            document.getElementById('pass1').style.borderBottomColor= "green"
            return true
        }
        else {

            if (pass1 != ""){
                document.getElementById("pass1").style.borderBottomColor="crimson"
                return false
            }
            if (pass1 == ""){
                document.getElementById("pass1").style.borderBottomColor="black"
                return false
            }
        }

    }
    // Function To Clear all Input Fields 
    const ClearAll = () =>{
        document.getElementById("Name").value = ''
        document.getElementById("Email").value = ''
        document.getElementById("pass1").value = ''
        document.getElementById("pass2").value = ''
    }
    // Function To Create User Account 
    const CreateAccount =  async() =>{
        const hashed = bcrypt.hashSync(document.getElementById("pass1").value,10)
        const Details = {
            Name :document.getElementById("Name").value,
            Email:document.getElementById("Email").value,
            Password:hashed,
            Verifed:false,
            Type:"Customer",
            time:Date.now()
        }
       // Part to Check every part is verified 
       const PasswordCheck = PassStrength()
       const MatchPass = MatchPassword()
       const EmailVerify = await EmailValidator()

       if (PasswordCheck == true && MatchPass == true && EmailVerify == true){
        const SentToDB =  await addDoc(colref,Details)
        // part to send verify email to user email to verify it
        const Request = await fetch("/api/email",{
            method:"POST",
            headers:{"Content-Type":"application/json"},
            body:JSON.stringify({...Details,
                id:SentToDB.id,
                Type:"Verify",
                url:window.location.origin
            })
        })
        const Response = await Request.json()
        if (Response.status == true){
            document.getElementById("alert2").style.display="flex"
            ChangeAlert2("Check Your Email For Verification ✅")
            ClearAll()
            setTimeout(()=>{
                document.getElementById("alert2").style.display = 'none'
            },5000)
        }

       
       }
       else {
        document.getElementById("alert").style.display = 'flex'
        ChangeAlert("Alert: Invalid Details ❌")

        setTimeout(()=>{
            document.getElementById("alert").style.display = 'none'
        },5000)
       }

    }
    return (
        <div className = "flex flex-col w-full items-center">
            <p id = "alert" className = " hidden border-red-300 bg-red-100 border-2 p-6 mt-6 rounded">{Alert}</p>
            <p id = "alert2" className= " hidden bg-green-200  border-2 mt-6  flex flex-col rounded border-green p-6 ">{Alert2}</p>
            <h1 className="mb-16 mt-16 text-red-600 text-6xl font-title">FOSystem2.0🍲</h1>
            <input id = "Email" onChange={EmailValidator} className = "outline-none text-xl 2xl:w-500 xl:w-500 lg:w-500 md:w-500 sm:w-3/4 w-3/4   mb-6 border-b-2 border-black h-14 p-3" type ="text" placeholder="Enter The Email : " />
            <input id = "Name" className = " outline-none text-xl 2xl:w-500 xl:w-500 lg:w-500 md:w-500 sm:w-3/4 w-3/4 mb-6 border-b-2 border-black h-14 p-3 " type = "text" placeholder = "Enter The Name :" />
            <input onChange={PassStrength} id = "pass1" className="outline-none text-xl 2xl:w-500 xl:w-500 lg:w-500 md:w-500 sm:w-3/4 w-3/4 mb-6 border-b-2 border-black h-14 p-3" type={type} placeholder="Enter The Password :" />
            <input onChange={MatchPassword} id = 'pass2' className="outline-none text-xl 2xl:w-500 xl:w-500 lg:w-500 md:w-500 sm:w-3/4 w-3/4 mb-6 border-b-2 border-black h-14 p-3" type = {type} placeholder="Confirm The Password" />
            <button onClick={ShowPass} className = "w-48 text-xl mb-16">Show Password🔓</button>
            <button onClick={CreateAccount} className = "text-xl border border-black bg-red-500 active:bg-white active:text-red-500 shadow-lg rounded  shadow-gray-600 active:shadow-gray-400  text-white  w-40 h-14">Register</button>
            <h2 className = "text-xl mb-6 mt-6">OR</h2>
            <button onClick={GoToLogin} className = "w-48 border text-lg active:shadow-xl   border-black rounded h-14 shadow-lg">Login</button>
        </div>
    )
}
export default page 
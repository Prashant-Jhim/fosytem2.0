'use client'
import Image from "next/image";
import { useRouter } from "next/navigation";
import app from './database/db'
import {useState,useEffect} from 'react'
import { collection, getFirestore,where,query, getDocs, doc, getDoc } from "firebase/firestore";
const bcrypt = require("bcryptjs")
export default function Home() {
  // Alert Part 
  const [Alert,ChangeAlert] = useState("")
  // Show Password Part
  const [ShowPass,ChangePass] = useState("password")
  // Router Instance
  const Router = useRouter()

  // Database Part
  const db = getFirestore(app)
  const colref = collection(db,'users')


  // Function To Go To Register Page 
  const GoToRegister = () =>{
    Router.push('/register')
  }
 
  // Function To Show Password 
  const ShowPassword = () =>{
    if (ShowPass == "text"){
      ChangePass("password")
      return 0
    }
    if (ShowPass == "password"){
      ChangePass("text")
      return 0
    }
  }

  // Check User is already login or not 
  const loginornot = async()=>{
     // To Get window local storage instance 
     const id = window.localStorage.getItem("ID")
     if (id != undefined){
      const docref = doc(db,'users',id)
      const getdocref = await getDoc(docref)
      const data = getdocref.data() 
       if (data != undefined){
        Router.push('/menu')
       }
  }
}
  // useEffect Function To Check User whether is Login in or not 
  useEffect(()=>{
   loginornot()
     
  },[])
  // Function To Sign IN 
  const Login = async() =>{
    const Email = document.getElementById("Email").value 
    const Password = document.getElementById("Password").value 
    const q = query(colref,where("Email","==",Email))
    const getdocinstance = await getDocs(q)
    const data = getdocinstance.docs.map((snapshot)=>{
      return {
        ...snapshot.data(),id:snapshot.id
      }
    })
    if (data.length != 0) {
      const Details = data[0]
      const Hashed = Details.Password
      // Check Whether Password is Right Or Not 
      const Comparsion = bcrypt.compareSync(Password,Hashed)
      console.log(Comparsion)
      if (Comparsion == true){
        window.localStorage.setItem("ID",Details.id)
        ChangeAlert("Login SuccessFull ✅")
        document.getElementById("Alert").style.display="flex"
        document.getElementById("Alert").style.backgroundColor = "#BFF5A4"
        Router.push('/menu') 
      }
      if (Comparsion == false){
        ChangeAlert("Invalid Details ❌")
        document.getElementById("Alert").style.display="flex"
        document.getElementById("Alert").style.backgroundColor = "#FDBCBC"
        setTimeout(()=>{
          ChangeAlert("")
          document.getElementById("Alert").style.display="none"
        },3000)
      }
    }
    if (data.length == 0){
      ChangeAlert("Invalid Details ❌")
      document.getElementById("Alert").style.display="flex"
      document.getElementById("Alert").style.backgroundColor = "#FDBCBC"
      setTimeout(()=>{
        ChangeAlert("")
        document.getElementById("Alert").style.display="none"
      },3000)
    }
  }
  return (
    <div className="items-center justify-items-center  w-full flex flex-col ">
     <p id = "Alert" className = " hidden border border-black p-6 bg-green-200 mt-6 rounded ">{Alert}</p>
     <div className="2xl:w-500 mt-24 flex flex-col">
     <h1 className="mb-16 text-red-600 text-6xl font-title">FOSystem2.0🍲</h1>
    <input id = "Email" placeholder="Enter The Email" type="text" className="mb-6 text-2xl focus:border-green-600 focus:border-b-2 sm:w-full h-14 outline-none p-2 border-black border-0 border-b-2" />
    <input id = "Password" placeholder="Enter The Password" type={ShowPass} className=" sm:w-full text-2xl focus:border-green-600 focus:border-b-2 mb-6 h-14 outline-none p-2  mb-4 p-2 border-0 border-black border-b-2" />
    <button onClick= {ShowPassword} className = "w-48 text-xl mb-14">Show Password🔓</button>
    <button onClick={Login} className=" text-xl border border-black bg-red-500 active:bg-white active:text-red-500 shadow-lg rounded  shadow-gray-600 active:shadow-gray-400  text-white  w-40 min-h-14">Login</button>
    <h1 className = "text-2xl mt-14 mb-12 w-full flex flex-col items-center">OR</h1>
   <div className = "w-full flex flex-col items-center">
   <button onClick={GoToRegister} className="w-48 border text-lg active:shadow-xl  border-black rounded h-14 shadow-lg">Create Account🆕</button>
   </div>
   
     </div>
  </div>
  
  );
}

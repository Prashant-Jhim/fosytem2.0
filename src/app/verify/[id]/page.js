'use client'
import app from './db/db'
import { useEffect } from 'react'
import { useParams, useRouter } from "next/navigation"
import {addDoc,updateDoc,doc, collection,getDocs,query,where, getFirestore, getDoc} from 'firebase/firestore'

const page = () =>{
    // to Navigate to Other part
    const Router = useRouter()
    // part to get id of user
    const params = useParams()
   
    // collection ref
    const db = getFirestore(app)
    const colref = collection(db,"users")
   
    // preload function 
    const preload = async()=>{
        const docs = doc(db,"users",params.id)
        const data = await getDoc(docs)
        const details = data.data()
        if(details == undefined){
            alert("Link is Invalid ❌")
            Router.push("/")
           
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
        const docs = doc(db,'users',params.id)
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
            const update = await updateDoc(docs,{Verifed:true})
            Router.push('/')
        }
        if (sub > timerequire){
            alert("Your Link Has Been Expired ❌")
            Router.push('/')
        }
    }
    return (
        <div className = "flex flex-col w-full pt-14 items-center">
                        <h1 className="mb-16 mt-16 text-red-600 text-6xl font-title">FOSystem2.0 🍲</h1>
                        <p className = "text-2xl mb-6">Hi Prashant 🙋🏼‍♂️</p>
                        <p className="2xl:text-2xl xl:text-xl md:text-md sm:text-sm ml-3 mr-3 mb-3">Thank u for choosing FOSystem2.0</p>
                        <p className = "2xl:text-2xl xl:text-xl md:text-md sm:text-sm  mb-14">Click The button Below To Verify your Account ✅</p>
                        <button onClick={Verify} className = "border-2 shadow-lg active:shadow-gray-600 active:border active:text-green-400 active:bg-white border-black w-36 h-14 text-xl rounded bg-green-500 text-white">Verify</button>
                        </div>
    )
}
export default  page
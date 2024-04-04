'use client'
import {useEffect,useState} from 'react'
import { useParams, useRouter } from 'next/navigation'
import { deleteDoc, doc, getDoc, getFirestore, updateDoc } from "firebase/firestore"
import app from './db/db'
const page = () =>{
    const props = useParams()
    const Router = useRouter()
    const [Details,ChangeDetails] = useState({})
    const [Alert,ChangeAlert] = useState('')
    const db = getFirestore(app)
   
     // Function To Fetch the details of interview 
     const GetInterview = async() =>{
        const docinstance = doc(db,'interviews',props.id)
        const getdocinstance = await getDoc(docinstance)
        const data = getdocinstance.data()
        ChangeDetails(data)
     }

    useEffect(()=>{
        GetInterview()
    },[])
     // Function To GoBack to applications page 
     const Goback = ()=>{
        Router.push('/applications')
    }
    
    // Function To Sent To Database 
    const SentToDb = () =>{
        const Date = document.getElementById("date").value 
        const time = document.getElementById('time').value 
        console.log(Date + '@' + time)
     }
    // Function To Switch Between Owner or Applicant View 
    const View = () =>{
        const [type,ChangeType] = useState("applicant")
         // Function To Check User is Owner or Applicant 
    const CheckUser = async() =>{
        const ID = window.localStorage.getItem("ID")
        if (ID != undefined){
            const docinstance = doc(db,'users',ID)

            const getdocinstance = await getDoc(docinstance)
            const docs = getdocinstance.data()
            if (docs == undefined){
                Router.push('/')
                
            }
            if (docs != undefined){
                if (docs.Type == "Customer" && docs.Type == "Employee"){
                    ChangeType("Owner")
                }
                if (docs.Type == "Owner"){
                    ChangeType("Owner")
                }
                   
                
            }
            
        }
    }
    // Function To Cancel Interview 
    const CancelInterview = async()=>{
        const docinstance = doc(db,'interviews',props.id)
         //Docinstance to remove the applications part 
         const docinstance2 = doc(db,'applications',Details.AppNo)
        const deldocinstance = await deleteDoc(docinstance)
        const deldocinstance2 = await deleteDoc(docinstance2)
        Router.push("/applications")

    }

    //Function To Submit 
    const SubmitInterview = async() =>{
        const id = props.id 
        const docinstance = doc(db,'interviews',id)
        const date = document.getElementById('date').value 
        const time = document.getElementById('time').value 
        const update = {date,time}
        if (date != '' && time != ""){
            const updatedocinstance = await updateDoc(docinstance,update)
            document.getElementById("alert").style.display = 'block'
            GetInterview()
            setTimeout(()=>{
                document.getElementById("alert").style.display = 'none'
            },2000)
        }
    }

    useEffect(()=>{
        CheckUser()
    },[])

    // Function To Check The User already set interview 
    const Check = () =>{
        if (Details.date == "" && Details.time == ''){
            return (
                <button onClick={SubmitInterview} className = 'mt-6 border active:bg-white active:text-green-600 rounded bg-green-600 text-white border-black p-3'>Submit✅</button>

            )
        }
        if (Details.date != "" && Details.time != ""){
            return (
            <button onClick={SubmitInterview} className = 'mt-6 border active:bg-white active:text-green-600 rounded bg-green-600 text-white border-black p-3'>Change✍️</button>
            )
        }
    }
       
        if (type == "applicant"){
            return (
                <div className = 'flex flex-col p-3 rounded gap-3 border mt-12 border-black'>
                    <h2 className = 'self-center'>Schedule Interview 🙋🏼‍♂️</h2>
                    <h1>Title:  <strong>Customer Service Representative</strong></h1>
                    <label>Select a date : <strong className='text-red-500'>{Details.date}</strong> </label>
                    <input id = 'date' className = 'w-40 border-black rounded border p-3'  type = 'date' />
                    <label>Select a time : <strong className='text-red-500'>{Details.time}</strong></label>
                    <input id = 'time' placeholder = "Enter The Time : " className = 'p-2 rounded border-black border' list = 'browsers'/>
                    <datalist id = "browsers">
                        <option value = "9.00am - 9.30am"/>
                        <option value = "9.30am - 10.00am"/>
                        <option value = "10.00am - 10.30am"/>
                        <option value = "11.00am - 11.30am"/>
                        <option value = "11.30am - 12.00pm"/>
                        <option value = "12.00pm - 12.30pm"/>
                        <option value = "1.00pm - 1.30pm"/>
                        <option value = "1.30pm - 2.00pm"/>
                        <option value = "2.00pm - 2.30pm"/>
                        <option value = "2.30pm - 3.00pm"/>
                        <option value = "3.00pm - 3.30pm"/>
                        <option value = "3.30pm - 4.00pm"/>
                    </datalist>
                    <Check/>
                </div>
            )
        }

        if (type == "Owner"){
            return(
                <div className = 'flex flex-col p-3 rounded gap-3 border mt-12 border-black'>
                    <h2 className = 'self-center'>Schedule Interview 🙋🏼‍♂️</h2>
                    <h1>Title:  <strong>Customer Service Representative</strong></h1>
                    <h2>Applicant Name : <strong>Prashant Kumar</strong></h2>
                    <label>Select a date : <strong className = 'text-red-500'>{Details.date}</strong></label>
                    <input id = 'date' className = 'w-40 border-black rounded border p-3' type = 'date' />
                    <label>Select a time : <strong className = 'text-red-500'>{Details.time}</strong></label>
                    <input id = 'time' placeholder = "Enter The Time : " className = 'p-2 rounded border-black border' list = 'browsers'/>
                    <datalist id = "browsers">
                        <option value = "9.00am - 9.30am"/>
                        <option value = "9.30am - 10.00am"/>
                        <option value = "10.00am - 10.30am"/>
                        <option value = "11.00am - 11.30am"/>
                        <option value = "11.30am - 12.00pm"/>
                        <option value = "12.00pm - 12.30pm"/>
                        <option value = "1.00pm - 1.30pm"/>
                        <option value = "1.30pm - 2.00pm"/>
                        <option value = "2.00pm - 2.30pm"/>
                        <option value = "2.30pm - 3.00pm"/>
                        <option value = "3.00pm - 3.30pm"/>
                        <option value = "3.30pm - 4.00pm"/>
                    </datalist>
                    <button onClick={SubmitInterview} className = 'mt-6 border active:bg-white active:text-green-600 rounded bg-green-600 text-white border-black p-3'>Change✅</button>
                    <button onClick={CancelInterview} className = 'mt-3 border active:bg-red-500 active:text-white rounded bg-white text-black border-black p-3'>Cancel❌</button>
                </div>
            )
        }
    }
    return (
        <div className = "flex flex-col items-center">
            <button onClick={Goback} className = 'text-3xl absolute top-3 left-3'>⏪Back</button>
            <h1 className = "font-title mt-24 text-4xl">FoSystem2.0🥗</h1>
            <p>Interviews📝</p>
            <p id = 'alert' className= 'mt-12 hidden text-lg'>The Interview has been Confirmed ✅</p>
            <View/>
        </div>
    )
}
export default page
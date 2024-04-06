'use client'
import {useState,useEffect} from 'react'
import app from '../database/db'
import { getDocs, getFirestore,collection, doc, getDoc, deleteDoc, updateDoc, addDoc } from 'firebase/firestore'
import { useRouter } from 'next/navigation'
const page = () =>{
    const router = useRouter()
    const [Arr,ChangeArr] = useState([])
    const db = getFirestore(app)
    // function to fetch the applications 
    const fetchap = async()=>{
        const colref = collection(db,'applications')
        const getdocinstance = await getDocs(colref)
        const docinstance = getdocinstance.docs.map((snapshot)=>{
            return {...snapshot.data(),id:snapshot.id}
        })
        ChangeArr(docinstance)
    }
    useEffect(()=>{
        fetchap()
    },[])
    // Function To Goback to menu
    const goback = () =>{
        router.push("/")
    }

    const CheckArr = () =>{
        if (Arr.length == 0){
            return (
                <div>
                    <h2 className = 'text-xl'>No Applications At Time 📭</h2>
                    <button onClick={goback} className = 'self-center text-xl border border-black rounded p-2 ml-10 mt-24'>Back To Menu 🏡</button>
                </div>
            )
        }
        if (Arr.length != 0){
            return (
                <div className = ' flex flex-col '>
                {Arr.map((data)=><Job InterviewID={data.InterviewID} Interview={data.Interview} id = {data.id} idofjob={data.idofjob} Email={data.Email} Address={data.Address} ApplicantCity={data.ApplicantCity} FullName={data.FullName} PhoneNo={data.PhoneNo} Postal={data.Postal} Url={data.Url}  />)}
                </div>
            )
        }
    }
    
    // Job Component
    const Job = (props) =>{
        const [Details,changeDetails] = useState({Title:"Loading",ID:"Loading"})
        // Function To Set Up Interview for Applicant 
    const SetUpInterview = async() =>{
        const details = {
            Title:Details.Title,
            date:'',
            time:'',
            AppNo:props.id,
            Url:"",
            JobID:Details.ID,
            Name:props.FullName
        }
        const collectionref = collection(db,'interviews')
        const addref = await addDoc(collectionref,details)

        const url = window.location.origin + '/interview/'+addref.id
        const Request = await fetch('/api/email',{
            method:"POST",
            headers:{"Content-Type":"applications/json"},
            body:JSON.stringify({Email:props.Email,url,Type:"Interview",FullName:props.FullName,Job:Details.Title,JobID:Details.ID})
        })
        const Response = await Request.json() 
        if (Response.status == true){
            const docinstance = doc(db,'applications',props.id)
             
             
            
            const update = {Interview:true,InterviewID:addref.id}
            const updatedocinstance = await updateDoc(docinstance,update)
            fetchap()
        }
    }
    // Function To Delete Application 
    const DeleteApplicant = async() =>{
        const Request = await fetch("/api/email",{
             method:"POST",
             headers:{"Content-Type":"application/json"},
             body:JSON.stringify({Email:props.Email,Type:'DeleteApplicant',FullName:props.FullName,Job:Details.Title,JobID:Details.ID})

        })
        const Response = await Request.json()
        if (Response.status == true){
            const docinstance = doc(db,'applications',props.id)
            const deldoc = await deleteDoc(docinstance)
            fetchap()
        }
    }

    // to Check It is Called for interview 
    const Checkinterview = () =>{
        // Function to go to Interview Page 
        const InterviewPage = () =>{
            router.push('/interview/'+props.InterviewID)
        }
        if (props.Interview == true){
            return(
                <>
                <p className = 'text-sm text-green-600'>
                    This Applicant has been called for interview 💻
                </p>
                <button onClick={InterviewPage} className = ' mt-2 border-2 border-black rounded p-2 active:bg-green-600 active:text-white'>Change Interview Date ✍️</button>
                </>
            )
        }
        if (props.Interview == false){
            return(
                <div className = 'flex gap-6 '>
                <button onClick={SetUpInterview} className = 'border border-black p-2 active:bg rounded'>Set Up Interview ✅ </button>
                <button onClick = {DeleteApplicant} className = 'border border-black p-2 rounded '>Decline Offer</button>
            </div>
            )
        }
    }
    // Fetch The Job Details 
    const FetchJob = async()=>{
        const docinstance = doc(db,'carrers',props.idofjob)
        const getdocinstance = await getDoc(docinstance)
        const docs = getdocinstance.data()
        changeDetails({...docs,ID:getdocinstance.id})
    }
    //useeffect to fetch details
    useEffect(()=>{
        FetchJob()
    },[])
        return (
            <div className = 'flex flex-col mt-6 gap-2 border border-black rounded p-3 '>
                <h1>Job Title : <strong>{Details.Title}</strong></h1>
                <h3>Job ID : <strong>{Details.ID}</strong></h3>
                <label>Applicant Name : <strong>{props.FullName}</strong> </label>
                <label>Applicant Phone No : <strong>{props.PhoneNo}</strong></label>
                <label>Applicant Address : </label>
                <label><strong>{props.Address}</strong></label>
                <label>Applicant City : <strong>{props.ApplicantCity}</strong></label>
                <label>Applicant Postal : <strong>{props.Postal}</strong></label>
                <label className = 'text-red-500'><a target="_blank" href = {props.Url}>Resume of Resume🗃️ </a></label>
               <Checkinterview/>
            </div>
        )

    }
    return (
        <div className = 'flex flex-col items-center'>
            <button onClick={goback} className = "absolute top-3 active:text-red-500 active:shadow-lg p-2 active:rounded active:border active:border-black  text-3xl left-3">⏪Back</button>
            <h1 className = 'font-title text-4xl mt-24'>FOSystem2.0🥗</h1>
            <p className = 'mb-12'>Applications🙋🏼‍♂️</p>
            <CheckArr/>
        </div>
    )
}
export default page 
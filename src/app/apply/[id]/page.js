'use client'
import {useState,useEffect} from 'react'
import { useParams, useRouter } from "next/navigation"
import app from '../database/db'
import {  doc, getDoc, getFirestore, updateDoc } from 'firebase/firestore'
import { getDownloadURL, getStorage, ref, uploadBytes } from 'firebase/storage'




const page = () =>{
    const Params = useParams()
    const [title,changetitle] = useState('')
    const [city,changecity] = useState('')
    const [Alert,changealert] = useState("")
    const [uploadname,changenameofupload] = useState('')
    const db = getStorage(app)
    const textdb = getFirestore(app)
    const router = useRouter()

    const [uplaod,changeuploading] = useState("")
    const [url,changeurl] = useState("")
    // function to go back to careers page 
    const backtocareers = () =>{
        router.push("/careers")
    }

    // To Check User is geniune 
    const checkuser = async() =>{
        const id = window.localStorage.getItem("ID")
        if (id != undefined){
            const docinstance = doc(textdb,"users",id) 
            const getdocinstance = await getDoc(docinstance)
            const docs = getdocinstance.data()
            
            // To Check The User Already Applied or not 
            const docinsta2 = doc(textdb,'applications',Params.id) 
            const getdocinstance2 = await getDoc(docinsta2)
            const docs2 = getdocinstance2.data()
            if (docs2 == undefined){
                Router.push("/")
            }
            if (docs2.Applied == true){
                alert("You Already Applied to job ✅")
                router.push('/careers')
            }
            if (docs2 != undefined){
               console.log(docs2)
                // To Fetch The Details of Job 
            var docinstance3 = doc(textdb,'carrers',docs2.idofjob)
            var getdocinstance3 = await getDoc(docinstance3)
            var docdata = getdocinstance3.data()
            changetitle(docdata.Title)
            changecity(docdata.City)
                
            }
        }
    }

    // useeffect 
    useEffect(()=>{
        checkuser()
    },1000)
    // Click The Upload button 
    const clickupload = () =>{
        document.getElementById("upload").click()
    }
     // To Set File Variable 
     const uploadfile = async(event) =>{
        document.getElementById("uploadresume").disabled = true 
        document.getElementById("uploadresume").innerHTML = 'uploading...👾'
        changeuploading("Uploading....👾")
        const upload = event.target.files[0] 
        console.log(upload)
        const imgref = ref(db,`images/${upload.name} + hahflahflh`)
        const upld = await uploadBytes(imgref,upload)
        const url = await getDownloadURL(upld.ref)
        if (url != undefined){
            changeurl(url)
            changenameofupload(upload.name)
            document.getElementById("uploadresume").innerHTML = 'Upload a Resume 📄'
            document.getElementById("uploadresume").disabled = false 
        }
       

    }
   
    // Apply for job
    const apply = async() =>{
        const idofparams = Params.id
        const details = {
            FullName:document.getElementById("Name").value ,
            PhoneNo:document.getElementById("PhoneNo").value,
            Address:document.getElementById("Address").value ,
            ApplicantCity:document.getElementById("City").value,
            Postal:document.getElementById("Postal").value,
            Url:url,
            Applied:true
            }
        

        if (details.FullName != '' && details.PhoneNo != '' && details.Address != ''&&details.ApplicantCity != '' && details.Postal != '' && details.url != ''){  
        const docinstane = doc(textdb,'applications',idofparams)
        const update = await updateDoc(docinstane,details)
        changealert('Your Application has been submitted ✅')
        document.getElementById("alert").style.display = 'block'
        setTimeout(()=>{
            router.push("/careers")
        },2000)
        }

        else {
            document.getElementById("alert").style.display = 'block'
            changealert("Something went wrong ❌")

            setTimeout(()=>{
                document.getElementById("alert").style.display = 'none'
                changealert("")
            },3000)
        }
        
    }

    return (
        <div className = "flex flex-col items-center">
            <button onClick = {backtocareers} className = "text-2xl absolute top-2 left-3">⏪Back</button>
            <h1 className = 'text-4xl mt-28  font-title '>
                FoSystem2.0🥗
            </h1>
            <h3>Apply📥</h3>
            <h2 className = 'mt-6'>Role : {title}</h2>
            <h2>City: {city}</h2>
            <input id = "Name" className = 'border-0 outline-none border-b-black border-b-2 p-2 text-xl mt-14' type = 'text' placeholder = "Enter The Full Name :" />
            <input id = "PhoneNo" className = 'border-0 outline-none border-b-black border-b-2 p-2 text-xl mt-3' type = 'text' placeholder = "Enter The Phone No :" />
            <input id = "Address" className = 'border-0 outline-none border-b-black border-b-2 p-2 text-xl mt-3' type = "text" placeholder = "Enter The Address :" />
            <input id = "City" className = 'border-0 outline-none border-b-black border-b-2 p-2 text-xl mt-3' type = "text" placeholder = "Enter The City :"/>
            <input id = "Postal" className = 'border-0 outline-none border-b-black border-b-2 p-2 text-xl mt-3' type = "text" placeholder = "Enter The Postal Code :" />
            <div className = 'flex flex-col items-center mt-6'>
                <input id = "upload" onChange={uploadfile}  className = 'self-center hidden  border border-black'  type = 'file'  />
                <button id = "uploadresume" onClick = {clickupload} className = 'border border-black p-2 rounded '>Upload a Resume 📄</button>
                <label className = 'mt-3 text-red-500'>{uploadname}</label>
            </div>
            <button onClick={apply} className= 'border border-black p-2 rounded bg-red-500 mt-6 shadow-md active:shadow-xl text-white'>Apply</button>
            <p id = 'alert' className = 'border mt-14 hidden  border-black p-2 bg-red-200 rounded mb-12'>{Alert}</p>

        </div>
    )
}
export default page
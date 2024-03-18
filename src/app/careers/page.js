'use client'
import { addDoc, collection, doc, getDoc, getDocs, getFirestore, query, where } from 'firebase/firestore'
import app from '../database/db'
import {useState,useEffect} from 'react'
import { useRouter } from 'next/navigation'
const page = () =>{
    const Router = useRouter()
    const [view,changeview] = useState('search')
    const [Arr,changearr] = useState([])
    const db = getFirestore(app)
    const colref =  collection(db,'carrers')

    const check = () =>{
        const value = document.getElementById("summary").value 
        console.log(value)
    }
    // function to Fetch The jobs of particular city 
    const fetchcity = async() =>{
        const city = document.getElementById("CityName").value 
        const q = query(colref,where("City",'==',city.toLowerCase()))
        const getdocinstance = await getDocs(q) 
        const docs = getdocinstance.docs.map((snapshot)=>{
            return {...snapshot.data(),id:snapshot.id}
        })
        changearr(docs)

    }
    // Change the Page 
    const Changepage = ()=>{
        if (view == "search"){
            changeview("job")
            return 0
        }
        if (view == 'job'){
            changeview("search")
            return 0
        }
    }
    // Function To Check User is Valid 
    const UserCheck = async() =>{
        const ID = window.localStorage.getItem("ID")
        if (ID != undefined){
            const docinstance = doc(db,'users',ID)
            const getdocinstance = await getDoc(docinstance)
            const docs = getdocinstance.data()
            if (docs == undefined){
                Router.push('/')
            }
            if (docs != undefined){
                return getdocinstance.id
            }
        }
    }
    // To Fetch the Jobs 
    const fetchjobs = async() =>{
        const getdocinstance = await getDocs(colref)
        const docinstance = getdocinstance.docs.map((snapshot)=>{
            return {...snapshot.data(),id:snapshot.id}
        })
        changearr(docinstance)
    }
    useEffect(()=>{
        UserCheck()
        fetchjobs()
    },[])
    
    // Responsibilites Component to Avoid unusal refresh 
    const Resp = () =>{
        const [store,changestore] = useState([{index:0,value:"oaoafakfp"}])
        const [alert,changealert] = useState("Deleting....")
        // Function to Delete The Responsibilites 
     const DelRep = (event) =>{
        const id = event.target.id
          store[id] = undefined
          const newarr = [...store]
          document.getElementById('alert' + String(id)).style.display = 'block'

          setTimeout(()=>{
            changestore(newarr)
          },1000)
          
        }
        // Function To Post The job in Database
        const PostRep = async()=>{
            const date = new Date()
            const Months = ['Jan',"Feb","Mar","Apr","May",'June','Jul',"Aug","Sep","Oct","Nov","Dec"]
            const month = date.getMonth()
            const dat = date.getDate()
            const year = date.getFullYear()

            const Details = {
                Title:document.getElementById("Title").value ,
                Summary:document.getElementById("Summary").value ,
                City:document.getElementById("City").value.toLowerCase() ,
                PayRate:document.getElementById("PayRate").value ,
                Type:document.getElementById("Type").value ,
                Resp:store ,
                Date:String(dat) + ' ' + String(Months[month]) + ' ' + String(year)
            }
            const addoc = await addDoc(colref,Details)
        }
        // Push Responsibities 
        const push = (event) =>{
            console.log(event.key)
            const index = store.length 
            const data = {
                index,
                value :document.getElementById("Resp").value 
            }
            const newarr = [...store,data]
            if (event.key == 'Enter'){
                changestore(newarr)
                document.getElementById("Resp").value = ''
            }
        }
        return (
            <div className = ' mt-6 flex flex-col'>
                <h2>Responsibilites</h2>
                <textarea onKeyPress={push} id = "Resp" className = 'border border-black p-3' placeholder = "Enter The Responsibilities :">
                   
                </textarea>
                {store.map((data)=>{
                 console.log(data)
                 
                 if (data != undefined){
                    return (
                        <>
                     <div className = 'flex p-2 border border-black rounded flex-col mt-6 '>
                    <p  className = 'mb-3' >{data.value}</p>
                    <button onClick={DelRep}  id = {data.index} className = 'text-md text-white bg-red-500 text-white border border-black rounded p-2'>Delete</button>
                    <p id = {"alert"+data.index} className = ' hidden text-sm mt-2 text-red-500'>{alert}</p>
                    </div>

                    </>
                    )
                }}
                )}
                                    <button onClick={PostRep} className = 'border shadow-md active:text-red-500 active:shadow-xl border-black  p-3 rounded text-xl mt-6'>Post 📩</button>

            </div>
        )
    }
     

     
    // Job Component 
    const Job = (props) =>{
        const arr = props.Resp
        // To Check Particular job is already applied or not
        const checkjob = async() =>{
            const id = await UserCheck()
            var colref = collection(db,'applications')
            const q =query(colref,where('idofjob','==',props.id),where("idofapplicant",'==',id))
            const getdocinstance = await getDocs(q)
            const docs = getdocinstance.docs.map((snapshot)=>{
             return {...snapshot.data(),id:snapshot.id}
            })
            if (docs.length != 0){
                console.log(props,docs)
                document.getElementById("Apply"+props.id).disabled = true 
                document.getElementById("Apply"+props.id).style.backgroundColor = 'white'
                document.getElementById("Apply"+props.id).style.color = 'black'
                document.getElementById("Apply"+props.id).innerHTML = "Applied✅"
            }
        }
        useEffect(()=>{
            checkjob()
        },[])
         // To Apply for Job 
    const applyjob = async() =>{
        var colref = collection(db,'applications')
        const id = await UserCheck()
        const Details = {
            idofapplicant:id,
            idofjob:props.id,
            FullName:"",
            PhoneNo:"",
            Address:"",
            ApplicantCity:"",
            Postal:'',
            Url:'',
            Applied:false
        }
        var colref = collection(db,'applications')
       const q =query(colref,where('idofjob','==',Details.idofjob),where("idofapplicant",'==',Details.idofapplicant))
       const getdocinstance = await getDocs(q)
       const docs = getdocinstance.docs.map((snapshot)=>{
        return {...snapshot.data(),id:snapshot.id}
       })
       if (docs.length == 0){
        const senttodb = await addDoc(colref,Details)
        Router.push('/apply/'+senttodb.id)
       }
       if (docs.length != 0){
        alert("You Already Applied To This Job✅")
       }
       
    }
        return (
            <div className = ' mt-6 flex w-10/12 rounded relative flex-col p-3 border border-black'>

                <h1 className = 'font-semibold'>{props.Title}</h1>
                <h2>City : {props.City}</h2>
                <h3>Posted: {props.Date}</h3>
                <p>Pay:${props.PayRate}/hr</p>
                <p>Job: {props.Type}</p>
                <h3 className = 'mt-6'>Summary of Job</h3>
                <p>{props.Summary}</p>
                <h3 className = 'mt-6'>Responsiblities :</h3>
                <ol>
                    {arr.map((data)=>{
                        return (<p>{data.value}</p>)
                    })}
                </ol>

                <button id = {"Apply"+props.id} onClick={applyjob} className = ' w-24 mt-6 self-center border border-black p-2 bg-red-500 text-white rounded'>Apply</button>
            </div>
        )
    }
    if (view == "search"){
        return (
            <div className = 'flex flex-col items-center'>
                <button className = 'absolute text-2xl top-3 left-6'>⏪Back</button>
                <button onClick={Changepage} className = 'absolute text-lg border shadow-md text-blakc active:text-red-500 active:shadow-lg border-black p-3 rounded top-3 right-6'>Create a Job💻</button>
                <h1 className = 'text-4xl mt-28 font-title'>FoSystem2.0🥗</h1>
                <h2 className ='text-xl'>Careers</h2>
                <input id = "CityName" className = 'border-0 border-b-2 mt-6 border-black p-3 text-xl' type = 'text' placeholder='Enter The City :' />
                <button onClick={fetchcity} className = 'border active:text-red-500 border-black p-3 text-xl rounded shadow-md mt-6 active:shadow-lg'>Search🔍</button>
                {Arr.map((data)=>{
                    if (data != undefined){
                        return (
                            <Job id = {data.id} PayRate={data.PayRate} Summary={data.Summary} Type={data.Type} City={data.City} Resp={data.Resp} Title={data.Title}/>
                        )
                    }
                })}
            </div>
        )
    }

    if (view == "job"){
        return (
            <div className = 'flex flex-col items-center'>
                 <button onClick={check} className = 'absolute text-2xl top-3 left-6'>⏪Back</button>
                <button onClick={Changepage} className = 'absolute text-lg border shadow-md text-blakc active:text-red-500 active:shadow-lg border-black p-3 rounded top-3 right-6'>Jobs💻</button>
                <h1 className = 'text-4xl mt-28 font-title'>FoSystem2.0🥗</h1>
                <h2 className ='text-xl'>Careers</h2>

                <input id = "Title" className = 'border-0 mt-6 outline-none  border-b-black p-3 text-md border-b-2' type = 'text' placeholder = "Enter The Title " /> 
                <textarea id = "Summary" className = 'mt-6 h-36 outline-none text-md border border-black p-3 rounded' placeholder = 'Summary Of job'></textarea>
                <input id = "City" className = "border-0 outline-none border-b-black border-b-2 p-3 text-md" placeholder = "Enter The City" type = 'text' />       
                <div className = "flex mt-6">
                    <label>Payrate:($/hr) : </label>
                    <input id = "PayRate" type = 'number' placeholder = "No" min='1' className = 'border-0 outline-none pl-2 text-md w-12 border-b-2 border-b-black' />
                </div>
                <div className = 'flex flex-col mt-6 '>
                   <label>Job Type : </label> 
                   <input id = "Type" placeholder = 'Type' className = 'border-0 outline-none p-3 border-b-2 border-b-black' list="browsers" name="browser" />
                   <datalist id="browsers">
                   <option value="Fulltime"/>
                   <option value="Parttime"/>
                   <option value="Contract"/>
   
                 </datalist>
                </div>
                <Resp />
                    </div>
        )
    }
}
export default page
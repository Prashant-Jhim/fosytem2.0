'use client'
import { collection, doc, getDoc, getDocs, getFirestore, query } from "firebase/firestore"
import app from '../database/db'
import { useRouter } from "next/navigation"
import { useState ,useEffect} from "react"

const orders = () =>{
    const [Details,ChangeDetails] = useState({})
    const [arroforders,changeorders] = useState([])
    const db = getFirestore(app)
    const Router = useRouter()
    // Function To  Get Back To Menu 
    const GotoMenu = () =>{
        Router.push("/menu")
    }

    // Function To Fetch All Orders 
    const FetchOrders = async(Type)=>{
        const colref = collection(db,'successorders')
            if (Type == "Employee"){
            const getdocinstance = await getDocs(colref)
            const docs = getdocinstance.docs.map((snapshot)=>{
                return {...snapshot.data(),id:snapshot.id}
            })
            changeorders(docs)
        }
        if (Type == "Customer"){
            const ID = window.localStorage.getItem("ID")
            const q = query(colref,where("Customer","==",ID))
            const getdocinstance = await getDocs(q) 
            const docs = getdocinstance.docs.map((snapshot)=>{
                return {...snapshot.data(),id:snapshot.id}
            })
            changeorders(docs)
        }
         
    }
    // Function User is login or not 
    const loginornot = async()=>{
        const ID = window.localStorage.getItem("ID")
        if (ID == undefined){
            Router.push("/")
        }
        if (ID != undefined){
            const docinstance = doc(db,'users',ID) 
            const GetDocInstance = await getDoc(docinstance)
            const Details = GetDocInstance.data() 
            if (Details == undefined){
                Router.push("/")
            }
            if (Details != undefined){
                ChangeDetails(Details)
                FetchOrders(Details.Type)
                
            }
        }
    }

    // UseEffect To Trigger during Rendering
    useEffect(()=>{
        loginornot()
       
    },[])
    // Function Of Card 
    const Card = (props) =>{

        // Card Component 
        const MiniCard = () =>{
            if (Details.Type == "Employee"){
                return (
                    <div className = "flex mt-3">
                    <button className = "border border-black p-3 bg-green-400 shadow-lg active:bg-white rounded mr-3 text-xl">Done</button>
                    <button className = "border border-black p-3 bg-red-500 shadow-lg active:bg-white active:text-red-500 text-white rounded mr-3 text-xl">Delete</button>
                    </div>
                )
            }
            if (Details.Type == "User"){
                return(
                    <></>
                )
            }
         }
        return(
            <div className = "w-96 border border-black rounded  p-3 ">
                <img className="w-full" src = {props.ImgSrc} />
                <h1 className = "text-3xl">{props.Name}</h1>
                <p className="text-xl text-green-500"><strong>${props.Price}</strong></p>
                <p className = 'mt- text-xl  mb-3'>Quantity:{props.Quantity}</p>
                <p>Details:</p>
                <p>Protein:{props.Protein}g</p>
                <p>Fat:{props.Fat}g</p>
                <p>Carbs:{props.Carbs}g</p>
                <p>Sugar:{props.Sugar}g</p>
                <h2 className = "text-xl">Status:  <strong className = "text-red-500">{props.status}</strong></h2>
                <MiniCard/>
            </div>
        )
    }
    return (
        <div className = "flex flex-col w-full ">
            <button onClick = {GotoMenu} className = 'fixed text-3xl  top-6 left-3'>⏪Back</button>
            <h1 className = "text-5xl mt-24 self-center text-red-600 font-title">
                FOSystem2.0🥗
            </h1>
            <h3 className = "text-3xl mt-12 ml-3 mb-6">Hi {Details.Name}👋🏻</h3>
            <h3 className = 'text-xl mb-6 ml-3'>Orders:</h3>
            <div className = "flex ml-3 gap-6 flex-wrap">
               {arroforders.map((data)=><Card ImgSrc={data.ImgSrc} Quantity={data.Quantity} Name = {data.Name} Price={data.Price} Sugar={data.Sugar} Protein={data.Protein} Carbs={data.Carbs} Fat = {data.Fat} status={data.status} />)}
            </div>
        </div>
    )
}
export default orders
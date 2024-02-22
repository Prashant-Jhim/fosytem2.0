'use client'
import { doc, getDoc, getFirestore } from "firebase/firestore"
import app from '../database/db'
import { useRouter } from "next/navigation"
import { useState ,useEffect} from "react"

const orders = () =>{
    const [Details,ChangeDetails] = useState([])
    const db = getFirestore(app)
    const Router = useRouter()
    // Function To  Get Back To Menu 
    const GotoMenu = () =>{
        Router.push("/menu")
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
            }
        }
    }

    // UseEffect To Trigger during Rendering
    useEffect(()=>{
        loginornot()
    },[])
    // Function Of Card 
    const Card = () =>{

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
                <img className="w-full" src = "https://firebasestorage.googleapis.com/v0/b/fosystem2-86a07.appspot.com/o/images%2F2023-Porsche-911-GT3-R-Rennsport-004-2000.jpg%20%2B%20hahflahflh?alt=media&token=0ee758f1-51bc-46c7-b4ae-4fda2b90be4a" />
                <h1 className = "text-3xl">Porshe 911 </h1>
                <p className="text-xl text-green-500"><strong>$100</strong></p>
                <p>Details:</p>
                <p>Protein:10g</p>
                <p>Protein:10g</p>
                <p>Protein:10g</p>
                <h2 className = "text-xl">Status:  <strong className = "text-red-500">Pending</strong></h2>
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
            <div className = "flex ml-3 flex-col">
                <Card/>
            </div>
        </div>
    )
}
export default orders
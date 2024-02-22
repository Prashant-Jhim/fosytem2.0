'use client'
import { useRouter } from "next/navigation"
import app from '../database/db'
import {useState,useEffect} from 'react'
import { collection, doc, getDoc,deleteDoc, getDocs, getFirestore, query, where } from "firebase/firestore"
const Cart = () =>{
    const Router = useRouter()
    const [Details,ChangeDetails] = useState("")
    const [Price,changePrice] = useState(0)
    const db = getFirestore(app)
    const [Arr,ChangeArr] = useState([])
    // Function To  Get Back To Menu 
    const GotoMenu = () =>{
        Router.push("/menu")
    }

    // Function To Fetch Card 
    const FetchCards = async()=>{
        const ID = window.localStorage.getItem('ID')
        if (ID == undefined){
            Router.push("/")
        }
        if (ID != undefined){
        const docinstance = doc(db,'users',ID) 
        const GetDocInstance = await getDoc(docinstance)
        const Details = GetDocInstance.data() 
        if (Details != undefined){
        ChangeDetails(Details)
        const colref = collection(db,'orders')
        const q = query(colref,where("Customer",'==',window.localStorage.getItem("ID")))
        const getdocinstance = await getDocs(q)
        const docs = getdocinstance.docs.map((snapshot)=>{
            return {...snapshot.data(),id:snapshot.id}
        })
        ChangeArr(docs)
        var newprice = 0
       for (let i = 0 ; i < docs.length ; i++){
        newprice = newprice + docs[i].Quantity*docs[i].Price
       }
       changePrice(newprice)
        }
        if (Details == undefined){
            Router.push('/')
        }
        }

    }
    useEffect(()=>{
        FetchCards()
    },[])
    // Function Of Card 
    const Card = (props) =>{
         // Function To Delete The Orders 
         const DeleteCard = async() =>{
            document.getElementById(props.id).style.display = 'flex'
            const docinstance = doc(db,'orders',props.id)
            const DelDocinstance = await deleteDoc(docinstance)
            FetchCards()
         } 
         
        return(
            <div className = "w-96 border h-full border-black rounded relative  ">
                <button id = {props.id} className = "hidden absolute text-white bg-red-500 p-3 top-3 left-3 rounded">Deleting</button>
                <img className="w-full h-64 object-cover " src = {props.ImgSrc} />
                <div className = "p-3 mb-6">
                <h1 className = "text-3xl">{props.Name}</h1>
                <p className="text-xl  mt-6">Price<strong className = "text-green-500"> :${props.Price}</strong></p>
                    <h3>Details :</h3>
                    <p>Protein : {props.Protein}g</p>
                    <p>Carbs : {props.Carbs}g</p>
                    <p>Fats : {props.Fat}g</p>
                    <p>Sugar : {props.Sugar}g</p>
                    <h2 className = "mt-6 text-xl">Quantity:  <strong className = "text-red-500">{props.Quantity}</strong></h2>
                    <button onClick = {DeleteCard} className = "border border-black p-3 mt-6 bg-red-500 text-white shadow-lg active:shadow active:text-red-500 active:bg-white rounded text-xl">Delete</button>
                </div>
               
            </div>
        )
    }
    return (
        <div className = "flex flex-col w-full ">
            <button onClick = {GotoMenu} className = 'fixed text-3xl  top-3 left-3'>⏪Back</button>
            <h1 className = "text-5xl mt-14 self-center text-red-600 font-title">
                FOSystem2.0🥗
            </h1>
            <h3 className = "text-3xl mt-12 ml-6 mb-6">Hi {Details.Name}👋🏻</h3>
            <h3 className = 'text-xl mb-6 ml-6'>Orders: <strong className = 'text-green-500'>${Price}</strong></h3>
            <button className = "self-start ml-6 mb-6 rounded shadow-lg text-lg active:text-white active:bg-green-500   border border-black p-4">CheckOut💰</button>
            <div className = "flex gap-6 flex-wrap gap-12 p-3 ">
               {Arr.map((data)=><Card  Quantity={data.Quantity} id = {data.id} Name = {data.Name} ImgSrc = {data.ImgSrc} Fat={data.Fat} Price = {data.Price} Protein = {data.Protein} Carbs = {data.Carbs} Sugar={data.Sugar}/>)}
            </div>
        </div>
    )
}
export default Cart
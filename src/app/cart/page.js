'use client'
import { useRouter } from "next/navigation"
import app from '../database/db'
import {useState,useEffect} from 'react'
import { collection, getDocs, getFirestore, query, where } from "firebase/firestore"
const Cart = () =>{
    const Router = useRouter()
    const [Price,changePrice] = useState(0)
    const db = getFirestore(app)
    const [Arr,ChangeArr] = useState([])
    // Function To  Get Back To Menu 
    const GotoMenu = () =>{
        Router.push("/menu")
    }

    // Function To Fetch Card 
    const FetchCards = async()=>{
        const colref = collection(db,'orders')
        const q = query(colref,where("Customer",'==',window.localStorage.getItem("ID")))
        const getdocinstance = await getDocs(q)
        const docs = getdocinstance.docs.map((snapshot)=>{
            return {...snapshot.data(),id:snapshot.id}
        })
        ChangeArr(docs)
        var newprice = Price
       for (let i = 0 ; i < docs.length ; i++){
        newprice = newprice + docs[i].Quantity*docs[i].Price
       }
       changePrice(newprice)

    }
    useEffect(()=>{
        FetchCards()
    },[])
    // Function Of Card 
    const Card = (props) =>{
         
        return(
            <div className = "w-96 border h-full border-black rounded   ">
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
                    <button className = "border border-black p-3 mt-6 bg-red-500 text-white shadow-lg active:shadow active:text-red-500 active:bg-white rounded text-xl">Delete</button>
                </div>
               
            </div>
        )
    }
    return (
        <div className = "flex flex-col w-full ">
            <button onClick = {GotoMenu} className = 'fixed text-3xl  top-6 left-3'>⏪Back</button>
            <h1 className = "text-5xl mt-6 self-center text-red-600 font-title">
                FOSystem2.0🥗
            </h1>
            <h3 className = "text-3xl mt-12 ml-6 mb-6">Hi Prashant👋🏻</h3>
            <h3 className = 'text-xl mb-6 ml-6'>Orders: <strong className = 'text-green-500'>${Price}</strong></h3>
            <button className = "self-start ml-6 mb-6 rounded shadow-lg text-lg active:text-white active:bg-green-500   border border-black p-4">CheckOut💰</button>
            <div className = "flex gap-6 flex-wrap gap-12 ml-6 ">
               {Arr.map((data)=><Card Quantity={data.Quantity} id = {data.id} Name = {data.Name} ImgSrc = {data.ImgSrc} Fat={data.Fat} Price = {data.Price} Protein = {data.Protein} Carbs = {data.Carbs} Sugar={data.Sugar}/>)}
            </div>
        </div>
    )
}
export default Cart
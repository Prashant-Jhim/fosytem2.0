'use client'
import {useEffect,useState} from 'react'
import app from '../database/db'
import { getFirestore,doc,getDoc } from 'firebase/firestore'
import { useRouter } from 'next/navigation'
const Menu = () =>{
    const [Show,ChangeShow] = useState("Options")
    const Router = useRouter()
    // database instance 
    const db = getFirestore(app)
    // Check User is already login or not 
  const loginornot = async()=>{
    // To Get window local storage instance 
    const id = window.localStorage.getItem("ID")
    if (id != undefined){
     const docref = doc(db,'users',id)
     const getdocref = await getDoc(docref)
     const data = getdocref.data() 
      if (data == undefined){
       Router.push('/')
      }
 }
 if (id == undefined){
    Router.push('/')
 }
}
 useEffect(()=>{
    loginornot()
 },[])

 // Function  To Go To Profile 
 const GoToProfile = () =>{
    Router.push("/profile")
 }
// Function To Logout The User 
const Logout = () =>{
    window.localStorage.removeItem("ID")
    Router.push('/')
}
 // Function To Show Options Screen 
 const ShowOrClose = () =>{
   if (Show == "Options"){
    document.getElementById("Options").style.display = "flex"
    ChangeShow("Close")
    return 0
   }
   if (Show == "Close"){
    document.getElementById("Options").style.display = "none"
    ChangeShow("Options")
    return 0
   }

 }
    // Card Component 
    const Card = () =>{
        return (
            <div className = "overflow-hidden w-96 flex flex-col shadow-gray-300 shadow-lg rounded border border-black">
                <img src = "https://foodgressing.com/wp-content/uploads/2022/11/Tim_Hortons_There_s_a_new_must_try_savoury_menu_item_at_your_loc.jpg.webp" />
                <div className = "p-6">
                    <h1 className='text-3xl mb-3'>Jalepeno Pastry</h1>
                    <h3>Details :</h3>
                    <p>Protein : 3g</p>
                    <p>Carbs : 3g</p>
                    <p>Fats : 3g</p>
                    <p>Sugar : 3g</p>
                </div>
                <input  className = "text-xl border p-3 border-0 border-b-2 border-b-black w-36 ml-3 mb-6" type = "number" placeholder = "Quantity" />
                <button className = "border bg-red-500  text-white rounded h-12 border-black w-36 mb-3 ml-3 active:bg-white active:text-red-500">Add To Cart</button>
            </div>
        )
    }
    return (
        <div className = "flex flex-col w-full">
            <div className="w-full flex p-3 flex-row">
                <h1 className = "text-5xl w-11/12 font-title">FOSystem2.0🥗</h1> 
                <button className = "text-2xl mr-6 2xl:block xl:block lg:block hidden md:block sm:hidden">Cart(0)</button>
                <button onClick = {ShowOrClose} className = "text-2xl mr-6">{Show}</button>
            </div>

            <div className = "flex p-6 flex-row gap-11 flex-wrap w-full">
                <Card/>
                <Card/>
                <Card/>
                <Card/>
                <Card/>
                <Card/>
                <Card/>

                
            </div>

            <div id = 'Options' className = "hidden xl:w-500 lg:w-500 md:w-500 sm:w-full w-full fixed flex p-6 top-24 border border-black h-3/4 right-0 flex-col  bg-white">
                <button onClick={GoToProfile} className ="text-4xl active:text-red-600 border-2 border-white active:border-b-red-600 mt-6 mb-14">Profile</button>
                <button className ="text-4xl active:text-red-600 mb-14 border-2 border-white active:border-b-red-600">AddProduct</button>
                <button className = "lg:hidden xl:hidden 2xl:hidden md:hidden sm:block block text-4xl active:text-red-600 mb-14 border-2 border-white active:border-b-red-600">Cart(0)</button>
                <button className ="text-4xl active:text-red-600 mb-14 border-2 border-white active:border-b-red-600" onClick={Logout}>Logout</button>
            </div>
        </div>
    )
}
export default Menu
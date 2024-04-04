'use client'
import {useEffect,useState} from 'react'
import app from '../database/db'
import { getFirestore,doc,getDoc, collection, getDocs, addDoc, query, where, deleteDoc } from 'firebase/firestore'
import { useRouter } from 'next/navigation'
const Menu = () =>{
    const [Details,ChangeDetails] = useState({})
    const [Show,ChangeShow] = useState("Options")
    const [CartNo,ChangeCartNo] = useState(0)
    // Arr of Product 
    const [ArrofProd,changeArrofProd] = useState([])
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
      if (data != undefined){
        ChangeDetails(data)
        if (data.Type == "Customer" ){
            document.getElementById("AddProduct").style.display='none'
            document.getElementById("Auth").style.display='none'
        }
        if (data.Type == "Employee"){
            document.getElementById("AddProduct").style.display='none'
            document.getElementById("Auth").style.display='none'
        }
        if (data.Type == "Owner"){
            document.getElementById("AddProduct").style.display='block'
            document.getElementById("Cart1").style.display= 'none'
            document.getElementById("Cart2").style.display="none"
            document.getElementById("Applications").style.display="block"
        }
      }
 }
 if (id == undefined){
    Router.push('/')
 }
}
// Function To Get Cart No 
const CartNoCheck = async()=>{
    const colref = collection(db,'orders')
    const q = query(colref,where("Customer","==",window.localStorage.getItem("ID")))
     const Data = await getDocs(q)
     const Arr = Data.docs.map((snapshot)=>{
     return (
     {...snapshot.data(),id:snapshot.id})}) 
    ChangeCartNo(Arr.length)
}
// Function To Fetch All Products from database 
const FetchProduct = async() =>{
    const colref = collection(db,'products')
    const getdocinstance = await getDocs(colref)
    const docs = getdocinstance.docs.map((snapshot)=>{
        return {...snapshot.data(),id:snapshot.id}
    })
    changeArrofProd(docs)
}
 useEffect(()=>{
    loginornot()
    CartNoCheck()
    FetchProduct()
 },[])
 // Function To Go to Add Product 
 const GoToAddProduct = () =>{
    Router.push('/add')
 }
 // Function  To Go To Profile 
 const GoToProfile = () =>{
    Router.push("/profile")
 }
// Function To Go To Orders Page 
const gotoOrders = () =>{
    Router.push("/orders")
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
 // Function to go to Applications page 
 const gotoapplications = () =>{
    Router.push("/applications")
}
 // Function To Go To auth 
 const GoToAuth = ()=>{
    Router.push('/auth')
 }
 // Function To Go To Cart 
 const GoToCart = () =>{
    Router.push("/cart")
 }
 // Function To Go to Careers Page 
 const GoToCareers = () =>{
    Router.push("/careers")
 }
 // Function To Go To Clockinorout page 
 const GoToClockin = () =>{
    Router.push('/clockin')
 }
    // Card Component 
    const Card = (props) =>{
        
        // Mini Card
        const  MiniCard = () =>{

            // Function To Delete The Card 
            const Delete = async()=>{
                const docinstance = doc(db,'products',props.id)
                const del = await deleteDoc(docinstance)
                FetchProduct()
            }
            if (Details.Type == "Owner"){
                return (
                <>
                <button onClick = {Delete} id = {props.id+"delete"} className = "border border-black w-36 h-14 rounded text-white text-xl ml-3 mb-3 bg-red-500">Delete</button>
                </>
                )
            }
            else{
                return (
                    <>
                    <button id = {props.id+"button"} onClick={AddToCart} className = "border bg-red-500  text-white rounded h-12 border-black w-36 mb-3 ml-3 active:bg-white active:text-red-500">Add To Cart</button>

                    </>
                )
            }
        }

        
        // Function To Add To Cart 
        const AddToCart = async() =>{
            const prevNo = CartNo + 1
            console.log(props.id)
            const colref = collection(db,'orders')
            var value = document.getElementById(props.id+"input").value 
            if (value == ""){
                value = 1
            }
            console.log(value)
            const details = {
                ...props,
                Quantity:value ,
                NameofCustomer:Details.Name,
                Customer:window.localStorage.getItem("ID")
            }
            console.log(details)
            const SendTodb = await addDoc(colref,details)
            if (SendTodb.id != undefined){
                document.getElementById(props.id).style.display = 'flex'
                document.getElementById(props.id + "button").disabled = true 
                setTimeout(()=>{
                    ChangeCartNo(prevNo)
                    document.getElementById(props.id).style.display = 'none'
                },1000)
                
            }
            
            
        }
        
        return (
            <div className = "overflow-hidden relative h-full w-96 flex flex-col shadow-gray-300 shadow-lg rounded border border-black">
                <img className = "w-full h-64 object-cover" src = {props.ImgSrc} />
                <div className = "p-6">
                    <h1 className='text-3xl mb-3'>{props.Name}</h1>
                    <h2 className = "text-xl font-bold text-green-600">Price : ${props.Price}</h2>
                    <h3>Details :</h3>
                    <p>Protein : {props.Protein}g</p>
                    <p>Carbs : {props.Carbs}g</p>
                    <p>Fats : {props.Fat}g</p>
                    <p>Sugar : {props.Sugar}g</p>
                </div>
                <input id = {props.id+"input"}  className = "text-xl border p-3 border-0 border-b-2 border-b-black w-36 ml-3 mb-6" type = "number" placeholder = "Quantity" />
               <MiniCard/>
               <p id = {props.id} className = "left-3 top-3 hidden text-white absolute bg-red-500 w-48 p-3 text-xl">Added To Cart ✅</p>
            </div>
        )
    }
    return (
        <div className = "flex flex-col w-full">
            <div className="w-full flex p-3 border-b border-black flex-row">
                <h1 className = "text-4xl md:text-5xl xl:text-5xl 2xl:text-5xl sm:text-4xl w-11/12 font-title">FOSystem2.0🥗</h1> 
                <button id = "Cart1" onClick={GoToCart} className = "text-2xl mr-6 2xl:block xl:block lg:block hidden md:block sm:hidden">Cart({CartNo})</button>
                <button onClick = {ShowOrClose} className = "text-2xl mr-6">{Show}</button>
            </div>

            <div className = "flex p-6 flex-row gap-11 flex-wrap w-full">
                {ArrofProd.map((data)=><Card id = {data.id} Name = {data.Name} ImgSrc = {data.ImgSrc} Fat={data.Fat} Price = {data.Price} Protein = {data.Protein} Carbs = {data.Carbs} Sugar={data.Sugar}/> )}
                
            </div>

            <div id = 'Options' className = "hidden xl:w-500 lg:w-500 md:w-500 sm:w-full w-full fixed flex h-full top-20 border-l border-black  right-0 flex-col  bg-white">
                <button onClick={GoToProfile} className ="text-4xl active:text-red-600 border-2 border-white active:border-b-red-600 mt-6 mb-14">Profile</button>
                <button id = "Auth" onClick={GoToAuth} className ="text-4xl active:text-red-600 border-2 border-white active:border-b-red-600  mb-14">Auth</button>
                <button onClick = {GoToAddProduct} id = "AddProduct" className ="text-4xl active:text-red-600 mb-14 border-2 border-white active:border-b-red-600">AddProduct</button>
                <button id = "Applications" onClick={gotoapplications} className = 'text-4xl hidden active:text-red-600 mb-14 border-2 border-white active:border-b-red-600'>Applications📝</button>

                <button onClick={GoToCareers} className = 'text-4xl active:text-red-600 mb-14 border-2 border-white active:border-b-red-600'>Careers🙋🏼‍♂️</button>
                <button onClick = {GoToClockin} className = "text-4xl active:text-red-600 active:border-b-red-600 mb-14 border-2 border-white">Clockinorout⏰</button>
                <button onClick = {gotoOrders} className = "text-4xl active:text-red-600 active:border-b-red-600 mb-14 border-2 border-white">Orders</button>
                <button id = "Cart2" onClick={GoToCart} className = "lg:hidden xl:hidden 2xl:hidden md:hidden sm:block block text-4xl active:text-red-600 mb-14 border-2 border-white active:border-b-red-600">Cart({CartNo})</button>
                <button className ="text-4xl active:text-red-600 mb-14 border-2 border-white active:border-b-red-600" onClick={Logout}>Logout</button>
            </div>
        </div>
    )
}
export default Menu
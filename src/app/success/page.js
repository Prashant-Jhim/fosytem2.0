'use client' 
import { useEffect } from "react"
import app from '../database/db'
import { doc, getFirestore,getDocs,query,where,collection,deleteDoc, updateDoc } from "firebase/firestore"
import { useRouter } from "next/navigation"
const successpayment = () =>{
    const Router = useRouter()
    const db = getFirestore(app)
    // To Confirm The Payment
    const ConfirmPayment = async() =>{
        const IDofCustomer = window.localStorage.getItem("ID")
        // To Delete All Orders in Cart Which Order is Complete
        // Define your query criteria
        const querySnapshot = await getDocs(query(collection(db, 'orders'), where("Customer","==",IDofCustomer)));

       // Iterate over the documents returned by the query and delete them
        querySnapshot.forEach(async (doc) => {
            await deleteDoc(doc.ref);
         console.log(`Document with ID ${doc.id} deleted successfully.`);
        });
        // To Confirm The order in Database 
        const ID = window.localStorage.getItem("OrderID")
        const docinstance = doc(db,'successorders',ID)
        const update = await updateDoc(docinstance,{
            Purchase:true
        })
    }
    useEffect(()=>{
        ConfirmPayment()
    },[])
    // Function To GetBack To Cart 
    const GoBack = () =>{
        Router.push("/cart")
    }
    return (
        <div className = "flex flex-col w-full p-32 items-center">
            <h1 className = ' font-title text-5xl'>FOSystem2.0🥗</h1>
            <p className = 'text-3xl mt-6'>Thank u for your payment✅</p>
            <button onClick={GoBack} className = "text-xl mt-6 border border-black p-3 rounded shadow-lg active:shadow-md active:text-white   active:bg-green-500">⏪ Go Back</button>
        </div>
    )
}
export default successpayment
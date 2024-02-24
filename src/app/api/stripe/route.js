import {NextRequest, NextResponse } from "next/server"
import app from '../database/db'
import { addDoc, collection, getFirestore } from "firebase/firestore"
const stripe = require("stripe")(process.env.STRIPEAPISERVER)
export async function POST(request,response){
    const db = getFirestore(app)
    const colref = collection(db,"successorders")
    const Req = await request.json()
    const ArrofProducts = Req.CartFeed
     const lineItems = ArrofProducts.map((Product)=>({
        price_data:{
            currency:"cad",
            product_data:{
                name:Product.Name
            },
            unit_amount:Product.Price * 100,
        },
        quantity:Product.Quantity
     }))

    const session = await stripe.checkout.sessions.create({
        payment_method_types:["card"],
        line_items:lineItems,
        mode:"payment",
        success_url:Req.url+"/success",
        cancel_url:Req.url+"/cart"
    })
    const date = new Date().toDateString()
    const time = new Date().toTimeString()
    ArrofProducts.map(async(data)=>{
        const Details = {...data,purchase:false,session:session.id,status:"Pending"}
        const SentToDb = await addDoc(colref,Details)
    })
    

    return NextResponse.json({status:true,id:session.id})
}
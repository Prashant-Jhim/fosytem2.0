'use client'
import { useRouter } from "next/navigation"

const orders = () =>{
    const Router = useRouter()
    // Function To  Get Back To Menu 
    const GotoMenu = () =>{
        Router.push("/menu")
    }
    // Function Of Card 
    const Card = () =>{
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
            <h3 className = 'text-xl mb-6 ml-6'>Orders:</h3>
            <div className = "flex ml-6 flex-col">
                <Card/>
            </div>
        </div>
    )
}
export default orders
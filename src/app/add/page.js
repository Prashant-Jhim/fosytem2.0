'use client'
import {useState} from 'react'
import app from '../database/db'
import {getStorage,getDownloadURL, ref, uploadBytes} from 'firebase/storage'
import { collection, getFirestore ,addDoc, doc } from 'firebase/firestore'
const Addproduct = () =>{
    const [Src,ChangeImgRef] = useState(undefined)
    // Database Part for Storage or Datastore
    const storage = getStorage(app)
    const datastore = getFirestore(app)

    // ColRef 
    const colref = collection(datastore,"products")
    // Function To Trigger Click Function 
    const ClickFunction = () =>{
        document.getElementById("File").click()
    }
    
    // Function to preview image upload 
    const prevorupload = (event) =>{
        const file = event.target.files;
        ChangeImgRef(file[0])
        if (file) {
        const fileReader = new FileReader();
        const preview = document.getElementById('preview');
        fileReader.onload = event => {
            preview.setAttribute('src', event.target.result);
            

        }
        fileReader.readAsDataURL(file[0]);
    }
    }
    // Function To Clear 
    const ClearAll = () =>{
        document.getElementById("ProductName").value  = ""
        document.getElementById("ProductPrice").value =""
        document.getElementById("Protein").value =""
        document.getElementById("Carbs").value =""
        document.getElementById("Fat").value =""
        document.getElementById("Sugar").value =""
        document.getElementById("preview").src = "https://foodgressing.com/wp-content/uploads/2022/11/Tim_Hortons_There_s_a_new_must_try_savoury_menu_item_at_your_loc.jpg.webp"
    }
    // Function To Add Product in  Database 
    const addProduct = async() =>{
        const upload = Src
        const imgref = ref(storage,`images/${upload.name} + hahflahflh`)
        const upld = await uploadBytes(imgref,upload)
        const url = await getDownloadURL(upld.ref)
        
        const Details = {
            Name:document.getElementById("ProductName").value ,
            Price:document.getElementById("ProductPrice").value ,
            Protein:document.getElementById("Protein").value ,
            Carbs:document.getElementById("Carbs").value ,
            Fat:document.getElementById("Fat").value ,
            Sugar:document.getElementById("Sugar").value ,
            ImgSrc:url
        }

        const AddDocInstance = await addDoc(colref,Details)
        if (AddDocInstance.id != undefined){
            document.getElementById("alert").style.display = "flex"
            setTimeout(()=>{
                document.getElementById("alert").style.display = "none"
            },2000)
        }
    }
    return (
        <div className = "flex flex-col items-center">
            <input onChange={prevorupload}   id = "File" type="file" className = "hidden" />
            <button className = "fixed object-contain text-3xl top-3 left-6 ">⏪Back</button>
            <h1 className = "md:text-5xl lg:text-5xl sm:text-5xl xl:text-5xl 2xl:text-5xl text-5xl text-red-500 mt-24 font-title">FOSystem2.0🥗</h1>
            <p id = "alert" className = "text-lg p-6 hidden bg-green-200 mt-6 mb-6 rounded">New Product Added ✅</p>
            <div className = "relative flex flex-col">
                <img id = "preview" className = " rounded lg:w-96 xl:w-96 2xl:w-96 sm:w-full w-full  md:w-96 h-96" src = "https://foodgressing.com/wp-content/uploads/2022/11/Tim_Hortons_There_s_a_new_must_try_savoury_menu_item_at_your_loc.jpg.webp" / >
                <button onClick={ClickFunction} className = "absolute lg:w-96 xl:w-96 2xl:w-96 sm:w-full w-full  md:w-96 h-96 bg-white active:bg-opacity-70  bg-opacity-20 text-4xl">Upload 🆙</button>
            </div>
            <input id =  "ProductName" className = "border-0 border-b-2 border-b-black xl:w-96 2xl:w-96 lg:w-96 md:w-96 sm:w-11/12 w-11/12 outline-none text-2xl p-3 mt-3" type = "text" placeholder = "Name Of Product :" />
            <input id = "ProductPrice" className = "border-0 border-b-2 border-b-black xl:w-96 2xl:w-96 lg:w-96 md:w-96 sm:w-11/12 w-11/12 outline-none text-2xl p-3 mt-6"  type = "text" placeholder = "Price Of Product :" />
            <label className = "mt-6">Details :</label>
            <div className = "flex flex-row mb-6">
                <label className = " text-xl p-3  ">Protein (in Gram) : </label>
                <input id = "Protein" placeholder="No" className = "w-24 p-2 border border-black" type="number" />
            </div>
            <div className = "flex flex-row mb-6">
                <label className = " text-xl p-3   ">Carbs (in Gram) : </label>
                <input id = "Carbs" placeholder="No" className = "w-24 p-2 border border-black" type="number" />
            </div>
            <div className = "flex flex-row mb-6">
                <label className = " text-xl p-3 ">Fat (in Gram) : </label>
                <input id = "Fat" placeholder="No" className = "w-24 p-2 border border-black" type="number" />
            </div>
            <div className = "flex flex-row mb-6">
                <label className = " text-xl p-3   ">Sugar (in Gram) : </label>
                <input id = "Sugar" placeholder="No" className = "w-24 p-2 border border-black" type="number" />
            </div>

            <div className = "flex flex-row mb-6">
                <button onClick={addProduct} className = "bg-green-500 text-white border border-black text-xl rounded mr-6 p-4">Add ✅</button>
                <button onClick={ClearAll} className = " border border-black text-xl  rounded p-4 bg-red-500 text-white">Clear</button>
            </div>
        </div>
    )
}
export default Addproduct
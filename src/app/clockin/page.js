'use client'
import { addDoc, collection, doc, getDoc, getDocs, getFirestore, query, updateDoc, where } from 'firebase/firestore'
import app from '../database/db'
import {useState,useEffect} from 'react'
import { useRouter } from 'next/navigation'

const clockin = () =>{
    const Router = useRouter()
    const months = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sept","Oct","Nov","Dec"]
    const [view,changeview] = useState("hoursheet")
    const db = getFirestore(app)
    const colref = collection(db,'clockinornot')
    const [Alert,ChangeAlert] = useState("")
    const [Arr,ChangeArr] = useState([])

    // function to check it store or owner 
    const Ownorsto = async() =>{
        const ID = window.localStorage.getItem("ID") 
        if (ID != undefined){
            const docinstance = doc(db,"users",ID)
            const getdocinstance = await getDoc(docinstance) 
            const docs = getdocinstance.data()
            if (docs.Type == "Owner" && view != 'hoursheet'){
                FetchBadges()
                document.getElementById("date").style.display = 'block'
                document.getElementById("PunchNo").style.display = 'none'
                document.getElementById("submit").style.display = 'none'
                document.getElementById("showbadges").style.display = 'block'
            }
            if (docs.Type == "Employee" && view != 'hoursheet'){
                document.getElementById("date").style.display = 'none'
                document.getElementById("PunchNo").style.display = 'block'
                document.getElementById("submit").style.display = 'block'
                document.getElementById("showbadges").style.display = 'none'
            }
        }
    }
    // Function To Go back to menu 
    const goback = ()=>{
        Router.push('/menu')
    }
    // Function To get Badges for particular date 
    const fetchbydate = async() =>{
        const date = document.getElementById("date").value 
       if (date != ''){
        const datearr = date.split("-")
        // date acc to db
        const datedb = datearr[2] + " " + months[datearr[1]-1] + " " + datearr[0]
        console.log(datedb)
        const q = query(colref,where("StartDate","==",datedb))
        const getdocinstance = await getDocs(q) 
        const docs = getdocinstance.docs.map((snapshot)=>{
            return{...snapshot.data(),id:snapshot.id}
        })
        ChangeArr(docs)
       }
       if (date == ''){
        FetchBadges()
       }

    }
    // Function To Fetch The Time Badges 
    const FetchBadges = async() =>{
        const getdocinstance = await getDocs(colref)
        const data = getdocinstance.docs.map((snapshot)=>{
            return {...snapshot.data(),id:snapshot.id}
        })
        ChangeArr(data)
        
    }
    useEffect(()=>{
        Ownorsto()
    },[])
    
    // Card Component 
    const CardComponent = (props) =>{
        const [start,changeStart] = useState(props.start)
        const [end,ChangeEnd] = useState(props.end)
        const [Total,ChangeTotal] = useState(props.Total)
        const [Edit,ChangeEdit] = useState("Edit✍️")
        const [disable,changestate] = useState("number")
        const [alert,changealert] = useState("")

        
        const VerifyHours = () =>{
            var time1 = document.getElementById(props.id+"-="+'start').value 
            var time2 = document.getElementById(props.id+"-="+'end').value 
            if (time1 == '' && time2 == ""){
                return true
            }
            var time1arr = time1.split(":")
            var time2arr = time2.split(":")
            var min1 = parseInt(time1arr[1]) / 100 
            var min2 = parseInt(time2arr[1]) / 100 
            time1 = parseInt(time1arr[0]) + min1
            time2 = parseInt(time2arr[0]) + min2
            if (time1 < time2){
                var newtotal = time2 - time1
                newtotal = Math.round(newtotal*100)/100
                document.getElementById(props.id+"-="+'start').style.borderBottomColor = "green"
                document.getElementById(props.id+"-="+'end').style.borderBottomColor = "green"
                changeStart(time1)
                ChangeEnd(time2)
                ChangeTotal(newtotal)
                return true
            }
            if (time1 > time2){
                if (props.enddate != props.startdate){
                    document.getElementById(props.id+"-="+'start').style.borderBottomColor = "green"
                    document.getElementById(props.id+"-="+'end').style.borderBottomColor = "green"
                    changeStart(time1)
                    ChangeEnd(time2)
                    return true
                }
                if (props.enddate == props.startdate){
                    document.getElementById(props.id+"-="+'start').style.borderBottomColor = "crimson"
                    document.getElementById(props.id+"-="+'end').style.borderBottomColor = "crimson"
                    return false 
                }
            }
            
        }
        

       useEffect(()=>{
        if (props.Clockout == false){
            document.getElementById(props.id + '-=' + 'alert').style.display = 'block'
            changealert("This Badge has not been clockout❌")
        }
        if (props.Approved == true){
            document.getElementById(props.id + '-=' + 'alert').style.display = 'block'
            changealert("This Badge has been approved ✅")
        }
       },[])
        
        
         
        
       

        
        //Function To Edit Hours 
        const EditHours = () =>{
            if (disable == "number"){
                document.getElementById(props.id+"-="+'start').style.borderBottomColor = 'black'
                document.getElementById(props.id + '-='+"end").style.borderBottomColor='black'
                changestate("time")
                ChangeEdit("⏪Back")
                return 0
            }
            if (disable == "time"){
                document.getElementById(props.id+"-="+'start').style.borderBottomColor = 'none'
                document.getElementById(props.id + '-='+"end").style.borderBottomColor='none'
                changestate("number")
                ChangeEdit("Edit✍️")
            }
        }
        // Approve Funtion 
        const approve = async( )=>{
            const verify = VerifyHours()
            if (verify == true){
                const update = {
                    Start:start,
                    End:end ,
                    Total:Total,
                    Clockout:true,
                    Approved:true
                }
                console.log(update)
                const docinstance = doc(db,'clockinornot',props.id) 
                const updateindb = await updateDoc(docinstance,update)
                console.log(updateindb)
                changealert("This Badge has been Approved ✅")
                document.getElementById(props.id + '-=' + 'alert').style.display = 'block'
            }
        }
        return (
            <div className = 'mt-6 flex p-6  rounded border border-black flex-col' >
                <h1 className = 'text-lg'>PunchNo : {props.PunchNo}</h1>
                 <div>
                 <h3 className = 'mt-6 mb-3'>Start Date : {props.startdate}</h3>
                    <p className = ''>Start : <input onChange={VerifyHours}  id = {props.id+"-="+'start'} className = 'text-black p-2 border  rounded font-bold'  placeholder = {start}   type = {disable} min= "0" max="23.59" /></p>
                 
                   <h3 className = 'mt-6 mb-3'>End Date : {props.enddate}</h3>
                    <p className = ''>Ends : <input onChange={VerifyHours}     id = {props.id+"-="+'end'} className = 'text-black p-2 border mt-3  rounded font-bold' placeholder = {end}  type ={disable} min= "0" max="23.59"/></p>
                   
                    <p>Total Hours : {Total} Hr</p>
                    <div className = 'gap-3 flex p-3'>
                        <button onClick = {approve}  className = "border shadow-md bg-green-500 text-white rounded border-black p-3">Approve✅</button>
                        <button onClick = {EditHours} className = 'border shadow-md active:bg-blue-200 rounded border-black p-3'>{Edit}</button>
                    </div>
                    <p id = {props.id + '-=' + 'alert'} className = ' hidden text-xs pl-3 mt-3'>{alert}</p>
                 </div>
            </div>
        )
    }
    
    // Function to Clockin or Clockout 
    const clockinorout = async() =>{
        const months = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sept","Oct","Nov","Dec"]
        const Dat = new Date()
        const Year = Dat.getFullYear()
        const month = Dat.getMonth()
        const Hour = Dat.getHours() 
        var Min = Dat.getMinutes() 
        const DateInNum = Dat.getDate()
        const PunchNo = document.getElementById("PunchNo").value 

        if (PunchNo != ""){
            Min = Min / 100
            const q = query(colref,where("PunchNo","==",PunchNo),where("Clockout","==",false))
            const getdocinstance = await getDocs(q) 
            const docs = getdocinstance.docs.map((snapshot)=>{
                return {...snapshot.data(),id:snapshot.id}
            })
            if (docs.length == 0){
               
                const Details = {
                    StartDate : String(DateInNum) + " " + months[month] + " " + String(Year),
                    Start:Hour+Min,
                    StartDateinNum :DateInNum,
                    Month:months[month],
                    Year:Year,
                    EndDate:"",
                    End:"",
                    Clockout:false,
                    PunchNo:PunchNo,
                    Total:0,
                    Approved:false
                }
                const senttodb = await addDoc(colref,Details)
                ChangeAlert("Clockin Done ✅")
                document.getElementById("Alert").style.display = "block"
            }
            if (docs.length != 0){
                var Total;
                var End = Hour+Min
                var Start = docs[0].Start 
                if (Start < End ){
                    Total = End - Start 
                }
                if (Start > End ){
                    var diff1 = 24 - Start 
                    var diff2 = Hour 
                    var hrdiff = diff1 + diff2 + Min 
                    Total = hrdiff - Start 
                }
                Total = Math.round(Total*100)/100
                const update = {
                    EndDate:String(DateInNum) + " " + months[month] + " " + String(Year),
                    End,
                    Total,
                    Clockout:true 
                }
                const docinstance = doc(db,'clockinornot',docs[0].id)
                const updateindb = await updateDoc(docinstance,update)
                ChangeAlert("Clockout Done ✅")
                document.getElementById("Alert").style.display = "block"
            }
        }

        

    }

    // Function To Change Screen From badges to hoursheet vice versa 
    const changescreen = (event) =>{
        const id = event.target.id 
        console.log(id)
        if (id == "badges"){
            changeview("hoursheet")
            return true 
        }
        if (id == "hoursheet"){
            changeview("badges")
            FetchBadges()
            return true 
        }
    }
    //Function To Filter The Badges acc to dates 
    const filterbyweek = async() =>{
        const date1 = document.getElementById("date1").value
        const date1arr = date1.split("-") 
        const date2 = document.getElementById("date2").value 
        const date2arr = date2.split("-")
        const month1 = months[date1arr[1]-1]
        const month2 = months[date2arr[1]-1]
        if (month1 == month2){
            const q = query(colref,where("Month",'==',month1))
            const getdocinstance = await getDocs(q) 
            const docs = getdocinstance.docs.map((snapshot)=>{
                const data = snapshot.data() 
                var date1 = date1arr[2]
                var date2 = date2arr[2]
                if (data.StartDateinNum >= parseInt(date1) && data.StartDateinNum  <= parseInt(date2) ){
                    return {...snapshot.data(),id:snapshot.id}
                }
                 
            })
            ChangeArr(docs)
            
        }
    }
    
    if (view == "hoursheet"){
        return (
            <div className = 'flex flex-col items-center'>
                <button onClick={goback} className = 'text-3xl absolute top-3 left-3'>⏪Back</button>
                <button id = "hoursheet"  onClick = {changescreen} className = 'text-3xl   absolute top-3 right-6'>Badges📤</button>
                 <h1 className = "text-5xl font-title mt-28 mb-12">FOSystem2.0🥗</h1>
                <label className = "text-xl  ">Start</label>
                <input id = "date1" className = "text-xl mt-3 border-0  border-b-black border-b-2" type = "date"  />
                <label className = 'text-xl mt-6'>End</label>
                <input id = 'date2' className = 'text-xl mt-3 border-0 border-b-black border-b-2' type = 'date'  />
                <button onClick={filterbyweek} className = "border mt-6 border-black p-3  rounded  shadow-md active:shadow-lg">Search🔍</button>
                {Arr.map((data)=>{
                if (data != undefined){
                    return (
                <CardComponent Approved = {data.Approved} id = {data.id } enddate={data.EndDate} startdate={data.StartDate} PunchNo = {data.PunchNo} end = {data.End} start={data.Start} Total={data.Total} Clockout={data.Clockout} />
                )}}
                )}

            </div>
        )
    }
    

    if (view == "badges"){
        return (
            <div className = "flex flex-col w-full items-center">
                <button onClick= {goback} className = "absolute top-3 left-3 text-3xl">⏪Back</button> 
                <button id = "badges"  onClick = {changescreen} className = ' top-3 right-8 absolute text-3xl '>Hoursheet⏰</button>
                <h1 className = "text-5xl font-title mt-28 mb-12">FOSystem2.0🥗</h1>
                <input id = "PunchNo" className = "text-xl mb-6 border-0 border-b-2 outline-none border-black p-3 " placeholder = "Enter The Punch No" />
                <input id = 'date' type = 'date' className = 'text-xl hidden mb-6 border-0 border-b-2 border-black p-3 outline-none' />
                <button id = "submit" onClick={clockinorout} className = "bg-green-400 active:bg-white active:text-green-400 shadow-md active:shadow-lg border border-black rounded p-3">Submit</button>
                <button onClick={fetchbydate} id = "showbadges" className = " hidden mt-6 border border-black p-3 rounded shadow-md ">Show Badges 🔎</button>
                <p id = "Alert" className = "hidden border border-black p-3 mt-3 bg-green-300 rounded">{Alert}</p>
                {Arr.map((data)=><CardComponent Approved = {data.Approved} id = {data.id } enddate={data.EndDate} startdate={data.StartDate} PunchNo = {data.PunchNo} end = {data.End} start={data.Start} Total={data.Total} Clockout={data.Clockout} />)}
    
            </div>
        )
    }
}
export default clockin
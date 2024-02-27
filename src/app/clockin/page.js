'use client'
import { collection, getFirestore } from 'firebase/firestore'
import app from '../database/db'

const clockin = () =>{
    const db = getFirestore(app)
    const colref = collection(db,'clockinornot')
    // Function To Clock in 
    const ClockInOrOut = () =>{
        const date = new Date()
        const year = date.getFullYear()
        const DateInNumber = date.getDate()
        const Day = date.getDay() 
        const Mon = date.getMonth()
        const hour = date.getHours()
        const min = date.getMinutes()

        var DayInString ;
        var MonthInString;
        if (Day == 0){
            DayInString = "Sunday"
        }
        if (Day == 1){
            DayInString = "Monday"
        }
        if (Day == 2){
            DayInString = "Tuesday"
        }
        if (Day == 3){
            DayInString = "Wednesday"
        }
        if (Day == 4){
            DayInString = "Thursday"
        }
        if (Day == 5){
            DayInString = "Friday"
        }
        if (Day == 6){
            DayInString = "Saturday"
        }

        if (Mon == 0){
            MonthInString = "January"
        }
        if (Mon == 1){
            MonthInString = "Febuary"
        }
        if (Mon == 2){
            MonthInString = "March"
        }
        if (Mon == 3){
            MonthInString = "April"
        }
        if (Mon == 4){
            MonthInString = "May"
        }
        if (Mon == 5){
            MonthInString = "June"
        }
        if (Mon == 6){
            MonthInString = "July"
        }
        if (Mon == 7){
            MonthInString = "August"
        }
        if (Mon == 8){
            MonthInString = "September"
        }
        if (Mon == 9){
            MonthInString = "October"
        }
        if (Mon == 10){
            MonthInString = "November"
        }
        if (Mon == 11){
            MonthInString = "December"
        }

        const Details = {
            PunchNo:document.getElementById("PunchNo").value ,
            DateInNumber,
            DayInString,
            MonthInString,
            hour,
            min,
            FullDate : String(DateInNumber) + ' ' + MonthInString + " " + year
        }
        console.log(Details)
        
        
    }

    return (
        <div className = "flex flex-col w-full items-center">
            <button className = "absolute top-3 left-3 text-3xl">⏪Back</button>
            <h1 className = "text-5xl font-title mt-28 mb-12">FOSystem2.0🥗</h1>
            <input id = "PunchNo" className = "text-xl mb-6 border-0 border-b-2 outline-none border-black p-3 " placeholder = "Enter The Punch No" />
            <button onClick={ClockInOrOut} className = "bg-green-400 active:bg-white active:text-green-400 shadow-md active:shadow-lg border border-black rounded p-3">Submit</button>
        </div>
    )
}
export default clockin
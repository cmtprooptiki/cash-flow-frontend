// import React,{useState,useEffect} from 'react'
// import axios from 'axios'
// import { useNavigate } from 'react-router-dom'
// import apiBaseUrl from '../../apiConfig'

// import Select from 'react-select';
// import { InputText } from 'primereact/inputtext';
// import { Button } from 'primereact/button';
// import { InputTextarea } from 'primereact/inputtextarea';
// import { Dropdown } from 'primereact/dropdown';
// import { Calendar } from 'primereact/calendar';
// import { InputNumber } from 'primereact/inputnumber';
// import { Divider } from 'primereact/divider';

// const BudgetForm = () => {
//     const [name, setName] = useState("");
//     const [ammount, setAmmount] = useState("");
//     const [status, setStatus] = useState("");
//     const [date, setDate] = useState(null)

//     const [isUpdateMode, setIsUpdateMode] = useState(false); // State to track if it's an update or a new record

//     const[msg,setMsg]=useState("");
//     const{id} = useParams();

//     const navigate = useNavigate();

//     const saveBudget = async (e) =>{
//         e.preventDefault();
//         try{
//             await axios.post(`${apiBaseUrl}/budget`, {
//             ammount:ammount,
//             date:date
//             });
//             navigate("/budget");
//         }catch(error){
//             if(error.response){
//                 setMsg(error.response.data.msg);
//             }
//         }
//     }

//     const formatDateToInput = (dateString) => {
//         if(dateString === null || dateString =="" || dateString === NaN){
//             return ""
//         }
//         dateString=dateString.split('T')[0];
//         const [year, month, day] = dateString.split('-');
//         return `${year}-${month}-${day}`;
//     };

//     useEffect(()=>{
//         const getBudgetById = async()=>{
//             const response=await axios.get(`${apiBaseUrl}/budget/${id}`, {timeout: 5000});
//             try
//             {
//                 const response=await axios.get(`${apiBaseUrl}/budget/${id}`, {timeout: 5000});
//                 setAmmount(response.data.ammount);
//                 setDate(formatDateToInput(response.data.date))
//             }
//             catch(error)
//             {
//                 if(error.response){
//                     setMsg(error.response.data.msg);
//                 }
//             }
//         };
//         getBudgetById();
//     }, [id]);

//     const updateBudget = async(e) =>{
//         e.preventDefault();
//         try{
//             await axios.patch(`${apiBaseUrl}/budget/${id}`, {
//                 ammount:ammount,
//                 date:date
//             });

//             navigate("/budget");
//         }
//         catch(error){
//             if(error.response){
//                 setMsg(error.response.data.msg);
//                 }
//         }
//     };

//     return(
//         <div >
//         <h1 className='title'>ΔΙΑΧΕΙΡΙΣΗ BUDGET</h1>
//       <form onSubmit={saveBudget}>
//       <div className="grid">
//       <div className="col-12 md:col-6">
//           <div className="card p-fluid">
//           <div className=""><Divider><span className="p-tag text-lg">Στοιχεία Budget</span></Divider></div>

//               <div className="field">
//                   <label htmlFor="name2">ΤΡΑΠΕΖΙΚΑ ΔΙΑΘΕΣΙΜΑ</label>
//                   <div className="control">

//                   <InputNumber id="ammount"  value={ammount} onChange={(e)=> setAmmount(e.target.value)} />
//                   </div>
//               </div>

//               <div className="field">
//                     <label htmlFor="date">ΗΜΕΡΟΜΗΝΙΑ ΥΠΟΒΟΛΗΣ</label>
//                     <div className="control">

//                     <Calendar id="date"  value={date} onChange={(e)=> setDate(e.target.value)} inline showWeek />
//                         </div>
//                 </div>

//           </div>
//           <div className="field">
//                             <div className="control">
//                                 <Button type="submit" className="button is-success is-fullwidth">Προσθήκη</Button>
//                             </div>
//                         </div>
//         </div>
//         </div>
//     </form>
//     <form action={updateBudget}>
//     <div className="grid">
//       <div className="col-12 md:col-6">
//           <div className="card p-fluid">
//           <div className=""><Divider><span className="p-tag text-lg">Στοιχεία Budget</span></Divider></div>

//               <div className="field">
//                   <label htmlFor="name2">ΤΡΑΠΕΖΙΚΑ ΔΙΑΘΕΣΙΜΑ</label>
//                   <div className="control">

//                   <InputNumber id="ammount"  value={ammount} onChange={(e)=> setAmmount(e.target.value)} />
//                   </div>
//               </div>

//               <div className="field">
//                     <label htmlFor="date">ΗΜΕΡΟΜΗΝΙΑ ΥΠΟΒΟΛΗΣ</label>
//                     <div className="control">

//                     <Calendar id="date"  value={date} onChange={(e)=> setDate(e.target.value)} inline showWeek />
//                         </div>
//                 </div>

//           </div>
//           <div className="field">
//                             <div className="control">
//                                 <Button type="submit" className="button is-success is-fullwidth">Προσθήκη</Button>
//                             </div>
//                         </div>
//         </div>
//         </div>
//     </form>
//     </div>
//     )
// }

// export default BudgetForm;

import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import apiBaseUrl from '../../apiConfig';

import { InputNumber } from 'primereact/inputnumber';
import { Button } from 'primereact/button';
import { Calendar } from 'primereact/calendar';
import { Divider } from 'primereact/divider';
import moment from 'moment/moment';


const BudgetForm = () => {
    const [name, setName] = useState("");
    const [ammount, setAmmount] = useState(0.00);
    const [status, setStatus] = useState("");
    const today = new Date();
    const today_date = today.toLocaleDateString();
    const [date, setDate] = useState(today_date);

    const [msg, setMsg] = useState("");
    const [isUpdateMode, setIsUpdateMode] = useState(false); // Track if it's update mode
    const [existingBudgetId, setExistingBudgetId] = useState(null); // Store the budget ID if it exists

    const navigate = useNavigate();

    // Function to save a new budget
    const saveBudget = async (e) => {
        e.preventDefault();
        try {

            let date = new Date();
            let formattedDate = moment(date).format('YYYY-MM-DD');
            await axios.post(`${apiBaseUrl}/budget`, {
                ammount: ammount,
                date: formattedDate
            });
            navigate("/budget");
        } catch (error) {
            if (error.response) {
                setMsg(error.response.data.msg);
            }
        }
    };

    // Function to format date
    const formatDateToInput = (dateString) => {
        if (!dateString || dateString === "" || dateString === NaN) {
            return "";
        }
        dateString = dateString.split('T')[0];
        const [year, month, day] = dateString.split('-');
        return `${year}-${month}-${day}`;
    };

    // Fetch existing budget records
    useEffect(() => {
        const checkExistingBudget = async () => {
            try {
                const response = await axios.get(`${apiBaseUrl}/budget`, {timeout: 5000});
                if (response.data && response.data.length > 0) {
                    // If a budget exists, set the form to update mode
                    const budget = response.data[0]; // Assuming you only have one record
                    setAmmount(budget.ammount);
                    setDate(formatDateToInput(new Date().toLocaleDateString()));
                    console.log("date : ", date)
                    setExistingBudgetId(budget.id); // Store the budget ID
                    setIsUpdateMode(true);
                } else {
                    // No budget found, set to create mode
                    setIsUpdateMode(false);
                }
            } catch (error) {
                if (error.response) {
                    setMsg(error.response.data.msg);
                }
            }
        };

        checkExistingBudget();
    }, []);

    // Function to update existing budget
    const updateBudget = async (e) => {
        e.preventDefault();
        try {
            let date = new Date();
            let formattedDate = moment(date).format('YYYY-MM-DD');
            await axios.patch(`${apiBaseUrl}/budget/${existingBudgetId}`, {
                ammount: ammount,
                date: formattedDate
            });
            navigate("/budget");
        } catch (error) {
            if (error.response) {
                setMsg(error.response.data.msg);
            }
        }
    };

    return (
        <div>
            <h1 className='title'>ΔΙΑΧΕΙΡΙΣΗ BUDGET</h1>
            {/* Conditionally render the Save form if not in update mode */}
            {!isUpdateMode && (
                <form onSubmit={saveBudget}>
                    <div className="grid">
                        <div className="col-12 md:col-6">
                            <div className="card p-fluid">
                                <div className="">
                                    <Divider>
                                        <span className="p-tag text-lg">Στοιχεία Budget</span>
                                    </Divider>
                                </div>

                                <div className="field">
                                    <label htmlFor="name2">ΤΡΑΠΕΖΙΚΑ ΔΙΑΘΕΣΙΜΑ</label>
                                    <div className="control">
                                    <InputNumber id="totalAmmount" className="input" mode="decimal" minFractionDigits={2} value={ammount} onChange={(e) => setAmmount(e.value)} />
                                    </div>
                                </div>

                                {/* <div className="field">
                                    <label htmlFor="date">ΗΜΕΡΟΜΗΝΙΑ ΥΠΟΒΟΛΗΣ</label>
                                    <div className="control">
                                        <Calendar
                                            id="date"
                                            value={date}
                                            onChange={(e) => setDate(e.value)}
                                            inline
                                            showWeek
                                        />
                                    </div>
                                </div> */}
                            </div>
                            <div className="field">
                                <div className="control">
                                    <Button type="submit" className="button is-success is-fullwidth">Προσθήκη</Button>
                                </div>
                            </div>
                        </div>
                    </div>
                </form>
            )}

            {/* Conditionally render the Update form if in update mode */}
            {isUpdateMode && (
                <form onSubmit={updateBudget}>
                    <div className="grid">
                        <div className="col-12 md:col-6">
                            <div className="card p-fluid">
                                <div className="">
                                    <Divider>
                                        <span className="p-tag text-lg">Στοιχεία Budget</span>
                                    </Divider>
                                </div>

                                <div className="field">
                                    <label htmlFor="name2">ΤΡΑΠΕΖΙΚΑ ΔΙΑΘΕΣΙΜΑ</label>
                                    <div className="control">
                                    <InputNumber id="totalAmmount" className="input" mode="decimal" minFractionDigits={2} value={ammount} onChange={(e) => setAmmount(e.value)} />
                                    </div>
                                </div>

                                {/* <div className="field">
                                    <label htmlFor="date">ΗΜΕΡΟΜΗΝΙΑ ΥΠΟΒΟΛΗΣ</label>
                                    <div className="control">
                                        <Calendar
                                            id="date"
                                            value={date}
                                            onChange={(e) => setDate(e.value)}
                                            inline
                                            showWeek
                                        />
                                    </div>
                                </div> */}
                            </div>
                            <div className="field">
                                <div className="control">
                                    <Button type="submit" className="button is-success is-fullwidth">Ενημέρωση</Button>
                                </div>
                            </div>
                        </div>
                    </div>
                </form>
            )}
        </div>
    );
};

export default BudgetForm;
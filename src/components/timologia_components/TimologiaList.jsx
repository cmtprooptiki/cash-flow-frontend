import React,{useState,useEffect} from 'react'
import {Link} from "react-router-dom"
import axios from 'axios'
import { useSelector } from 'react-redux';
import '../../buildinglist.css';
import apiBaseUrl from '../../apiConfig';
//import { DeleteTimologio } from '../../../../cash-flow-Backend/controllers/Timologia';

const TimologiaList = () => {
    const [Timologia, setTimologia] = useState([]);
    const {user} = useSelector((state) => state.auth)

    useEffect(()=>{
        getTimologia()
    }, []);

    const getTimologia = async() =>{
        const response = await axios.get(`${apiBaseUrl}/timologia`);
        setTimologia(response.data);
    }

    const deleteTimologio = async(timologioId)=>{
        await axios.delete(`${apiBaseUrl}/timologia/${timologioId}`);
        getTimologia();
    }

    return(
        <div>
        <h1 className='title'>ΤΙΜΟΛΟΓΙΑ</h1>
        {user && user.role ==="admin" && (
        <Link to={"/timologia/add"} className='button is-primary mb-2'>Προσθήκη Νέου Τιμολογίου</Link>
        )}
        <div className="table-responsive-md">

        <table className='table is-stripped is-fullwidth'>
            <thead>
                <tr>

                    <th>#</th>

                    <th>ΗΜΕΡΟΜΗΝΙΑ ΤΙΜΟΛΟΓΗΣΗΣ</th>
                    <th>ΕΚΤΙΜΩΜΕΝΗ ΗΜΕΡΟΜΗΝΙΑ ΠΛΗΡΩΜΗΣ</th>
                    <th>ΕΚΤΙΜΩΜΕΝΗ ΗΜΕΡΟΜΗΝΙΑ ΠΛΗΡΩΜΗΣ σενάριο 2</th>
                    <th>ΕΚΤΙΜΩΜΕΝΗ ΗΜΕΡΟΜΗΝΙΑ ΠΛΗΡΩΜΗΣ σενάριο 3</th>
                    <th>ΠΟΣΟ ΧΩΡΙΣ Φ.Π.Α</th>
                    <th>ΠΟΣΟ ΜΕ Φ.Π.Α</th>
                    <th>ΕΚΤΙΜΩΜΕΝΟ ΦΠΑ</th>
                    <th>ΠΡΑΓΜΑΤΙΚΗ ΗΜΕΡΟΜΗΝΙΑ ΠΛΗΡΩΜΗΣ</th>
                    <th>ΠΟΣΟ ΕΙΣΠΡΑΞΗΣ ΜΕ Φ.Π.Α</th>
                    <th>ΠΑΡΑΤΗΡΗΣΕΙΣ</th>
                    <th>ΕΝΕΡΓΟΠΟΙΗΜΕΝΟ</th>
                    <th>Ενέργειες</th>
                </tr>
            </thead>
            <tbody>
                {Timologia.map((Timologia,index)=>(
                    <tr key={Timologia.id}>
                        <td>{index+1}</td>
                        <td>{Timologia.invoice_date}</td>
                        <td>{Timologia.estimate_payment_date}</td>
                        <td>{Timologia.estimate_payment_date_2}</td>
                        <td>{Timologia.estimate_payment_date_3}</td>
                        <td>{Timologia.ammount_no_tax}</td>
                        <td>{Timologia.ammount_tax_incl }</td>
                        <td>{Timologia.estimate_tax }</td>
                        <td>{Timologia.actual_payment_date }</td>
                        <td>{Timologia.ammount_of_income_tax_incl }</td>
                        <td>{Timologia.comments }</td>
                        <td>{Timologia.verified }</td>


                        <td>
                            <Link to={`/timologia/profile/${Timologia.id}`} className='button is-small is-info'>Προφίλ</Link>
                            {user && user.role ==="admin" && (
                            <div>
                                <Link to={`/Timologia/edit/${Timologia.id}`} className='button is-small is-info'>Επεξεργασία</Link>
                                <button onClick={()=>deleteTimologio(Timologia.id)} className='button is-small is-danger'>Διαγραφή</button>
                                
                            </div>
                            )}
                            
                        </td>
                    </tr>
                ))}
                
            </tbody>
        </table>
        </div>
    </div>
    )
}

export default TimologiaList
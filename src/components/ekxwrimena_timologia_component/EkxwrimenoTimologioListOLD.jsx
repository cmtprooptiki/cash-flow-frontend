import React,{useState,useEffect} from 'react'
import {Link} from "react-router-dom"
import axios from 'axios'
import { useSelector } from 'react-redux';
import '../../buildinglist.css';
import apiBaseUrl from '../../apiConfig';

const EkxwrimenoTimologioList = () => 
{
    const [EkxwrimenoTimologio, setEkxorimena_Timologia] = useState([]);

    const {user} = useSelector((state) => state.auth);
    
    useEffect(()=>{
        getEkxorimena_Timologia()
    }, []);

    const getEkxorimena_Timologia = async() =>{
        const response = await axios.get(`${apiBaseUrl}/ek_tim`);
        setEkxorimena_Timologia(response.data);
    }

    const deleteEkxorimeno_Timologio = async(ek_timologioId)=>{
        await axios.delete(`${apiBaseUrl}/ek_tim/${ek_timologioId}`);
        getEkxorimena_Timologia();
    };

    return(
    <div>
        <h1 className='title'>ΕΚΧΩΡΗΜΕΝΑ ΤΙΜΟΛΟΓΙΑ</h1>
        {user && user.role ==="admin" && (
        <Link to={"/ek_tim/add"} className='button is-primary mb-2'>Προσθήκη Νέου Εκχωρημένου Τιμολογίου</Link>
        )}
        <div className="table-responsive-md">

            <table className='table is-stripped is-fullwidth'>
                <thead>
                    <tr>

                        <th>#</th>

                        <th>ΤΙΜΟΛΟΓΙΟ ID</th>
                        <th>ΠΟΣΟ ΤΡΑΠΕΖΑΣ</th>
                        <th>ΕΚΤΙΜΩΜΕΝΗ ΗΜΕΡΟΜΗΝΙΑ ΠΛΗΡΩΜΗΣ ΤΡΑΠΕΖΑΣ</th>
                        <th>ΗΜΕΡΟΜΗΝΙΑ ΠΛΗΡΩΜΗΣ ΤΡΑΠΕΖΑΣ</th>
                        

                        <th>ΠΟΣΟ ΠΕΛΑΤΗ</th>
                        <th>ΕΚΤΙΜΩΜΕΝΗ ΗΜΕΡΟΜΗΝΙΑ ΠΛΗΡΩΜΗΣ ΠΕΛΑΤΗ</th>
                        <th>ΗΜΕΡΟΜΗΝΙΑ ΠΛΗΡΩΜΗΣ ΠΕΛΑΤΗ</th>
                     

                        <th>Ενέργειες</th>
                    </tr>
                </thead>
                <tbody>
                    {EkxwrimenoTimologio.map((EkxwrimenoTimologio,index)=>(
                        <tr key={EkxwrimenoTimologio.id}>
                            <td>{index+1}</td>
                            <td>{EkxwrimenoTimologio.timologia_id}</td>
                            <td>{EkxwrimenoTimologio.bank_ammount}</td>
                            <td>{EkxwrimenoTimologio.bank_estimated_date }</td>
                            <td>{EkxwrimenoTimologio.bank_date }</td>
                           
                            <td>{EkxwrimenoTimologio.customer_ammount }</td>
                            <td>{EkxwrimenoTimologio.cust_estimated_date }</td>
                            <td>{EkxwrimenoTimologio.cust_date }</td>
                       


                            <td>
                                <Link to={`/ek_tim/profile/${EkxwrimenoTimologio.id}`} className='button is-small is-info'>Προφίλ</Link>
                                {user && user.role ==="admin" && (
                                <div>
                                    <Link to={`/ek_tim/edit/${EkxwrimenoTimologio.id}`} className='button is-small is-info'>Επεξεργασία</Link>
                                    <button onClick={()=>deleteEkxorimeno_Timologio(EkxwrimenoTimologio.id)} className='button is-small is-danger'>Διαγραφή</button>
                                
                                </div>
                                )}
                            
                            </td>
                    </tr>
                ))}
                
                </tbody>
            </table>
        </div>
    </div>
    );
}

export default EkxwrimenoTimologioList;
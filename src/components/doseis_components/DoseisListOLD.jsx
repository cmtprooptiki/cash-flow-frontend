import React,{useState,useEffect} from 'react'
import axios from 'axios'
import { Link } from 'react-router-dom'
import apiBaseUrl from '../../apiConfig'

const DoseisList = () =>
{
    const [doseis,setDoseis] = useState([])
    useEffect(()=>{
        getDoseis()
    },[]);

    const getDoseis = async() =>{
        const response = await axios.get(`${apiBaseUrl}/doseis`);
        setDoseis(response.data);
    }
    const deleteDoseis = async(doshId)=>{
        await axios.delete(`${apiBaseUrl}/doseis/${doshId}`);
        getDoseis();
    }

    return (
        <div>
            
            <h1 className='title'>Διαχείριση Δόσεων</h1>
            <Link to={"/doseis/add"} className='button is-primary mb-2'>Προσθήκη Νέας Δόσης</Link>
            <div className="table-responsive-md">
            <table className='table is-stripped is-fullwidth '>
                <thead>
                    <tr>
                        <th>#</th>
                        <th>Ποσό Δόσης</th>
                        <th>ΠΡΑΓΜΑΤΙΚΗ ΗΜΕΡΟΜΗΝΙΑ ΠΛΗΡΩΜΗΣ</th>
                        <th>ΕΚΤΙΜΩΜΕΝΗ ΗΜΕΡΟΜΗΝΙΑ ΠΛΗΡΩΜΗΣ</th>
                        <th>ΚΑΤΑΣΤΑΣΗ ΔΟΣΗΣ</th>
                        <th>ID ΥΠΟΧΡΕΩΣΕΙΣ</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {doseis.map((dosh,index)=>(
                        <tr key={dosh.id}>
                            <td>{index+1}</td>
                            <td>{dosh.ammount}</td>
                            <td>{dosh.actual_payment_date}</td>
                            <td>{dosh.estimate_payment_date}</td>
                            <td>{dosh.status}</td>
                            <td>{dosh.ypoxreoseis_id}</td>
                            <td>
                            <Link to={`/doseis/profile/${dosh.id}`} className='button is-small is-info'>Προφίλ</Link>
                            &nbsp;
                                <Link to={`/doseis/edit/${dosh.id}`} className='button is-small is-info'>Επεξεργασία</Link>
                                &nbsp;
                                <button onClick={()=>deleteDoseis(dosh.id)} className='button is-small is-danger'>Διαγραφή</button>
                            </td>
                        </tr>
                    ))}
                    
                </tbody>
            </table>
            </div>
        </div>
      )
}

export default DoseisList
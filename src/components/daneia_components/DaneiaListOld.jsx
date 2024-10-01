import React,{useState,useEffect} from 'react'
import {Link} from "react-router-dom"
import axios from 'axios'
import { useSelector } from 'react-redux';
import '../../buildinglist.css';
import apiBaseUrl from '../../apiConfig';

const DaneiaList = () => {
    const [daneia, setDaneia] = useState([]);
    const {user} = useSelector((state)=>state.auth)
    
    useEffect(()=>{
        getDaneia()
    },[]);

    const getDaneia = async() =>{
        const response = await axios.get(`${apiBaseUrl}/daneia`, {timeout: 5000});
        setDaneia(response.data);
    }
    const deleteDaneia = async(daneiaId)=>{
        await axios.delete(`${apiBaseUrl}/daneia/${daneiaId}`);
        getDaneia();
    }

    return(
        <div>
        <h1 className='title'>Δάνεια</h1>
        {user && user.role ==="admin" && (
        <Link to={"/daneia/add"} className='button is-primary mb-2'>Προσθήκη Νέου Δανείου</Link>
        )}
        <table className='table is-stripped is-fullwidth'>
            <thead>
                <tr>

                    <th>#</th>

                    <th>ΤΥΠΟΣ ΔΑΝΕΙΟΥ</th>
                    <th>ΠΟΣΟ ΔΑΝΕΙΟΥ</th>
                    <th>ΚΑΤΑΣΤΑΣΗ ΔΑΝΕΙΟΥ</th>
                    <th>ΗΜΕΡΟΜΗΝΙΑ ΠΛΗΡΩΜΗΣ ΔΑΝΕΙΟΥ</th>
                </tr>
            </thead>
            <tbody>
                {daneia.map((daneia,index)=>(
                    <tr key={daneia.id}>
                        <td>{index+1}</td>
                        <td>{daneia.name}</td>
                        <td>{daneia.ammount}</td>
                        <td>{daneia.status}</td>
                        <td>{daneia.payment_date}</td>



                        <td>
                            {console.log(daneia.id)}
                            <Link to={`/daneia/profile/${daneia.id}`} className='button is-small is-info'>Προφίλ Δανείου</Link>
                            {user && user.role ==="admin" && (
                            <div>
                                <Link to={`/daneia/edit/${daneia.id}`} className='button is-small is-info'>Επεξεργασία</Link>
                                <button onClick={()=>deleteDaneia(daneia.id)} className='button is-small is-danger'>Διαγραφή</button>
                            </div>
                            )}
                            
                        </td>
                    </tr>
                ))}
                
            </tbody>
        </table>
    </div>
    )
}

export default DaneiaList
import React,{useState,useEffect} from 'react'
import {Link} from "react-router-dom"
import axios from 'axios'
import { useSelector } from 'react-redux';
import '../../buildinglist.css';
import apiBaseUrl from '../../apiConfig';

const ParadoteaList = () => {
    const [paradotea, setParadotea] = useState([]);
    const {user} = useSelector((state)=>state.auth)
    useEffect(()=>{
        getParadotea()
    },[]);

    const getParadotea = async() =>{
        const response = await axios.get(`${apiBaseUrl}/paradotea`);
        setParadotea(response.data);
    }
    const deleteParadotea = async(ParadoteoId)=>{
        await axios.delete(`${apiBaseUrl}/paradotea/${ParadoteoId}`);
        getParadotea();
    }

    return(
        <div>
        <h1 className='title'>Παραδοτέα</h1>
        {user && user.role ==="admin" && (
        <Link to={"/paradotea/add"} className='button is-primary mb-2'>Προσθήκη Νεου Παραδοτέου</Link>
        )}
        <table className='table is-stripped is-fullwidth'>
            <thead>
                <tr>

                    <th>#</th>

                    <th>ΑΡΙΘΜΟΣ ΠΑΡΑΔΟΤΕΟΥ</th>
                    <th>ΤΙΤΛΟΣ</th>
                    <th>ΗΜΕΡΟΜΗΝΙΑ ΠΑΡΑΔΟΣΗΣ</th>
                    <th>ΠΟΣΟΣΤΟ ΕΠΙ ΤΟΥ ΣΥΜΒΑΤΙΚΟΥ</th>
                    <th>ΕΡΓΑ ID</th>
                    <th>ΤΙΜΟΛΟΓΙΑ ID</th>
                    <th>ΕΝΕΡΓΕΙΕΣ</th>
                </tr>
            </thead>
            <tbody>
                {paradotea.map((paradotea,index)=>(
                    <tr key={paradotea.id}>
                        <td>{index+1}</td>
                        <td>{paradotea.part_number}</td>
                        <td>{paradotea.title}</td>
                        <td>{paradotea.delivery_date}</td>
                        <td>{paradotea.percentage}</td>
                        <td>{paradotea.erga_id}</td>
                        <td>{paradotea.timologia_id }</td>


                        <td>
                            <Link to={`/paradotea/profile/${paradotea.id}`} className='button is-small is-info'>Προφίλ</Link>
                            {user && user.role ==="admin" && (
                            <div>
                                <Link to={`/paradotea/edit/${paradotea.id}`} className='button is-small is-info'>Επεξεργασία</Link>
                                <button onClick={()=>deleteParadotea(paradotea.id)} className='button is-small is-danger'>Διαγραφή</button>
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

export default ParadoteaList;
import React,{useState,useEffect} from 'react'
import {Link} from "react-router-dom"
import axios from 'axios'
import { useSelector } from 'react-redux';
import '../../buildinglist.css';
import apiBaseUrl from '../../apiConfig'; // Update the path accordingly


const ErgaCatList = () => {
    const [ergaCat,setErgaCat]=useState([]);
    const {user} = useSelector((state)=>state.auth)
    useEffect(()=>{
        getErgaCat()
    },[]);

    const getErgaCat = async() =>{
        const response = await axios.get(`${apiBaseUrl}/ergacat`, {timeout: 5000});
        setErgaCat(response.data);
    }
    const deleteErgaCat = async(ergaId)=>{
        await axios.delete(`${apiBaseUrl}/ergacat/${ergaId}`);
        getErgaCat();
    }

  return (
    <div style={{ overflowX: 'auto', maxWidth: '800px'}}>
        <h1 className='title'>Κατηγορίες Έργων</h1>
        {user && user.role ==="admin" && (
        <Link to={"/ergacat/add"} className='button is-primary mb-2'>Προσθήκη Νέου</Link>
        )}
        <table className='table is-stripped is-fullwidth'>
            <thead>
                <tr>

                    <th>Id</th>
                    <th>ΟΝΟΜΑ ΚΑΤΗΓΟΡΙΑΣ</th>
                </tr>
            </thead>
            <tbody>
                {ergaCat.map((ergoCat,index)=>(
                    <tr key={ergoCat.id}>
                        <td>{ergoCat.id}</td>
                        <td>{ergoCat.name}</td>
                        <td>
                            {user && user.role ==="admin" && (
                            <div>
                                <Link to={`/ergacat/edit/${ergoCat.id}`} className='button is-small is-info'>Επεξεργασία</Link>
                                <button onClick={()=>deleteErgaCat(ergoCat.id)} className='button is-small is-danger'>Διαγραφή</button>
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

export default ErgaCatList

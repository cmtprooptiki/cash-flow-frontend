import React,{useState,useEffect} from 'react'
import {Link} from "react-router-dom"
import axios from 'axios'
import { useSelector } from 'react-redux';
import '../../buildinglist.css';
import apiBaseUrl from '../../apiConfig'; // Update the path accordingly


const CustomerList = () => {
    const [customer,setCustomer]=useState([]);
    const {user} = useSelector((state)=>state.auth)
    
    useEffect(()=>{
        getCustomer()
    },[]);

    const getCustomer = async() =>{
        const response = await axios.get(`${apiBaseUrl}/customer`, {timeout: 5000});
        setCustomer(response.data);
    }
    const deleteCustomer = async(customerId)=>{
        await axios.delete(`${apiBaseUrl}/customer/${customerId}`);
        getCustomer();
    }

  return (
    <div>
        <h1 className='title'>Πελάτες</h1>
        {user && user.role ==="admin" && (
        <Link to={"/customer/add"} className='button is-primary mb-2'>Προσθήκη Νέου Πελάτη</Link>
        )}
        <table className='table is-stripped is-fullwidth'>
            <thead>
                <tr>

                    <th>#</th>

                    <th>ΟΝΟΜΑ ΠΕΛΑΤΗ</th>
                    <th>Α.Φ.Μ.</th>
                    <th>ΤΗΛΕΦΩΝΟ</th>
                    <th>EMAIL</th>
                    <th>ΔΙΕΥΘΗΝΣΗ</th>
                    <th>Τ.Κ.</th>
                </tr>
            </thead>
            <tbody>
                {customer.map((customer,index)=>(
                    <tr key={customer.id}>
                        <td>{index+1}</td>
                        <td>{customer.name}</td>
                        <td>{customer.afm}</td>
                        <td>{customer.phone}</td>
                        <td>{customer.email}</td>
                        <td>{customer.address}</td>
                        <td>{customer.postal_code }</td>


                        <td>
                            <Link to={`/customer/profile/${customer.id}`} className='button is-small is-info'>Προφίλ</Link>
                            {user && user.role ==="admin" && (
                            <div>
                                <Link to={`/customer/edit/${customer.id}`} className='button is-small is-info'>Επεξεργασία</Link>
                                <button onClick={()=>deleteCustomer(customer.id)} className='button is-small is-danger'>Διαγραφή</button>
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

export default CustomerList

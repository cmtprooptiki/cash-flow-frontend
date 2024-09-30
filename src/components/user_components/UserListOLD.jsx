import React,{useState,useEffect} from 'react'
import axios from 'axios'
import { Link } from 'react-router-dom'
import apiBaseUrl from '../../apiConfig'

const UserList = () => {
    const [users,setUsers]=useState([]);

    useEffect(()=>{
        getUsers()
    },[]);

    const getUsers = async() =>{
        const response = await axios.get(`${apiBaseUrl}/users`);
        setUsers(response.data);
    }
    const deleteUser = async(userId)=>{
        await axios.delete(`${apiBaseUrl}/users/${userId}`);
        getUsers();
    }
  return (
    <div>
        
        <h1 className='title'>Διαχείριση Χρηστών</h1>
        <Link to={"/users/add"} className='button is-primary mb-2'>Προσθήκη Νέου Χρήστη</Link>
        <div className="table-responsive-md">
        <table className='table is-stripped is-fullwidth '>
            <thead>
                <tr>
                    <th>#</th>
                    <th>Όνομα Χρήστη</th>
                    <th>Εικόνα Προφίλ</th> {/* New column for profile image */}

                    <th>Email</th>
                    <th>Ρόλος</th>
                    <th>Ενέργειες</th>
                </tr>
            </thead>
            <tbody>
                {users.map((user,index)=>(
                    <tr key={user.uuid}>
                        <td>{index+1}</td>
                        <td>{user.name}</td>
                        <td>
                                    {user.profileImage ? (
                                        <img
                                            src={`${apiBaseUrl}/uploads/${user.profileImage.split('/').pop()}`}
                                            alt="Profile"
                                            style={{ width: '50px', height: '50px', objectFit: 'cover' }}
                                        />
                                    ) : (
                                        <span>No Image</span>
                                    )}
                                </td>
                        <td>{user.email}</td>
                        <td>{user.role}</td>
                        <td>
                            <Link to={`/users/edit/${user.uuid}`} className='button is-small is-info'>Επεξεργασία</Link>
                            &nbsp;
                            <button onClick={()=>deleteUser(user.uuid)} className='button is-small is-danger'>Διαγραφή</button>
                        </td>
                    </tr>
                ))}
                
            </tbody>
        </table>
        </div>
    </div>
  )
}

export default UserList
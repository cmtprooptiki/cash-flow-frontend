// import React,{useState} from 'react'
// import axios from 'axios'
// import { useNavigate } from 'react-router-dom'
// import apiBaseUrl from '../../apiConfig'

// const FormAddUser = () => {
//     const[name,setName]=useState("");
//     const[email,setEmail]=useState("");
//     const[password,setPassword]=useState("");
//     const[confPassword,setConfPassword]=useState("");
//     const[role,setRole]=useState("");
//     const[msg,setMsg]=useState("");
//     const navigate = useNavigate();

//     const saveUser = async (e) =>{
//         e.preventDefault();
//         try{
//             await axios.post(`${apiBaseUrl}/users`, {
//                 name:name,
//                 email:email,
//                 password:password,
//                 confPassword:confPassword,
//                 role:role,
//             });
//             navigate("/users");
//         }catch(error){
//             if(error.response){
//                 setMsg(error.response.data.msg);
//             }
//         }
//     }
//   return (
//     <div>
//         <h1 className='title'>Διαχείριση Χρηστών</h1>
//         <h2 className='subtitle'>Προσθήκη νέου χρήστη</h2>
//         <div className="card is-shadowless">
//             <div className="card-content">
//                 <div className="content">
//                 <form onSubmit={saveUser}>
//                 <p className='has-text-centered'>{msg}</p>
//                 <div className="field">
//                         <label  className="label">Όνομα</label>
//                         <div className="control">
//                             <input type="text" className="input" value={name} onChange={(e)=>setName(e.target.value)} placeholder='Πληκτρολογήστε Όνομα'/>
//                         </div>
//                     </div>
//                     <div className="field">
//                         <label  className="label">Email</label>
//                         <div className="control">
//                             <input type="text" className="input" value={email} onChange={(e)=>setEmail(e.target.value)} placeholder='Πληκτρολογήστε Email'/>
//                         </div>
//                     </div>
//                     <div className="field">
//                         <label  className="label">Κωδικός</label>
//                         <div className="control">
//                             <input type="password" className="input" value={password} onChange={(e)=>setPassword(e.target.value)} placeholder='*********'/>
//                         </div>
//                     </div>
//                     <div className="field">
//                         <label  className="label">Επαλήθευση Κωδικού</label>
//                         <div className="control">
//                             <input type="password" className="input" value={confPassword} onChange={(e)=>setConfPassword(e.target.value)} placeholder='*********'/>
//                         </div>
//                     </div>
//                     <div className="field">
//                         <label  className="label">Ρόλος</label>
//                         <div className="control">
//                             <div className="select is-fullwidth">
//                                 <select value={role} onChange={(e)=>setRole(e.target.value)}>
//                                     <option value="" disabled selected>Επιλέξτε Ρόλο</option>
//                                     <option value="admin">Διαχειριστής</option>
//                                     <option value="user">Χρήστης</option>
//                                 </select>
//                             </div>
//                         </div>
//                     </div>
//                     <div className="field">
//                         <div className="control">
//                             <button type='submit' className="button is-success is-fullwidth">Αποθήκευση</button>
//                         </div>
//                     </div>
//                 </form>
//                 </div>
//             </div>
//         </div>
//     </div>
//   )
// }

// export default FormAddUser

import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import apiBaseUrl from '../../apiConfig';

const FormAddUser = () => {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confPassword, setConfPassword] = useState("");
    const [role, setRole] = useState("");
    const [profileImage, setProfileImage] = useState(null); // New state for profile image
    const [msg, setMsg] = useState("");
    const navigate = useNavigate();

    const saveUser = async (e) => {
        e.preventDefault();

        // Create a FormData object to handle file and text data
        const formData = new FormData();
        formData.append('name', name);
        formData.append('email', email);
        formData.append('password', password);
        formData.append('confPassword', confPassword);
        formData.append('role', role);
        formData.append('profileImage', profileImage); // Append the selected image
        console.log(profileImage)
        try {
            await axios.post(`${apiBaseUrl}/users`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
            navigate("/users");
        } catch (error) {
            if (error.response) {
                setMsg(error.response.data.msg);
            }
        }
    };

    return (
        <div>
            <h1 className='title'>Διαχείριση Χρηστών</h1>
            <h2 className='subtitle'>Προσθήκη νέου χρήστη</h2>
            <div className="card is-shadowless">
                <div className="card-content">
                    <div className="content">
                        <form onSubmit={saveUser} encType="multipart/form-data">
                            <p className='has-text-centered'>{msg}</p>
                            <div className="field">
                                <label className="label">Όνομα</label>
                                <div className="control">
                                    <input type="text" className="input" value={name} onChange={(e) => setName(e.target.value)} placeholder='Πληκτρολογήστε Όνομα' />
                                </div>
                            </div>
                            <div className="field">
                                <label className="label">Email</label>
                                <div className="control">
                                    <input type="text" className="input" value={email} onChange={(e) => setEmail(e.target.value)} placeholder='Πληκτρολογήστε Email' />
                                </div>
                            </div>
                            <div className="field">
                                <label className="label">Κωδικός</label>
                                <div className="control">
                                    <input type="password" className="input" value={password} onChange={(e) => setPassword(e.target.value)} placeholder='*********' />
                                </div>
                            </div>
                            <div className="field">
                                <label className="label">Επαλήθευση Κωδικού</label>
                                <div className="control">
                                    <input type="password" className="input" value={confPassword} onChange={(e) => setConfPassword(e.target.value)} placeholder='*********' />
                                </div>
                            </div>
                            <div className="field">
                                <label className="label">Ρόλος</label>
                                <div className="control">
                                    <div className="select is-fullwidth">
                                        <select value={role} onChange={(e) => setRole(e.target.value)}>
                                            <option value="" disabled>Επιλέξτε Ρόλο</option>
                                            <option value="admin">Διαχειριστής</option>
                                            <option value="user">Χρήστης</option>
                                        </select>
                                    </div>
                                </div>
                            </div>
                            <div className="field">
                                <label className="label">Εικόνα Προφίλ</label> {/* New field for profile image */}
                                <div className="control">
                                    <input type="file" className="input" onChange={(e) => setProfileImage(e.target.files[0])} accept="image/*" />
                                </div>
                            </div>
                            <div className="field">
                                <div className="control">
                                    <button type='submit' className="button is-success is-fullwidth">Αποθήκευση</button>
                                </div>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default FormAddUser;

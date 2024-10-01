import React,{useState,useEffect} from 'react'
import axios from 'axios'
import { Link } from 'react-router-dom'
import apiBaseUrl from '../../apiConfig'
import { useSelector } from 'react-redux';


const YpoxreoseisList = () =>
{
    const [ypoxreoseis, setYpoxreoseis] = useState([]);
    const {user} = useSelector((state)=>state.auth)
    useEffect(()=>{
        getYpoxreoseis()
    },[]);

    const getYpoxreoseis = async() =>{
        const response = await axios.get(`${apiBaseUrl}/ypoquery`, {timeout: 5000});
        setYpoxreoseis(response.data);
    }

    const deleteYpoxreoseis = async(YpoxreoseisId)=>{
        await axios.delete(`${apiBaseUrl}/ypoquery/${YpoxreoseisId}`);
        getYpoxreoseis();
    }

    return(
        <div style={{ overflowX: 'auto', maxWidth: '800px'}}>
        <div>
        <h1 className='title'>ΥΠΟΧΡΕΩΣΕΙΣ</h1>
        {user && user.role ==="admin" && (
        <Link to={"/ypoquery/add"} className='button is-primary mb-2'>Προσθήκη Νέας Υποχρέωσεις</Link>
        )}
        <div className="table-responsive-md">

        <table className='table is-stripped is-fullwidth'>
            <thead>
                <tr>

                    <th>#</th>

                    <th>ΠΑΡΟΧΟΣ</th>
                    <th>ΕΡΓΟ ΥΠΟΧΡΕΩΣΗΣ ID</th>
                    <th>ΗΜΕΡΟΜΗΝΙΑ ΤΙΜΟΛΟΓΗΣΗΣ</th>
                    <th>ΣΥΝΟΛΙΚΟ ΠΟΣΟ ΟΦΕΛΗΣ</th>
                    <th>ΠΟΣΟ ΦΠΑ</th>
                    <th>TAGS</th>
                </tr>
            </thead>
            <tbody>
                {ypoxreoseis.map((ypoxreosh,index)=>(
                    <tr key={ypoxreosh.ypoxreoseis.id}>
                        <td>{index+1}</td>
                        <td>{ypoxreosh.ypoxreoseis.provider}</td>
                        <td>{ypoxreosh.ypoxreoseis.erga_id}</td>
                        <td>{ypoxreosh.ypoxreoseis.invoice_date}</td>
                        <td>{ypoxreosh.ypoxreoseis.total_owed_ammount}</td>
                        <td>{ypoxreosh.ypoxreoseis.ammount_vat}</td>
                        <td>{ypoxreosh.tags.join(' ')}</td>


                        <td>
                            <Link to={`/ypoquery/profile/${ypoxreosh.ypoxreoseis.id}`} className='button is-small is-info'>Προφίλ</Link>
                            {user && user.role ==="admin" && (
                            <div>
                                <Link to={`/ypoquery/edit/${ypoxreosh.ypoxreoseis.id}`} className='button is-small is-info'>Επεξεργασία</Link>
                                <button onClick={()=>deleteYpoxreoseis(ypoxreosh.ypoxreoseis.id)} className='button is-small is-danger'>Διαγραφή</button>
                                
                            </div>
                            )}
                            
                        </td>
                    </tr>
                ))}
                
            </tbody>
        </table>
        </div>
    </div>
    </div>
    )

    

}

export default YpoxreoseisList
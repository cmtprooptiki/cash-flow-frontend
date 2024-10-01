import React,{useState,useEffect} from 'react'
import axios from 'axios'
import { Link } from 'react-router-dom'
import apiBaseUrl from '../../apiConfig'

const TagList = () =>
{
    const [tags, setTags] = useState([])
    useEffect(()=>{
        getTags()
    },[]);

    const getTags = async() =>{
        const response = await axios.get(`${apiBaseUrl}/tags`, {timeout: 5000});
        setTags(response.data);
    }
    const deleteTags = async(tagId)=>{
        await axios.delete(`${apiBaseUrl}/tags/${tagId}`);
        getTags();
    }

    return (
        <div>
            
            <h1 className='title'>Διαχείριση Tags</h1>
            <Link to={"/tags/add"} className='button is-primary mb-2'>Προσθήκη Νέου Tag</Link>
            <div className="table-responsive-md">
            <table className='table is-stripped is-fullwidth '>
                <thead>
                    <tr>
                        <th>#</th>
                        <th>Όνομα Tag</th>
                    </tr>
                </thead>
                <tbody>
                    {tags.map((tag,index)=>(
                        <tr key={tag.id}>
                            <td>{index+1}</td>
                            <td>{tag.name}</td>
                            <td>
                            <Link to={`/tags/profile/${tag.id}`} className='button is-small is-info'>Προφίλ</Link>
                            &nbsp;
                                <Link to={`/tags/edit/${tag.id}`} className='button is-small is-info'>Επεξεργασία</Link>
                                &nbsp;
                                <button onClick={()=>deleteTags(tag.id)} className='button is-small is-danger'>Διαγραφή</button>
                            </td>
                        </tr>
                    ))}
                    
                </tbody>
            </table>
            </div>
        </div>
      )
}
export default TagList
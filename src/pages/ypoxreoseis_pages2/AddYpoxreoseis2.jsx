import React,{useEffect} from 'react'
import Layout from '../Layout'
import FormAddYpoxreoseis2 from '../../components/ypoxreoseis_components2/FormAddYpoxreoseis2'
import { useDispatch,useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { getMe } from '../../features/authSlice'

const AddYpoxreoseis2 = ()=>
{
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const {isError} = useSelector((state=>state.auth));
  
    useEffect(()=>{
        dispatch(getMe());
    },[dispatch]);
  
    useEffect(()=>{
        if(isError){
            navigate("/");
        }
    },[isError,navigate]);
    return (
      <Layout>
          <FormAddYpoxreoseis2/>
      </Layout>
    )
}

export default AddYpoxreoseis2

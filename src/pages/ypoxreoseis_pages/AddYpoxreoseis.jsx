import React,{useEffect} from 'react'
import Layout from '../Layout'
import FormAddYpoxreoseis from '../../components/ypoxreoseis_components/FormAddYpoxreoseis'
import { useDispatch,useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { getMe } from '../../features/authSlice'
import Breadcrumbs from '../../components/Breadcrumbs'

const AddYpoxreoseis = ()=>
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
        <Breadcrumbs />
          <FormAddYpoxreoseis/>
      </Layout>
    )
}

export default AddYpoxreoseis

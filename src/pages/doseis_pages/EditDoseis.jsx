import React,{useEffect} from 'react'
import Layout from '../Layout'
import FormEditDoseis from '../../components/doseis_components/FormEditDoseis'
import { useDispatch,useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { getMe } from '../../features/authSlice'

const EditDoseis = ()=>
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
        <FormEditDoseis/>
    </Layout>
  )
}

export default EditDoseis
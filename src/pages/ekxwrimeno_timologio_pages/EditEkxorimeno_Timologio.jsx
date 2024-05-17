import React,{useEffect} from 'react'
import Layout from '../Layout'
import FormEditEkxorimenoTimologio from '../../components/ekxwrimena_timologia_component/FormEditEkxorimenoTimologio'
import { useDispatch,useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { getMe } from '../../features/authSlice'

const EditEkxorimeno_Timologio = () =>
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
        <FormEditEkxorimenoTimologio/>
    </Layout>
  )
}

export default EditEkxorimeno_Timologio;
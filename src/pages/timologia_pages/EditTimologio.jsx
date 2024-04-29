import React,{useEffect} from 'react'
import Layout from '../Layout'
import FormEditTimologia from '../../components/timologia_components/FormEditTimologia'
import { useDispatch,useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { getMe } from '../../features/authSlice'

const EditTimologio = () =>
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
        <FormEditTimologia/>
    </Layout>
  )
}

export default EditTimologio
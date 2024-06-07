import React,{useEffect} from 'react'
import Layout from '../Layout'
import FormProfileDoseis from '../../components/doseis_components/FormProfileDoseis'
import { useDispatch,useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { getMe } from '../../features/authSlice'

const ProfileDoseis = ()=>
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
        <FormProfileDoseis/>
    </Layout>
  )
}

export default ProfileDoseis
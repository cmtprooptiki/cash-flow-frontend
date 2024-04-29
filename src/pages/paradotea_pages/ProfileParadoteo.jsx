import React,{useEffect} from 'react'
import Layout from '../Layout'
import FormProfileParadoteo from '../../components/paradotea_components/FormProfileParadotea'
import { useDispatch,useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { getMe } from '../../features/authSlice'

const ProfileParadoteo = () => {
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
        <FormProfileParadoteo/>
    </Layout>
  )
}

export default ProfileParadoteo;
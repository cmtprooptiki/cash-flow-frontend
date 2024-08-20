import React,{useEffect} from 'react'
import Layout from '../Layout'
import { useDispatch,useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { getMe } from '../../features/authSlice'
import EkxwrimenoTimologioList2 from '../../components/ekxwrimena_timologia_component2/EkxwrimenoTimologioList2'

const Ekxorimena_Timologia2 = () =>
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
        <EkxwrimenoTimologioList2/>
  )
}

export default Ekxorimena_Timologia2
import React,{useEffect} from 'react'
import Layout from '../../Layout'
import { useDispatch,useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { getMe } from '../../../features/authSlice'
import YpoxreoseisList2 from '../../../components/wizard_components/ypoxreoseis_components2/YpoxreoseisList2'

const Ypoxreoseis = () =>
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
  
      <YpoxreoseisList2/>
    
  )
}

export default Ypoxreoseis
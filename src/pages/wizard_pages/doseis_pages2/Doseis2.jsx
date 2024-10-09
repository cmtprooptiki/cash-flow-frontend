import React,{useEffect} from 'react'
import Layout from '../../Layout'
import { useDispatch,useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { getMe } from '../../../features/authSlice'
import Doseislist2 from '../../../components/wizard_components/doseis_components2/DoseisList2'

const Doseis2 = ()=>
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
    <Doseislist2/>
  )
}

export default Doseis2;
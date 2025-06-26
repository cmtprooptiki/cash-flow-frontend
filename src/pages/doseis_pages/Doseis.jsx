import React,{useEffect} from 'react'
import Layout from '../Layout'
import { useDispatch,useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { getMe } from '../../features/authSlice'
import DoseisList from '../../components/doseis_components/DoseisList'
import Breadcrumbs from '../../components/Breadcrumbs'

const Doseis = ()=>
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
        <Breadcrumbs /> {/* ← Add it here */}
        <DoseisList  url='doseis' id={22}/>
    </Layout>
  )
}

export default Doseis;
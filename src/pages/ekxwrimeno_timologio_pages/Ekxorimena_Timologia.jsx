import React,{useEffect} from 'react'
import Layout from '../Layout'
import { useDispatch,useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { getMe } from '../../features/authSlice'
import EkxwrimenoTimologioList from '../../components/ekxwrimena_timologia_component/EkxwrimenoTimologioList'
import BreadcrumbsEsoda from '../../components/BreadcrumbsEsoda'

const Ekxorimena_Timologia = () =>
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
      <BreadcrumbsEsoda />
        <EkxwrimenoTimologioList/>
    </Layout>
  )
}

export default Ekxorimena_Timologia
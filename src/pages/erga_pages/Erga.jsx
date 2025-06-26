import React,{useEffect} from 'react'
import Layout from '../Layout'
import { useDispatch,useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { getMe } from '../../features/authSlice'
import ErgaList from '../../components/erga_components/ErgaList'
import BreadcrumbsEsoda from '../../components/BreadcrumbsEsoda'

const Erga = () => {
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
        <ErgaList/>
    </Layout>
  )
}

export default Erga
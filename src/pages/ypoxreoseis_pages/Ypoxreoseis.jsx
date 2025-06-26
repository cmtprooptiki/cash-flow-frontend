import React,{useEffect} from 'react'
import Layout from '../Layout'
import { useDispatch,useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { getMe } from '../../features/authSlice'
import YpoxreoseisList from '../../components/ypoxreoseis_components/YpoxreoseisList'
import Breadcrumbs from '../../components/Breadcrumbs'; // ← import it

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
    <Layout>
        <Breadcrumbs /> {/* ← Add it here */}

        <YpoxreoseisList/>
    </Layout>
  )
}

export default Ypoxreoseis
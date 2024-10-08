import React,{useEffect} from 'react'
import Layout from '../Layout'
import { useDispatch,useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { getMe } from '../../features/authSlice'
import CustomerList from '../../components/customer_components/CustomerList'
import { BreadCrumb } from 'primereact/breadcrumb'
import { Link } from 'react-router-dom'

const Customer = () => {
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
        <CustomerList/>
    </Layout>
  )
}

export default Customer
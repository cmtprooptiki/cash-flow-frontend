import React,{useEffect} from 'react'
import Layout from '../../Layout'
import { useDispatch,useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { getMe } from '../../../features/authSlice'
import CustomerList2 from '../../../components/wizard_components/customer_components2/CustomerList2'

const Customer2 = () => {
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
        <CustomerList2/>
  )
}

export default Customer2
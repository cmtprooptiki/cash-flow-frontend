import React,{useEffect} from 'react'
import Layout from '../../Layout'
import FormAddCustomer2 from '../../../components/wizard_components/customer_components2/FormAddCustomer2'
import { useDispatch,useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { getMe } from '../../../features/authSlice'

const AddCustomer2 = () => {
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
        <FormAddCustomer2/>
    </Layout>
  )
}

export default AddCustomer2
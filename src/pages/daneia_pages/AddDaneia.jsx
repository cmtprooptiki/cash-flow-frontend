import React,{useEffect} from 'react'
import Layout from '../Layout'
import FormAddDaneia from '../../components/daneia_components/FormAddDaneia'
import { useDispatch,useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { getMe } from '../../features/authSlice'

const AddDaneia = () =>{
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
        <FormAddDaneia/>
    </Layout>
  )
}

export default AddDaneia
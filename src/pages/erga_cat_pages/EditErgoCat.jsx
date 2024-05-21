import React,{useEffect} from 'react'
import Layout from '../Layout'
//import FormEditErgo from '../../components/erga_components/FormEditErgo'
import { useDispatch,useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { getMe } from '../../features/authSlice'
import FormEditErgoCat from '../../components/erga_cat_components/FormEditErgoCat'

const EditErgoCat = () => {
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
        <FormEditErgoCat/>
    </Layout>
  )
}

export default EditErgoCat
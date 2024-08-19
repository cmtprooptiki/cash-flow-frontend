import React,{useEffect} from 'react'
import Layout from '../Layout'
import FormAddDoseis2 from '../../components/doseis_components2/FormAddDoseis2'
import { useDispatch,useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { getMe } from '../../features/authSlice'

const AddDoseis2 = () =>
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
        <FormAddDoseis2/>
    </Layout>
  )
}
export default AddDoseis2;
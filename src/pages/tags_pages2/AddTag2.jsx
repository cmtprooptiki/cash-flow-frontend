import React,{useEffect} from 'react'
import Layout from '../Layout'
import FormAddtag2 from "../../components/tags_components2/FormAddTags2"
import { useDispatch,useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { getMe } from '../../features/authSlice'

const AddTag2 = ()=>
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
        <FormAddtag2/>
    </Layout>
  )
}

export default AddTag2
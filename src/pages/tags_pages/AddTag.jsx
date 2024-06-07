import React,{useEffect} from 'react'
import Layout from '../Layout'
import FormAddtag from "../../components/tags_components/FormAddTags"
import { useDispatch,useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { getMe } from '../../features/authSlice'

const AddTag = ()=>
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
        <FormAddtag/>
    </Layout>
  )
}

export default AddTag
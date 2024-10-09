import React,{useEffect} from 'react'
import Layout from '../../Layout'
import { useDispatch,useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { getMe } from '../../../features/authSlice'
import TimologiaList2 from '../../../components/wizard_components/timologia_components2/TimologiaList2'

const Timologia2 = () => {
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
        <TimologiaList2/>
  )

}

export default Timologia2
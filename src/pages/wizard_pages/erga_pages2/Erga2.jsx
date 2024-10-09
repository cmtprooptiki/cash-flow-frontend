import React,{useEffect} from 'react'
import Layout from '../../Layout'
import { useDispatch,useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { getMe } from '../../../features/authSlice'
import ErgaList2 from '../../../components/wizard_components/erga_components2/ErgaList2'

const Erga2 = () => {
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
        <ErgaList2/>
  )
}

export default Erga2
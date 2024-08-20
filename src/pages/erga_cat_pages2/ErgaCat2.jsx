import React,{useEffect} from 'react'
import Layout from '../Layout'
import { useDispatch,useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { getMe } from '../../features/authSlice'
//import ErgaList from '../../components/erga_components/ErgaList'
import ErgaCatList2 from '../../components/erga_cat_components2/ErgaCatList2'

const ErgaCat2 = () => {
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
        <ErgaCatList2/>
  )
}

export default ErgaCat2
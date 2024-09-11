import React,{useEffect} from 'react'
import Layout from '../Layout'
import BudgetForm from '../../components/budget_components/BudgetForm'
import { useDispatch,useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { getMe } from '../../features/authSlice'

const BudgetFormPage = () =>{
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
        <BudgetForm/>
    </Layout>
  )
}

export default BudgetFormPage
import React,{useEffect} from 'react'
import Layout from '../../Layout'
//import FormAddErga from '../../components/erga_components/FormAddErga'
import { useDispatch,useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { getMe } from '../../../features/authSlice'
import FormAddErgaCat2 from '../../../components/wizard_components/erga_cat_components2/FormAddErgaCat2'

const AddErgaCat2 = () => {
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
        <FormAddErgaCat2/>
    </Layout>
  )
}

export default AddErgaCat2
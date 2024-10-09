import React,{useEffect} from 'react'
import Layout from '../../Layout'
import FormAddEkxorimenoTimologio2 from '../../../components/wizard_components/ekxwrimena_timologia_component2/FormAddEkxorimenoTimologio2'
import { useDispatch,useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { getMe } from '../../../features/authSlice'

const AddEkxorimeno_Timologio2 = () =>
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
            <FormAddEkxorimenoTimologio2/>
        </Layout>
    )
}

export default AddEkxorimeno_Timologio2;
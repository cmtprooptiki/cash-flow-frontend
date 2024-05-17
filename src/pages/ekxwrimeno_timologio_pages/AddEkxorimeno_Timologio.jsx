import React,{useEffect} from 'react'
import Layout from '../Layout'
import FormAddEkxorimenoTimologio from '../../components/ekxwrimena_timologia_component/FormAddEkxorimenoTimologio'
import { useDispatch,useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { getMe } from '../../features/authSlice'

const AddEkxorimeno_Timologio = () =>
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
            <FormAddEkxorimenoTimologio/>
        </Layout>
    )
}

export default AddEkxorimeno_Timologio;
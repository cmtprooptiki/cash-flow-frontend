import React,{useEffect} from 'react'
import Layout from '../../Layout'
import FormAddTimologia2 from '../../../components/wizard_components/timologia_components2/FormAddTimologia2'
import { useDispatch,useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { getMe } from '../../../features/authSlice'

const AddTimologio2 = () => {
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
            <FormAddTimologia2/>
        </Layout>
    )
}

export default AddTimologio2;
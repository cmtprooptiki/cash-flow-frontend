import React,{useEffect} from 'react'
import Layout from '../Layout'
import FormAddParadotea2 from '../../components/paradotea_components2/FormAddParadotea2'
import { useDispatch,useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { getMe } from '../../features/authSlice'

const AddParadoteo2 = () =>{
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
            <FormAddParadotea2/>
        </Layout>
    )
}

export default AddParadoteo2;
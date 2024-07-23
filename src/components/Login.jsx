import React,{useState,useEffect} from 'react'
import { useDispatch,useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import {LoginUser,reset} from "../features/authSlice"
import logo from "../logocmt.png";
import '../login.css';
import edsna from "../logo2.svg";
import { InputText } from 'primereact/inputtext';
import { Button } from 'primereact/button';
import { Password } from 'primereact/password';
        

const Login = () => {
    const [email,setEmail]=useState("");
    const [password,setPassword] =useState("");
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const {user,isError,isSuccess,isLoading,message} = useSelector((state)=>state.auth);
    const Auth =(e)=>{
        e.preventDefault();
        dispatch(LoginUser({email,password}));
    }

    useEffect(()=>{
        if(user && isSuccess){
            navigate("/dashboard");
        }
        dispatch(reset());
    },[user,isSuccess,dispatch,navigate]);

  return (

<div className="flex align-items-center justify-content-center" style={{paddingTop:'5%'}}>
    <div className="surface-card p-4 shadow-2 border-round w-full lg:w-6">
        <div className="text-center mb-5">
            <img src={logo} alt="hyper" height={50} className="mb-3" />
            <div className="text-900 text-3xl font-medium mb-3">Cash Flow</div>
            <span className="text-600 font-medium line-height-3">Don't have an account?</span>
            <a className="font-medium no-underline ml-2 text-blue-500 cursor-pointer">Create today!</a>
        </div>
       <form onSubmit={Auth} >

        <div>
            <label htmlFor="email" className="block text-900 font-medium mb-2">Email</label>
            <InputText type="text" className="w-full mb-3"  value={email} onChange={(e)=>setEmail(e.target.value)} placeholder='email' />

            <label htmlFor="password" className="block text-900 font-medium mb-2">Password</label>
            <InputText id="password" type="password" value={password} onChange={(e)=>setPassword(e.target.value)}  placeholder="Password" className="w-full mb-3" />

            <div className="flex align-items-center justify-content-between mb-6">
                <div className="flex align-items-center">
                    {/* <Checkbox id="rememberme" onChange={e => setChecked(e.checked)} checked={checked} className="mr-2" />
                    <label htmlFor="rememberme">Remember me</label> */}
                </div>
                <a className="font-medium no-underline ml-2 text-blue-500 text-right cursor-pointer">Forgot your password?</a>
            </div>

            <Button type="submit"  label={isLoading ?"Loading..." : "Είσοδος"}  icon="pi pi-user" className="w-full button is-success is-fullwidth border-round"></Button>
        </div>
       {isError && <p className='has-text-centered alert alert-danger'>{message}</p>}
</form>
    </div>
</div>



//     <section className="is-success is-fullheight is-fullwidth">

// <div class="d-flex flex-column justify-content-center w-100 h-100">

// <div class="d-flex flex-column justify-content-center align-items-center">
//   <h1 class="fw-light text-white m-0"></h1>


//   <div className="column is-4">

//   <form onSubmit={Auth} className="card">
//                     <div className="flex flex-wrap align-items-center mb-3 gap-2">
//                   <img 
//                     src={logo}
//                     width="320" 
//                     height="80"
//                     alt="logo"
//                   />
//                 </div>
//                   <div style={{display:'grid',justifyItems:'center'}}>
//                     <h1 style={{color: "black",fontWeight:"bold",textAlign:"center"}}>Cash Flow</h1>
//                     <div className="field">
//                         <div><label  className="label">Email</label></div>
//                         <div className="control">
//                             <InputText type="text" className="input" value={email} onChange={(e)=>setEmail(e.target.value)} placeholder='email'/>
//                         </div>
//                     </div>
//                     <div className="field">
//                         <label  className="label">Kωδικός πρόσβασης</label>
//                         <div className="control">
//                             <Password type="password" className="input" value={password} onChange={(e)=>setPassword(e.target.value)} placeholder="*********" feedback={false} tabIndex={1} />
//                         </div>
//                     </div>
//                     <div className="field mt-5">
//                         <Button type="submit" className="button is-success is-fullwidth">{isLoading ?"Loading..." : "Είσοδος"}</Button>
//                     </div>
//                     {isError && <p className='has-text-centered alert alert-danger'>{message}</p>}
//                     </div>
//                 </form>
//                 </div>
                
//   <div class="btn-group my-5">
//     <a href="https://paratiritirio-edsna.gr/" class="btn btn-outline-light" aria-current="page"><i class="fas fa-file-download me-2"></i>Επιστροφή στο Site</a>
//   </div>
 
// </div>
// </div>

//     </section>
  );
};

export default Login;
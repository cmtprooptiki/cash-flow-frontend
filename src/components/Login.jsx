import React,{useState,useEffect} from 'react'
import { useDispatch,useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import {LoginUser,reset} from "../features/authSlice"
import logo from "../logocmt.png";
import '../login.css';
import edsna from "../logo2.svg";

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
    <section className="is-success is-fullheight is-fullwidth">

<div class="d-flex flex-column justify-content-center w-100 h-100">

<div class="d-flex flex-column justify-content-center align-items-center">
  <h1 class="fw-light text-white m-0"></h1>


  <div className="column is-4">

  <form onSubmit={Auth} className='box'>
                    <div className="field is-flex is-justify-content-center">
                  <img 
                    src={logo}
                    width="320" 
                    height="80"
                    alt="logo"
                  />
                </div>
                
                    <h1 style={{color: "black",fontWeight:"bold",textAlign:"center"}}>Cash Flow</h1>
                    <div className="field">
                        <label  className="label">Email</label>
                        <div className="control">
                            <input type="text" className="input" value={email} onChange={(e)=>setEmail(e.target.value)} placeholder='email'/>
                        </div>
                    </div>
                    <div className="field">
                        <label  className="label">Kωδικός πρόσβασης</label>
                        <div className="control">
                            <input type="password" className="input" value={password} onChange={(e)=>setPassword(e.target.value)} placeholder="*********"/>
                        </div>
                    </div>
                    <div className="field mt-5">
                        <button type="submit" className="button is-success is-fullwidth">{isLoading ?"Loading..." : "Είσοδος"}</button>
                    </div>
                    {isError && <p className='has-text-centered alert alert-danger'>{message}</p>}

                </form>
                </div>
                
  <div class="btn-group my-5">
    <a href="https://paratiritirio-edsna.gr/" class="btn btn-outline-light" aria-current="page"><i class="fas fa-file-download me-2"></i>Επιστροφή στο Site</a>
  </div>
 
</div>
</div>

      {/* <div className="hero-body">
        <div className="container">
          <div className="columns is-centered">
            <div className="column is-4">
              
                
                <form onSubmit={Auth} className='box'>
                    {isError && <p className='has-text-centered'>{message}</p>}
                    <div className="field is-flex is-justify-content-center">
                  <img 
                    src={logo}
                    width="250" 
                    height="80"
                    alt="logo"
                  />
                </div>
                    <h2 style={{color: "black",textAlign:"center"}}>ΥΠΟΣΥΣΤΗΜΑ ΚΑΤΑΧΩΡΗΣΗΣ & ΕΠΕΞΕΡΓΑΣΙΑΣ ΠΕΡΙΒΑΛΛΟΝΤΙΚΩΝ ΔΕΔΟΜΕΝΩΝ</h2>
                    <div className="field">
                        <label  className="label">Email</label>
                        <div className="control">
                            <input type="text" className="input" value={email} onChange={(e)=>setEmail(e.target.value)} placeholder='email'/>
                        </div>
                    </div>
                    <div className="field">
                        <label  className="label">Kωδικός πρόσβασης</label>
                        <div className="control">
                            <input type="password" className="input" value={password} onChange={(e)=>setPassword(e.target.value)} placeholder="*********"/>
                        </div>
                    </div>
                    <div className="field mt-5">
                        <button type="submit" className="button is-success is-fullwidth">{isLoading ?"Loading..." : "Είσοδος"}</button>
                    </div>
                </form>

            </div>
          </div>
        </div>
      </div> */}
    </section>
  );
};

export default Login;
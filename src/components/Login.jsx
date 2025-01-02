import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { LoginUser, reset } from '../features/authSlice';
import cashflow_logo from '../Images/CashFlow logo-0white.png';
import animatedGif from '../Images/cashflowanim.gif'; // Add your GIF image path here
import { InputText } from 'primereact/inputtext';
import { Button } from 'primereact/button';
import '../login.css';
import logo from "../logocmt.png";

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { user, isError, isSuccess, isLoading, message } = useSelector(state => state.auth);

    const Auth = e => {
        e.preventDefault();
        dispatch(LoginUser({ email, password }));
    };

    useEffect(() => {
        if (user && isSuccess) {
            navigate('/statistics');
        }
        dispatch(reset());
    }, [user, isSuccess, dispatch, navigate]);

    return (
        <div className="login-page-container">
            <div className="login-form-section">
                <div className="login-box">
                    <div className="text-center mb-5">
                        <img src={cashflow_logo} alt="CashFlow Logo" height={130} className="mb-3" />
                      
                    </div>
                    <form onSubmit={Auth}>
                        <div className="form-group">
                            <label htmlFor="email" style={{ color: 'white',fontSize:'16px' }}>Email</label>
                            <InputText type="text" className="w-full mb-3" value={email} onChange={e => setEmail(e.target.value)} placeholder="Email" />
                        </div>
                        <div className="form-group">
                            <label htmlFor="password" style={{ color: 'white',fontSize:'16px' }}>Κωδικός Πρόσβασης</label>
                            <InputText type="password" className="w-full mb-3" value={password} onChange={e => setPassword(e.target.value)} placeholder="Κωδικός Πρόσβασης" />
                        </div>
                        <Button type="submit" label={isLoading ? "Loading..." : "Είσοδος"} icon="pi pi-sign-in" className="w-full" />
                       
                    </form>
                    <h6 style={{ color: 'white' ,paddingTop:'10px'}}>Powered by</h6>
                    <img src={logo} alt="cmt Logo" height={45} className="mb-3" />
                    {isError && <p className="error-message">{message}</p>}
                    
                </div>
            </div>
            <div className="login-gif-section visible-gif">
                <img src={animatedGif} alt="Animated GIF" className="responsive-gif" />
            </div>
        </div>
    );
};

export default Login;

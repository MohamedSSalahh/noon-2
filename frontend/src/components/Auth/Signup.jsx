import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { signupUser } from '../../redux/slices/authSlice';
import styles from './Auth.module.css';

const Signup = () => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { user, isLoading, error } = useSelector((state) => state.authState);

    useEffect(() => {
        if (user) {
             if (user.role === 'admin') {
                navigate('/admin');
            } else {
                navigate('/');
            }
        }
    }, [user, navigate]);

    const handleSubmit = (e) => {
        e.preventDefault();
        dispatch(signupUser({ name, email, password }));
    };

    return (
        <div className={styles.auth_container}>
            <form className={styles.auth_form} onSubmit={handleSubmit}>
                <h2>Create Account</h2>
                {error && <div className={styles.error_msg}>{error}</div>}
                <div className={styles.form_group}>
                    <label>Name</label>
                    <input
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        required
                    />
                </div>
                <div className={styles.form_group}>
                    <label>Email</label>
                    <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />
                </div>
                <div className={styles.form_group}>
                    <label>Password</label>
                    <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        minLength="6"
                    />
                </div>
                <button type="submit" className={styles.submit_btn} disabled={isLoading}>
                    {isLoading ? 'Loading...' : 'Sign Up'}
                </button>
                <div className={styles.auth_link}>
                    Already have an account? <Link to="/login">Sign In</Link>
                </div>
            </form>
        </div>
    );
};

export default Signup;

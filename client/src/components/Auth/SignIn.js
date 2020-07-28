import React, { useState, useContext } from 'react';
import { Helmet } from "react-helmet";
import { Link, useHistory } from 'react-router-dom';
import '../../App.css'
import M from 'materialize-css';
import { UserContext } from '../../App';

const SignIn = () => {
    const { state, dispatch } = useContext(UserContext);
    const history = useHistory();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const onSubmitHandler = (e) => {
        e.preventDefault();
        const formData = {
            email: email,
            password: password
        }
        //api call
        fetch('api/users/signin', {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(formData)
        }).then(res => res.json())
            .then(data => {
                if (data.error) {
                    M.toast({ html: data.error, classes: 'rounded, #e53935 red darken-1' });
                } else {
                    localStorage.setItem("jwt", data.token);
                    localStorage.setItem("user", JSON.stringify(data.user));
                    dispatch({
                        type: 'USER',
                        payload: data.user
                    })
                    M.toast({ html: data.message, classes: 'rounded, #388e3c green darken-2' });
                    history.push('/');
                }
            }).catch(err => {
                console.log(err);
            })
    }
    return (
        <div className="signIn">
            <Helmet>
                <meta charSet="utf-8" />
                <title>Welcome - SignIn</title>
            </Helmet>

            <div className="card auth-card ">
                <form onSubmit={onSubmitHandler}>
                    <h4 className="grey-text text-darken-3 title">Sign In</h4>
                    <div className="input-field">
                        <i className="material-icons prefix">email</i>
                        <label htmlFor="email">Email </label>
                        <input type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            id="email"
                            name="email" />
                    </div>

                    <div className="input-field">
                        <i className="material-icons prefix">lock</i>
                        <label htmlFor="password">Password </label>
                        <input
                            type="password"
                            onChange={(e) => setPassword(e.target.value)}
                            id="password"
                            value={password}
                            name="password" />
                    </div>

                    <div className="input-field">
                        <button className="btn pink  blue darken-4" type="submit">Sign In</button>
                        <p> <Link className="link" to="/signup">Don't have an account? sign up</Link></p>
                        <p> <Link className="link" to="/reset">Forgot password?</Link></p>
                    </div>
                </form>
            </div>

        </div>
    );
}

export default SignIn;
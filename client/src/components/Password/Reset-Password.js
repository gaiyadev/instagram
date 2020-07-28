import React, { useState, useContext } from 'react';
import { Helmet } from "react-helmet";
import { useHistory } from 'react-router-dom';
import '../../App.css'
import M from 'materialize-css';

const ForgotPassword = () => {
    const history = useHistory();
    const [email, setEmail] = useState('');

    const onSubmitHandler = (e) => {
        e.preventDefault();
        const formData = {
            email: email,
        }
        //api call
        fetch('api/users/reset-password', {
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
                    M.toast({ html: data.message, classes: 'rounded, #388e3c green darken-2' });
                    history.push('/reset');
                }
            }).catch(err => {
                console.log(err);
            })
    }
    return (
        <div className="signIn">
            <Helmet>
                <meta charSet="utf-8" />
                <title>Welcome - Password reset</title>
            </Helmet>

            <div className="card auth-card ">
                <form onSubmit={onSubmitHandler}>
                    <h4 className="grey-text text-darken-3 title">Password Reset</h4>
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
                        <button className="btn pink  blue darken-4" type="submit">Reset Password</button>
                    </div>
                </form>
            </div>

        </div>
    );
}

export default ForgotPassword;
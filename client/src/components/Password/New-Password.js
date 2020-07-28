import React, { useState } from 'react';
import { Helmet } from "react-helmet";
import { useHistory, useParams } from 'react-router-dom';
import '../../App.css'
import M from 'materialize-css';

const NewPassword = () => {
    const history = useHistory();
    const [password, setPassword] = useState('');
    const { token } = useParams();

    const onSubmitHandler = (e) => {
        e.preventDefault();
        const formData = {
            password: password,
            token: token
        }
        //api call
        fetch('api/users/new-password', {
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
                    history.push('/signin');
                }
            }).catch(err => {
                console.log(err);
            });
    }
    return (
        <div className="signIn">
            <Helmet>
                <meta charSet="utf-8" />
                <title>Welcome - Change Password</title>
            </Helmet>

            <div className="card auth-card ">
                <form onSubmit={onSubmitHandler}>
                    <h4 className="grey-text text-darken-3 title">Change Password</h4>
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
                        <button className="btn pink  blue darken-4" type="submit">Change Password</button>
                    </div>
                </form>
            </div>

        </div>
    );
}

export default NewPassword;
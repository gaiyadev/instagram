import React, { useState, useEffect } from 'react';
import { Helmet } from "react-helmet";
import { Link, useHistory } from 'react-router-dom';
import '../../App.css'
import M, { updateTextFields } from 'materialize-css';


const SignUp = () => {
    const history = useHistory();
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [image, setImage] = useState('');
    const [url, setUrl] = useState(undefined);

    useEffect(() => {
        if (url) {
            uploadFields();
        }
    }, [url])

    //pic upload
    const uploadPic = () => {
        const data = new FormData();
        data.append('file', image);
        data.append('upload_preset', 'insta-clone');
        data.append('cloud_name', 'gaiyadev');

        fetch('	https://api.cloudinary.com/v1_1/gaiyadev/image/upload', {
            method: "POST",
            body: data
        }).then(res => res.json())
            .then(data => {
                setUrl(data.url);
            })
            .catch(err => console.log(err));
    };

    const uploadFields = () => {
        if (!/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(email)) {
            M.toast({ html: 'Invalid email format', classes: 'rounded, #e53935 red darken-1' });
            return;
        }
        const formData = {
            name: name,
            email: email,
            password: password,
            pic: url
        }
        //api call
        fetch('api/users/signup', {
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
            })
    }
    const onSubmitHandler = (e) => {
        e.preventDefault();
        if (image) {
            uploadPic();
        } else {
            uploadFields();
        }



    }


    return (
        < div >
            <Helmet>
                <meta charSet="utf-8" />
                <title>Welcome - SignUp</title>
            </Helmet>
            <div className="card auth-card ">
                <form onSubmit={onSubmitHandler}>
                    <h4 className="grey-text text-darken-3 title">Sign Up</h4>
                    <div className="input-field">
                        <i className="material-icons prefix">account_circle</i>
                        <label htmlFor="name">Name </label>
                        <input
                            type="text"
                            id="name"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            name="name"
                        />
                    </div>

                    <div className="file-field input-field">
                        <div className="btn upload">
                            <span>Upload</span>
                            <input type="file"
                                name="photo"
                                onChange={(e) => setImage(e.target.files[0])}
                            />
                        </div>
                        <div className="file-path-wrapper">
                            <input className="file-path validate" type="text" />
                        </div>
                    </div>

                    <div className="input-field">
                        <i className="material-icons prefix">email</i>
                        <label htmlFor="email">Email </label>
                        <input
                            type="email"
                            value={email}
                            id="email"
                            onChange={(e) => setEmail(e.target.value)}
                            name="email" />
                    </div>

                    <div className="input-field">
                        <i className="material-icons prefix">lock</i>
                        <label htmlFor="password">Password </label>
                        <input
                            type="password"
                            id="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            name="password" />
                    </div>

                    <div className="input-field">
                        <button className="btn pink  blue darken-4" type="submit">Sign Up</button>
                        <p> <Link className="link" to="/signin">Already have an account? signin</Link></p>
                    </div>
                </form>
            </div>
        </div >
    );
}

export default SignUp;
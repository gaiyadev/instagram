import React, { useState, useEffect } from 'react';
import { Helmet } from "react-helmet";
import M from 'materialize-css';
import { useHistory } from 'react-router-dom';

const CreatePost = () => {
    const history = useHistory();
    const [title, setTitle] = useState('');
    const [body, setBody] = useState('');
    const [image, setImage] = useState('');
    const [url, setUrl] = useState('');

    useEffect(() => {
        //api call .. It will wait till  the call to save to cloudinary is successfully  before execution
        if (url) {
            const formData = {
                title: title,
                body: body,
                photo: url
            };
            fetch('api/posts/', {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": "Bearer " + localStorage.getItem("jwt")
                },
                body: JSON.stringify(formData)
            }).then(res => res.json())
                .then(data => {
                    if (data.error) {
                        M.toast({ html: data.error, classes: 'rounded, #e53935 red darken-1' });
                    } else {
                        M.toast({ html: data.message, classes: 'rounded, #388e3c green darken-2' });
                        history.push('/');
                    }
                }).catch(err => {
                    console.log(err);
                })
        }
    }, [url])
    const onSubmitHandler = (e) => {
        e.preventDefault();
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
    }

    return (
        <div className="container">
            <Helmet>
                <meta charSet="utf-8" />
                <title>Welcome - Create Post</title>
            </Helmet>
            <div className="row">
                <div className="col s12">
                    <div className="card auth-card input-filed">
                        <form onSubmit={onSubmitHandler}>
                            <h4 className="grey-text text-darken-3 title">Create Post</h4>
                            <div className="input-field">
                                <i className="material-icons prefix">title</i>
                                <label htmlFor="title">Title </label>
                                <input type="text"
                                    id="title"
                                    value={title}
                                    onChange={(e) => setTitle(e.target.value)}
                                    name="title" />
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
                                <i className="material-icons prefix">textsms</i>
                                <textarea
                                    id="body"
                                    name="body"
                                    value={body}
                                    onChange={(e) => setBody(e.target.value)}
                                    className="materialize-textarea">
                                </textarea>
                                <label htmlFor="body">Body</label>
                            </div>

                            <div className="input-field">
                                <button className="btn pink   blue darken-4 btn-large waves-effect waves-light" type="submit">Post</button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>


        </div>
    );
}

export default CreatePost;
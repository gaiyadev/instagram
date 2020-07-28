import React, { useEffect, useState, useContext } from 'react';
import { Helmet } from "react-helmet";
import { UserContext } from '../../App';
import { useHistory } from 'react-router-dom';

const Profile = () => {
    const history = useHistory();
    const [data, setData] = useState([]);
    const { state, dispatch } = useContext(UserContext);
    const [image, setImage] = useState('');
    const [url, setUrl] = useState('');

    // console.log(state)

    useEffect(() => {
        fetch('api/posts/myposts', {
            headers: {
                "Authorization": "Bearer " + localStorage.getItem("jwt")
            }
        }).then(res => res.json())
            .then(post => {
                setData(post.mypost);
            }).catch(err => console.log(err));
    }, []);

    useEffect(() => {
        if (image) {
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
                    // console.log(data);
                    localStorage.setItem('user', JSON.stringify({ ...state, photo: data.url }));
                    dispatch({
                        type: "UPDATE_PIC",
                        payload: data.url
                    });
                    fetch('api/users/updatepic', {
                        method: "PUT",
                        headers: {
                            "Content-Type": "application/json",
                            "Authorization": "Bearer " + localStorage.getItem("jwt")
                        },
                        body: JSON.stringify({
                            pic: data.url
                        })
                    }).then(res => res.json())
                        .then(result => {
                            console.log(result);
                        }).catch(err => console.log(err));
                    // window.location.reload()

                })
                .catch(err => console.log(err));
        }
    }, [image])
    //profile update
    const updatePhoto = (file) => {
        setImage(file);
    };


    return (
        <div className="container">
            <Helmet>
                <meta charSet="utf-8" />
                <title>Welcome - Profile</title>
            </Helmet>
            <div className="row">
                <div className="col s12">
                    <div className="card" style={{
                        display: "flex",
                        justifyContent: "space-around",
                        margin: "18px, 0px",
                        borderBottom: "1px solid grey",
                        padding: "15px"
                    }}>
                        <div className="card-image">
                            <img
                                className="materialboxed"
                                alt="my pic"
                                style={{ height: "160px", width: "160px", borderRadius: "80px" }}
                                src={state ? state.pic : 'loading'}
                            />

                            <div className="file-field input-field">
                                <div className="btn upload">
                                    <span >Edit Pic</span>
                                    <input type="file"
                                        name="photo"
                                        onChange={(e) => updatePhoto(e.target.files[0])}
                                    />
                                </div>
                                <div className="file-path-wrapper">
                                    <input className="file-path validate" type="text" />
                                </div>
                            </div>

                        </div>
                        <div>
                            <h5> {state ? state.name : 'Loading'} </h5>
                            <h5> {state ? state.email : 'Loading'} </h5>
                            <div style={{
                                display: "flex",
                                justifyContent: "space-between",
                                width: "108%"
                            }}>
                                <h6>{data.length} posts</h6>
                                {/* <h6>{state ? state.followers.length : '0'} followers</h6> */}
                                {/* <h6> {state ? state.following.length : 0} following</h6>  */}
                            </div>
                        </div>
                    </div>
                </div>
                <div className="col s12">
                    {
                        data && data.map(post => {
                            return (
                                <div className="gallery" key={post.id}>
                                    <img className="item" src={post.photo} alt={post.title} />
                                </div>
                            );
                        })
                    }

                </div>
            </div>
        </div>
    );
}

export default Profile;
import React, { useEffect, useState, useContext } from 'react';
import { Helmet } from "react-helmet";
import { UserContext } from '../../App';
import { useParams } from 'react-router-dom';
//import { follow } from '';

const UserProfile = () => {
    const [userProfile, setUserProfile] = useState(null);
    const { state, dispatch } = useContext(UserContext);
    const { userId } = useParams();
    const [showFollow, setShowFollow] = useState(true);
    //state ? !state.following.includes(userId) : true
    useEffect(() => {
        fetch('/api/users/' + userId, {
            headers: {
                "Authorization": "Bearer " + localStorage.getItem("jwt")
            }
        }).then(res => res.json())
            .then(result => {
                console.log(result);
                setUserProfile(result);
            }).catch(err => console.log(err));
    }, []);

    //follow a user              
    const followUser = () => {
        fetch('/api/users/follow', {
            method: "PUT",
            headers: {
                "Authorization": "Bearer " + localStorage.getItem("jwt"),
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                followId: userId
            })
        }).then(res => res.json())
            .then(data => {
                //console.log(data)
                dispatch({
                    type: "UPDATE",
                    payload: {
                        following: data.following,
                        followers: data.followers
                    }
                })
                localStorage.setItem("user", JSON.stringify(data));
                setUserProfile((prevState) => {
                    return {
                        ...prevState,
                        user: {
                            ...prevState.user,
                            followers: [...prevState.user.followers, data._id]
                        }
                    };
                })
                setShowFollow(false);
            })
            .catch(err => {
                console.log(err);
            })
    };


    //unfollow a user              
    const unFollowUser = () => {
        fetch('/api/users/unfollow', {
            method: "PUT",
            headers: {
                "Authorization": "Bearer " + localStorage.getItem("jwt"),
                "Content-Type": "application/json"
            },
            body: JSON.stringify({
                unfollowId: userId
            })
        }).then(res => res.json())
            .then(data => {
                dispatch({
                    type: "UPDATE",
                    payload: {
                        following: data.following,
                        followers: data.followers
                    }
                })
                localStorage.setItem("user", JSON.stringify(data));
                setUserProfile((prevState) => {
                    const newFollower = prevState.user.followers.filter(item => item !== data._id)
                    return {
                        ...prevState,
                        user: {
                            ...prevState.user,
                            followers: newFollower
                        }
                    };
                })
                setShowFollow(true);
                // console.log(data)
            })
            .catch(err => {
                console.log(err);
            })
    };



    return (
        <>
            {userProfile ?
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
                                        src={userProfile.user.pic}
                                    />
                                </div>
                                <div>
                                    <h5> {userProfile.user.name} </h5>
                                    <h5> {userProfile.user.email} </h5>
                                    <div style={{
                                        display: "flex",
                                        justifyContent: "space-between",
                                        width: "108%"
                                    }}>
                                        <h6> {userProfile.posts.length} posts </h6>
                                        <h6> {userProfile.user.followers.length} followers</h6>
                                        <h6>{userProfile.user.following.length} following</h6>
                                    </div>
                                    {showFollow ?
                                        < button onClick={() => followUser()} className="btn pink  blue darken-4" type="submit" > Follow</button >
                                        :
                                        < button onClick={() => unFollowUser()} className="btn pink  blue darken-4" type="submit" > unFollow</button >

                                    }

                                </div>
                            </div>
                        </div>
                        <div className="col s12">
                            {
                                userProfile && userProfile.posts.map(post => {
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

                : <h2>Loading...</h2>}
        </>
    );
}

export default UserProfile;
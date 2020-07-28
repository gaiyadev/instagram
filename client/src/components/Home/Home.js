import React, { useState, useEffect, useContext } from 'react';
import { Helmet } from "react-helmet";
import { UserContext } from '../../App';
import M from 'materialize-css';
import { Link } from 'react-router-dom';

const Home = () => {
    const [data, setData] = useState([]);
    const { state, dispatch } = useContext(UserContext);

    useEffect(() => {
        fetch('api/posts/', {
            headers: {
                "Authorization": "Bearer " + localStorage.getItem("jwt")
            }
        }).then(res => res.json())
            .then(result => {
                setData(result.posts);
            }).catch(err => console.log(err));
    }, [])

    //Like POst
    const likePost = (id) => {
        fetch('api/posts/like', {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                "Authorization": "Bearer " + localStorage.getItem("jwt")
            },
            body: JSON.stringify({
                postId: id
            })
        }).then(res => res.json())
            .then(result => {
                const newData = data.map(like => {
                    if (like._id === result._id) {
                        return result;
                    } else {
                        return like;
                    }
                })
                setData(newData);
            }).catch(err => console.log(err))
    };

    //Unlike post
    const unLikePost = (id) => {
        fetch('api/posts/unlike', {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                "Authorization": "Bearer " + localStorage.getItem("jwt")
            },
            body: JSON.stringify({
                postId: id
            })
        }).then(res => res.json())
            .then(result => {
                const newData = data.map(unlike => {
                    if (unlike._id === result._id) {
                        return result;
                    } else {
                        return unlike;
                    }
                })
                setData(newData);
            }).catch(err => console.log(err))
    };

    //comments
    const commentHandler = (text, postId) => {
        fetch('api/posts/comment', {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                "Authorization": "Bearer " + localStorage.getItem("jwt")
            },
            body: JSON.stringify({
                postId: postId,
                text: text
            })
        }).then(res => res.json())
            .then(result => {
                console.log(result);
                const newData = data.map(comment => {
                    if (comment._id === result._id) {
                        return result;
                    } else {
                        return comment;
                    }
                })
                setData(newData)
            }).catch(err => console.log(err));
    }

    //delete post api/posts/:postId
    const deletePost = postId => {
        // return console.log(postId)
        fetch('api/posts/' + postId, {
            method: "DELETE",
            headers: {
                "Authorization": "Bearer " + localStorage.getItem("jwt")
            },
        }).then(res => res.json())
            .then(result => {
                const newData = data.filter(item => {
                    return item._id !== result._id;
                });
                setData(newData);
                M.toast({ html: result.message, classes: 'rounded, #388e3c green darken-2' });
                // console.log(result);
            }).catch(err => console.log(err));
    }
    return (
        <div className="Home container">
            <Helmet>
                <meta charSet="utf-8" />
                <title>Welcome to Instagram clone</title>
            </Helmet>
            <div className="row">
                <div className="col s12">
                    {
                        data && data.map(post => {
                            return (
                                <div className="card home-card" key={post._id}>
                                    <h5 style={{ padding: "15px" }}>
                                        <Link to={post.postedBy._id !== state._id ? '/profile/' +
                                            post.postedBy._id : '/profile'}>

                                            {post.postedBy.name}
                                        </Link>
                                        <div className="card-image">
                                            <img
                                                className="materialboxed"
                                                alt="my pic"
                                                style={{ height: "60px", width: "60px", borderRadius: "80px" }}
                                                src={state ? state.pic : 'loading'}
                                            />
                                        </div>
                                        {
                                            post.postedBy._id === state._id &&
                                            <i onClick={() => deletePost(post._id)}
                                                style={{ cursor: 'pointer', float: 'right', color: 'red' }}
                                                className="material-icons">
                                                delete</i>

                                        }
                                    </h5>

                                    <div className="card-image">
                                        <img className="item" src={post.photo} />
                                    </div>
                                    <div className="card-content">
                                        <i className="material-icons" style={{ color: "red" }} >favorite</i>
                                        {
                                            post.likes.includes(state._id) ?
                                                <i style={{ cursor: 'pointer' }} onClick={() => unLikePost(post._id)} className="material-icons">thumb_down</i>
                                                :
                                                <i style={{ cursor: 'pointer' }} onClick={() => likePost(post._id)} className="material-icons">thumb_up</i>

                                        }
                                        <h6>Likes {post.likes.length}</h6>
                                        <h6>{post.title}</h6>
                                        <p> {post.body} </p>
                                        {
                                            post.comments.map(record => {
                                                return (
                                                    <h6> <span style={{ fontWeight: "500" }}> {post.postedBy.name} </span>
                                                        {record.text}
                                                    </h6>
                                                );
                                            })
                                        }
                                        <form onSubmit={(e) => {
                                            e.preventDefault();
                                            commentHandler(e.target[0].value, post._id);
                                        }}>
                                            <div className="input-field">
                                                <i className="material-icons prefix">create</i>
                                                <label htmlFor="comment">Comment </label>
                                                <input type="text" name="comment" />
                                            </div>
                                        </form>

                                    </div>
                                </div>
                            );
                        })
                    }

                </div>
            </div>
        </div>
    );
}

export default Home;
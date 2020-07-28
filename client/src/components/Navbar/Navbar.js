import React, { useContext, useRef, useEffect, useState } from 'react';
import { Link, useHistory } from 'react-router-dom';
import '../Navbar/Navbar.css';
import { UserContext } from '../../App';
import M from 'materialize-css';

const Navbar = () => {
    const searchModal = useRef();
    const { state, dispatch } = useContext(UserContext);
    const history = useHistory();
    const [search, setSearch] = useState('');
    const [userDetails, setUserDetails] = useState([]);

    useEffect(() => {
        M.Modal.init(searchModal.current)
    }, []);
    const renderLinks = () => {
        if (state) {
            return [
                <li key={1}><i data-target="modal1" className="material-icon modal-trigger" style={{ color: 'black' }} >search</i>  </li>,
                <li key={2}> <Link to="/profile">Profile</Link> </li>,
                <li key={3}> <Link to="/create">Create Post</Link> </li>,
                <li key={4}> <Link to="/myFollowingpost">My following Post</Link> </li>,
                <li key={5}><button onClick={() => {
                    localStorage.clear()
                    dispatch({ type: 'CLEAR' })
                    history.push('/signin');
                }} className="btn red darken-4" type="submit">SignOut</button>
                </li>

            ]
        } else {
            return [
                <li key={6}> <Link to="/signin">Signin</Link> </li>,
                <li key={7} >  <Link to="/signup">Signup</Link> </li>
            ]
        }
    }

    const fetchUser = (query) => {
        setSearch(query);
        fetch('api/users/search-users', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                query: query
            })
        }).then(res => res.json())
            .then(results => {
                setUserDetails(results.user);
            }).catch(err => console.log(err));
    }
    return (
        <nav>
            <div className="nav-wrapper white" >
                <Link to={state ? '/' : '/signin'} className="brand-logo left">Instagram</Link>
                <ul id="nav-mobile" className="right hide-on-med">
                    {renderLinks()}
                </ul>
            </div>


            <div id="modal1" className="modal" ref={searchModal} style={{ color: 'white', backgroundColor: 'black' }}>
                <div className="modal-content">
                    <div className="input-field">
                        <i className="material-icons prefix">search</i>
                        <input type="text"
                            value={search}
                            onChange={(e) => fetchUser(e.target.value)}
                            id="search"
                            name="search" /><br />
                        <ul className="collection" style={{ marginTop: '20px', color: 'black', }}>
                            {
                                userDetails && userDetails.map(item => {
                                    return <Link to={item._id !== state._id ? "/profile/" + item._id : '/profile'} onClick={() => {
                                        M.Modal.getInstance(searchModal.current).close();
                                        setSearch('');
                                    }} >
                                        <li className="collection-item" style={{ width: '100%' }} key={item._id} >{item.email}</li>
                                    </Link>

                                })
                            }

                        </ul>
                    </div>
                </div>

                <div className="modal-footer">
                    <button className="modal-close waves-effect waves-green btn-flat" onClick={() => setSearch('')}>close</button>
                </div>
            </div>


        </nav>

    );
}

export default Navbar;
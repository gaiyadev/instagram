import React, { useEffect, createContext, useReducer, useContext } from 'react';
import './App.css';
import Navbar from "./components/Navbar/Navbar";
import { BrowserRouter, Route, Switch, useHistory } from 'react-router-dom';
import Home from './components/Home/Home';
import SignIn from './components/Auth/SignIn';
import SiginUp from './components/Auth/SignUp';
import Profile from './components/Profile/Profile';
import UserProfile from './components/Profile/UserProfile';
import ForgotPassword from './components/Password/Reset-Password';
import NewPassword from './components/Password/New-Password';
import CreatePost from './components/Post/CreatePost';
import SingleUserPost from './components/Post/SingleUserPosts';
import { reducer, initialState } from './reducers/userReducer';

export const UserContext = createContext();
const Routing = () => {
  const history = useHistory();
  const { state, dispatch } = useContext(UserContext);
  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('user'));

    if (user) {
      // history.push('/');
      dispatch({ type: 'USER', payload: user });
    } else {
      if (!history.location.pathname.startsWith('/reset'))
        history.push('/signin');
    }
  }, [])

  return (
    <Switch>
      <Route path='/' exact component={Home}></ Route>
      <Route path='/profile/:userId' exact component={UserProfile}></ Route>
      <Route path='/profile' exact component={Profile}></ Route>
      <Route path='/signin' exact component={SignIn}></ Route>
      <Route path='/signup' exact component={SiginUp}></ Route>
      <Route path='/create' exact component={CreatePost}></ Route>
      <Route path='/myFollowingpost' exact component={SingleUserPost}></ Route>
      <Route path='/reset' exact component={ForgotPassword}></ Route>
      <Route path='/reset/:token' exact component={NewPassword}></ Route>
    </Switch>
  );
};

function App() {
  const [state, dispatch] = useReducer(reducer, initialState);
  return (
    <UserContext.Provider value={{ state, dispatch }}>
      <BrowserRouter>
        <div className="App">
          <Navbar />
          <Routing />
        </div>
      </BrowserRouter>
    </UserContext.Provider>
  );
}

export default App;

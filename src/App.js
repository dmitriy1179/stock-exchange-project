import React from "react";
import "./styles.css";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import ProtectedRoute from "./shared/components/protected-route";
import HomeScreen from "./screens/home";
import LoginScreen from "./screens/login";
import AdFind from "./screens/ad-find" 
import PostAdUser from "./screens/ad-post"
import MyAdsScreen from "./screens/ad-my"
import MyAdOneSreen from "./screens/ad-my-one"
import MyAdEditSreen from "./screens/ad-my-edit"
import Navbar from "./shared/components/navbar"
import ProfileEditSreen from "./screens/profile-edit"
import OtherAdOneSreen from "./screens/ad-other-users-one"
import OtherUserAdsScreen from "./screens/ads-other-user"
import MessagesScreen from "./screens/messages";
import MessagesOneUserScreen from "./screens/messages-one-user"
import exchange1 from "./shared/images/exchange1.png"

const NotFound = () => <div className="mt-3 flex-grow-1"> Page not found</div>;

function App() {
  return (
    <div className="d-flex flex-column App">
      <header className="bg-secondary d-flex">
        <img src={exchange1}
          className="img-fluid rounded pl-3 my-auto  ml-3"
          style={{width:"70px", height:"70px"}} 
        />  
        <div className="text-white font-weight-bold text-left align-middle p-2 m-3" style={{fontSize:"24px"}}>
          Stock exchange
        </div>
      </header>
      <Router>
        <Navbar />
        <Switch>
          <ProtectedRoute exact path="/" >
            <HomeScreen />
          </ProtectedRoute>
          <ProtectedRoute exact path="/profile/edit/:_id" >
            <ProfileEditSreen />
          </ProtectedRoute>
          <ProtectedRoute exact path="/ad/find" >
            <AdFind />
          </ProtectedRoute>
          <ProtectedRoute exact path="/ad/curUser" >
            <MyAdsScreen />
          </ProtectedRoute>
          <ProtectedRoute exact path="/ad/otherUser/:_id" >
            <OtherAdOneSreen />
          </ProtectedRoute>
          <ProtectedRoute exact path="/ads/otherUser/:_id" >
            <OtherUserAdsScreen />
          </ProtectedRoute>
          <ProtectedRoute exact path="/ad/curUser/:_id" >
            <MyAdOneSreen />
          </ProtectedRoute>
          <ProtectedRoute exact path="/ad/curUser/edit/:_id" >
            <MyAdEditSreen />
          </ProtectedRoute>
          <ProtectedRoute exact path="/ad/post" >
            <PostAdUser />
          </ProtectedRoute>
          <ProtectedRoute exact path="/messages" >
            <MessagesScreen />
          </ProtectedRoute>
          <ProtectedRoute exact path="/messages/:_id" >
            <MessagesOneUserScreen />
          </ProtectedRoute>
          <Route path="/login" exact>
            <LoginScreen />
          </Route>
          <Route>
            <NotFound />
          </Route>
        </Switch>
      </Router>
      <footer className="bg-dark mt-3" id="footer">
        <div></div>
      </footer>
    </div>
  );
}

export default App;

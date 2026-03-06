import React from 'react'
import "../App.css";
import mobileImage from "../assets/mobile.png";
import { Link } from 'react-router-dom';

function LandingPage2() {
  return (
    <div className='landingPageContainer2'>
      <nav>
        <div className='navHeader'>
            <h2>VIDORA</h2>
        </div>
        <div className='navlist'>
            <p>join as Guest</p>
            <p>Register</p>
            <div role='button'>
                <p>Login</p>
            </div>
        </div>
      </nav>

      <div className="landingMainContainer">
        <div>
            <h1><span style={{color:"#ff9839"}}>Connect</span> with your loved Ones</h1>
            <p>Cover a distance by Vidora</p>
            <div role='button'>
                <Link to="/auth">Get Started</Link>
            </div>
        </div>
        <div>
            <img src={mobileImage} alt="mobile image" />
        </div>
      </div>
    </div>
  )
}

export default LandingPage2

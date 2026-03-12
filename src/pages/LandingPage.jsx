import React from 'react'
import "../App.css";
import { Menu } from 'lucide-react';
import mobileImage from "../assets/phone3.png";
import { Link } from 'react-router-dom';
import LogoImage from '../assets/logo/vidoralogo1.png';

function LandingPage() {
  return (
    <div className='landingPageContainer2'>
      <nav className='bg-gray-100 shadow-[0_4px_40px_0px_#0000004d]'>
        <div className='navHeader'>
            <img
          className="h-[80px] -ml-[1rem] -my-[1.6rem]"
          src={LogoImage}
          alt=""
        />
        </div>
        <div className='navlist'>
            <p className='nav-tab' >join as Guest</p>
            <p className='nav-tab'>Register</p>
            <div role='button' className='nav-tab' >
                <p className='login'>Login</p>
            </div>
            <Menu size={30} className='menu'/>
        </div>
      </nav>

      <div className="landingMainContainer">
        <div className='w-full md:max-w-[70%]'>
          <h1 className="main-heading"> <span className='logoname'>Vidora </span> - Where Conversations Come Alive </h1>
            <h1 className='sub-heading'>Connect with your loved Ones</h1>
            <p>Cover a distance by Vidora</p>
            <p>Vidora brings people together through smooth video communication,
            real-time messaging, and effortless screen sharing — making every
            conversation more immersive, interactive, and impactful.</p>
            <div role='button'>
                <Link to="/auth">Get Started</Link>
            </div>
        </div>
        <div className='hidden md:block'>
            <img className='h-[80vh]' src={mobileImage} alt="mobile image" />
        </div>
      </div>
    </div>
  )
}

export default LandingPage;

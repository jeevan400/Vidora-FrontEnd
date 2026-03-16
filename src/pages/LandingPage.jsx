import React from 'react'
import "../App.css";
import { Menu } from 'lucide-react';
import mobileImage from "../assets/vidoraImages/mainLandingPageImage.png";
import { Link } from 'react-router-dom';
import LogoImage from '../assets/vidoraImages/vidoraLogoImage.png';

function LandingPage() {
  return (
    <div className='landingPageContainer2'>
      <nav className='bg-gray-50 shadow-[0_4px_40px_0px_#0000004d]'>
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
        <div className='w-full md:max-w-[60%]'>
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
        <div className='mainImage hidden md:block'>
            <img className='' src={mobileImage} alt="mobile image" />
        </div>
      </div>
    </div>
  )
}

export default LandingPage;

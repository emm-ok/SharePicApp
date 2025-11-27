import React from 'react'
import { useGoogleLogin } from '@react-oauth/google';
import { FcGoogle } from 'react-icons/fc';
import shareVideo from '../assets/backg_vid2.mp4';
import logo from '../assets/logo.png';
import { useNavigate } from 'react-router-dom';


import { client } from '../client';

const Login = () => {
    const navigate = useNavigate();

    const handleLogin = useGoogleLogin({
      onSuccess: async(tokenResponse) => {
        try {
            // 1. Get user profile from Google API
            const userInfo = await fetch(`https://www.googleapis.com/oauth2/v3/userinfo`,
                {
                    headers: {
                        Authorization: `Bearer ${tokenResponse.access_token}`
                    },
                }
            ).then((res) => res.json());
            
            const { name, sub, picture } = userInfo;

            // 2. Save user info in local storage
            localStorage.setItem('user', JSON.stringify(userInfo));

            // 3. Create user doc for Sanity
            const doc = {
            _id: sub,
            _type: 'user',
            userName: name,
            image: picture,
        };

        await client.createIfNotExists(doc)   

        // 4. redirect to home after login success
        navigate('/', { replace: true});

        } catch (error) {
            console.error("Login error:", error)
        }
      },  


      onError: () => {
        console.log('Google Sign-In Fialed');
      },  
    })
    

    return (
        <div className='flex justify-start items-center flex-col h-screen'>
            <div className='relative w-full h-full'>
                <video
                    src={shareVideo}
                    type="video/mp4"
                    loop
                    muted
                    autoPlay
                    className='w-full h-full object-cover'
                />

                <div className='absolute flex flex-col justify-center items-center top-0 right-0 left-0 bottom-0 bg-blackOverlay'>
                    <div className='p-5'>
                        <img src={logo} width="130px" alt='logo' />
                    </div>

                    <div className='shadow-2xl'>
                        <button
                            type='button'
                            className='bg-white flex justify-center items-center p-2 rounded-lg cursor-pointer outline-none'
                            onClick={handleLogin}>
                                <FcGoogle className='mr-4' /> Sign in with Google
                            </button>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Login;

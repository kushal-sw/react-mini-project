import React from 'react';
import Grainient from '../components/Grainient';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '../components/ui/card';
import { ButtonColorful } from '../components/ui/button-colorful';
import { EyeIcon } from 'lucide-react';
import { GoogleAuthProvider, signInWithPopup } from 'firebase/auth';
import { auth } from '../firebase';

export default function Login({ onLogin, onRegisterClick }) {
  const handleGoogleLogin = async () => {
    const provider = new GoogleAuthProvider();
    try {
      const result = await signInWithPopup(auth, provider);
      console.log(result.user);
      if (onLogin) onLogin();
    } catch (error) {
      console.log(error);
      alert("Failed to login with Google");
    }
  };

  return (
    <div className="flex min-h-screen bg-[#111111] text-white font-sans">
      {/* Left side - Pattern */}
      <div className="hidden lg:flex lg:w-1/2 p-8 h-screen sticky top-0">
        <div className="relative w-full h-full rounded-[2.5rem] overflow-hidden bg-[#1a103c]">
          <Grainient 
            timeSpeed={2.0}
            color1="#a855f7" 
            color2="#7e22ce" 
            color3="#4c1d95" 
            className="w-full h-full opacity-80"
          />
          {/* Top-left logo */}
          <div className="absolute top-8 left-8">
            <span className="text-2xl text-white tracking-[0.5px] drop-shadow-sm">
              <span className="font-normal">Fork</span>
              <span className="font-extrabold">Cast</span>
            </span>
          </div>
          {/* Bottom-left text */}
          <div className="absolute bottom-8 left-8 text-white/70 text-sm font-medium">
            Eat good. Spend less.
          </div>
        </div>
      </div>

      {/* Right side - Form */}
      <div className="flex-1 flex flex-col justify-center px-4 sm:px-6 lg:px-20 xl:px-24 relative">
        <Card className="mx-auto w-full max-w-[360px] bg-transparent border-none text-white shadow-none">
          <CardHeader className="text-center mb-6 p-0">
            <CardTitle className="text-2xl font-semibold tracking-tight text-white mb-2">Welcome back</CardTitle>
            <CardDescription className="text-sm text-gray-400">Please log in to continue.</CardDescription>
          </CardHeader>

          <CardContent className="space-y-4 p-0">
            <div className="flex gap-4">
              <Button onClick={handleGoogleLogin} variant="outline" className="w-full bg-transparent border-[#2a2a2a] text-sm font-normal text-white hover:bg-[#2a2a2a] hover:text-white h-10">
                <svg className="mr-2 h-4 w-4" viewBox="0 0 24 24">
                  <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                  <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                  <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
                  <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
                </svg>
                Google
              </Button>

            </div>

            <div className="relative my-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-[#2a2a2a]"></div>
              </div>
              <div className="relative flex justify-center text-xs">
                <span className="bg-[#111111] px-3 text-gray-500 uppercase">OR</span>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <Input 
                  type="email" 
                  placeholder="Email" 
                  className="bg-[#1a1a1a] border-white/20 text-white placeholder:text-gray-500 focus-visible:ring-purple-500 h-10"
                />
              </div>
              <div className="relative">
                <Input 
                  type="password" 
                  placeholder="Password" 
                  className="bg-[#1a1a1a] border-white/20 text-white placeholder:text-gray-500 focus-visible:ring-purple-500 h-10 pr-10"
                />
                <button className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300">
                  <EyeIcon className="h-4 w-4" />
                </button>
              </div>
              
              <ButtonColorful 
                onClick={onLogin}
                label="Continue"
                className="w-full mt-2"
              />
            </div>
          </CardContent>

          <CardFooter className="flex-col mt-8 text-center text-xs text-gray-400 space-y-3 p-0">
            <p>
              Forgot your password? <a href="#" className="text-gray-300 hover:text-white border-b border-gray-600 hover:border-gray-300 pb-[1px]">Reset Your Password</a>
            </p>
            <p>
              Don't have an account? <button onClick={onRegisterClick} className="text-gray-300 hover:text-white border-b border-gray-600 hover:border-gray-300 pb-[1px]">Register</button>
            </p>
          </CardFooter>
        </Card>
        
        {/* Footer */}
        <div className="absolute bottom-6 right-6 lg:right-12 text-xs text-gray-500">
          By continuing, you agree to our <a href="#" className="hover:text-gray-300 border-b border-transparent hover:border-gray-400 pb-[1px]">Terms of Service</a> and <a href="#" className="hover:text-gray-300 border-b border-transparent hover:border-gray-400 pb-[1px]">Privacy Policy</a>.
        </div>
      </div>
    </div>
  );
}

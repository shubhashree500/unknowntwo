
import Cookies from 'js-cookie';
import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import axios from 'axios';
import { useDispatch, useSelector } from 'react-redux';
import { loginpage } from '../assets';
import baseUrl from '../../config/baseurl';

const LoginPage: React.FC = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const dispatch = useDispatch<any>();
  const router = useRouter();
  const { user } = useSelector((state: any) => state.auth);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const response = await axios.post(`${baseUrl}/user/login`, { username, password });
      const userData = response.data;
      console.log("userData",userData);
      const accessToken = userData.accessToken;
      Cookies.set('accessToken', accessToken);
      dispatch({ type: 'LOGIN_SUCCESS', payload: userData });

      // Redirect based on role
      // if (userData.user.role === 'user'  || userData.user.role === 'sup-admin') {
      //   router.push('/dashboard-page');
      // } else if (userData.user.role === 'admin' || userData.user.role === 'sub-admin') {
      //   router.push('/admin/admin-dashboard');
      // }

      if(userData.success){
        router.push('/dashboard-page');
      }
    } catch (error: any) {
      setError(error.response?.data?.message || 'Login failed');
      dispatch({ type: 'LOGIN_FAILURE', payload: error.response?.data?.message });
    }
  };

  useEffect(() => {
    if (user) {
      if (user.user.role === 'user') {
        router.push('/dashboard-page');
      } else if (user.user.role === 'admin' || user.user.role === 'sub-admin' || user.user.role === 'sup-admin') {
        // router.push('/admin/admin-dashboard');
        router.push('/dashboard-page');
      }
    }
  }, [user, router]);

  const handleUsernameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUsername(e.target.value);
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(e.target.value);
  };

  return (
    <div className="flex items-center justify-center h-screen bg-cover" style={{ backgroundImage: `url(${loginpage.src})` }}>
      <div className="bg-transparent bg-opacity-30 backdrop-filter backdrop-blur-lg p-8 rounded-lg shadow-lg w-96">
        <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">Login</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="username">
              Username
            </label>
            <input
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              id="username"
              type="text"
              placeholder="Enter your username"
              value={username}
              onChange={handleUsernameChange}
            />
          </div>
          <div className="mb-6">
            <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="password">
              Password
            </label>
            <input
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline"
              id="password"
              type={showPassword ? 'text' : 'password'}
              placeholder="********"
              value={password}
              onChange={handlePasswordChange}
            />
          </div>
          {error && <p className="text-red-500 text-xs italic mb-4">{error}</p>}
          <div className="flex items-center justify-between">
            <button
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
              type="submit"
            >
              Login
            </button>
            <Link className="inline-block align-baseline font-bold text-sm text-blue-500 hover:text-blue-800" href="#">
              Forgot Password?
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
};

export default LoginPage;




































// import React, { useState, useEffect } from 'react';
// import { useRouter } from 'next/router';
// import Link from 'next/link';
// import { login } from '../redux/actions/authActions';
// import { useDispatch, useSelector } from 'react-redux';
// // import { LoginBg } from '../assets';
// import { loginpage } from '../assets';
// const LoginPage: React.FC = () => {
//   const [username, setUsername] = useState('');
//   const [password, setPassword] = useState('');
//   const [showPassword, setShowPassword] = useState(false);  
//   const dispatch = useDispatch<any>();
//   const router = useRouter();
//   const { user, error } = useSelector((state: any) => state.auth);

//   const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
//     e.preventDefault();
//     dispatch(login(username, password));   
//   };

//   useEffect(() => {
//     if (user) {
//       if (user.user.role === 'user') {
//         router.push('/dashboard-page');
//       }
//       // } else if (user.user.role === 'admin') {
//       //   router.push('/admin/admin-dashboard');
//       // } else if (user.user.role === 'sub-admin') {
//       //    router.push('/admin/admin-dashboard');
//       // }
      
//     }
//   }, [user, router]);

//   const handleUsernameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     setUsername(e.target.value);
//   };

//   const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
//     setPassword(e.target.value);
//   };

//   return (
//     <div className="flex items-center justify-center h-screen bg-cover" style={{ backgroundImage: `url(${loginpage.src})` }}>
//            <div className="bg-transparent bg-opacity-30 backdrop-filter backdrop-blur-lg p-8 rounded-lg shadow-lg w-96">
//             <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">Login</h2>
//             <form
//               onSubmit={handleSubmit}
//             >
//               <div className="mb-4">
//                 <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="username">
//                   Username
//                 </label>
//                 <input
//                   className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
//                   id="username"
//                   type="text"
//                   placeholder="Enter your username"
//                   value={username}
//                   onChange={handleUsernameChange}
//                 />
//               </div>
//               <div className="mb-6">
//                 <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="password">
//                   Password
//                 </label>
//                 <input
//                   className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline"
//                   id="password"
//                   type="password"
//                   placeholder="********"
//                   value={password}
//                   onChange={handlePasswordChange}
//                 />
//               </div>
//               {error && <p className="text-red-500 text-xs italic mb-4">{error}</p>}
//               <div className="flex items-center justify-between">
//                 <button
//                   className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
//                   type="submit"
//                 >
//                   Login
//                 </button>
//                 <Link className="inline-block align-baseline font-bold text-sm text-blue-500 hover:text-blue-800" href="#">
//                   Forgot Password?
//                 </Link>
//               </div>
//             </form>
//           </div>
//         </div>
//   );
// };

// export default LoginPage;


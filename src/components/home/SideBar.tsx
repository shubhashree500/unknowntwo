// import Link from 'next/link';
// import React from 'react';
// import { dashboardicon } from '@/src/assets';
// import { delegation } from '@/src/assets';
// import { home } from '@/src/assets';
// import { procurement } from '@/src/assets';
// import { quotation } from '@/src/assets';
// import { indent } from '@/src/assets';
// import { asset1 } from '@/src/assets';
// // import { Link } from 'react-router-dom';

// const Sidebar = () => {
//   return (
//     <div className="h-screen w-80 bg-gray-600 text-white">
//       <div>
//         <h1 className="text-3xl p-4 flex text-center items-center justify-between font-mono text-black font-extrabold"><img src={asset1.src} alt="" className='h-20 w-15'/>Asset Management</h1>
//       </div>
//       <nav className="mt-10 ">
//         <Link href="/home" className="flex gap-6 items-center py-2.5 px-4 transition-colors transform hover:scale-95 hover:bg-stone-950 hover:text-red-700"><img src={home.src} alt="" className='h-10 w-10'/>Home</Link>
//         <Link href="/dashboard-page" className="flex gap-6 items-center py-2.5 px-4 transition-colors transform hover:scale-95 hover:bg-stone-950 hover:text-red-700"> <img src={dashboardicon.src} alt="" className='h-10 w-10' />Dashboard</Link>
//         <Link href="/quotation" className="flex gap-6 items-center py-2.5 px-4 transition-colors transform hover:scale-95 hover:bg-stone-950 hover:text-red-700"><img src={quotation.src} alt="" className='h-10 w-10'/> QuotationPage</Link>
//         <Link href="/assetsDetails" className="flex gap-6 items-center py-2.5 px-4 transition-colors transform hover:scale-95 hover:bg-stone-950 hover:text-red-700"><img src={indent.src} alt="" className='h-10 w-10'/>Indent list</Link>
//         {/* <Link href="/employeeManagement" className="block py-2.5 px-4 hover:bg-gray-700">Employees</Link> */}
//         <Link href="/assetsList" className="flex gap-6 items-center py-2.5 px-4 transition-colors transform hover:scale-95 hover:bg-stone-950 hover:text-red-700"><img src={delegation.src} alt= "" className='h-10 w-10'/> Issued assets</Link>
//         <Link href="/assetsForm" className="flex gap-6 items-center py-2.5 px-4 transition-colors transform hover:scale-95 hover:bg-stone-950 hover:text-red-700"><img src={procurement.src} alt="" className='h-10 w-10'/>Total assets</Link>
//       </nav>
//     </div>
//   );
// };

// export default Sidebar;


















import Link from 'next/link';
import React from 'react';
import { useRouter } from 'next/router';
import { dashboardicon, delegation, home, procurement, quotation, indent, asset1 } from '@/src/assets';
import baseUrl from '@/config/baseurl';
import axios from 'axios';

const Sidebar = () => {
  const router = useRouter();

  const handleLogout = async () => {
    try {
      const response = await axios.post(`${baseUrl}/user/logout`, {},{
        withCredentials: true,
      });
      // Send a logout request to the backend to clear cookies or sessions

  
      // Check if logout is successful
      if (response.status === 200) {
        // Clear localStorage or sessionStorage (client-side data)
        localStorage.removeItem('userToken');
        sessionStorage.removeItem('userSession'); // If session-based
        
        // Redirect to login page
        router.push('/login'); // Adjust to 'router.push('/login')' if you're using Next.js
      } else {
        console.error('Logout failed:', response.data);
        alert('Error during logout');
      }
    } catch (error) {
      console.error('Logout error:', error);
      alert('Something went wrong, please try again later.');
    }
  };
  return (
    <div className="h-screen w-80 bg-gray-600 text-white flex flex-col justify-between">
      <div>
        <div>
          <h1 className="text-3xl p-4 flex text-center items-center justify-between font-mono text-black font-extrabold">
            <img src={asset1.src} alt="" className="h-20 w-15" />
            Asset Management
          </h1>
        </div>
        <nav className="mt-10">
          <Link
            href="/home"
            className="flex gap-6 items-center py-2.5 px-4 transition-colors transform hover:scale-95 hover:bg-stone-950 hover:text-red-700"
          >
            <img src={home.src} alt="" className="h-10 w-10" />
            Home
          </Link>
          <Link
            href="/dashboard-page"
            className="flex gap-6 items-center py-2.5 px-4 transition-colors transform hover:scale-95 hover:bg-stone-950 hover:text-red-700"
          >
            <img src={dashboardicon.src} alt="" className="h-10 w-10" />
            Dashboard
          </Link>
          <Link
            href="/quotation"
            className="flex gap-6 items-center py-2.5 px-4 transition-colors transform hover:scale-95 hover:bg-stone-950 hover:text-red-700"
          >
            <img src={quotation.src} alt="" className="h-10 w-10" />
            QuotationPage
          </Link>
          <Link
            href="/assetsDetails"
            className="flex gap-6 items-center py-2.5 px-4 transition-colors transform hover:scale-95 hover:bg-stone-950 hover:text-red-700"
          >
            <img src={indent.src} alt="" className="h-10 w-10" />
            Indent list
          </Link>
          <Link
            href="/assetsList"
            className="flex gap-6 items-center py-2.5 px-4 transition-colors transform hover:scale-95 hover:bg-stone-950 hover:text-red-700"
          >
            <img src={delegation.src} alt="" className="h-10 w-10" />
            Issued assets
          </Link>
          <Link
            href="/assetsForm"
            className="flex gap-6 items-center py-2.5 px-4 transition-colors transform hover:scale-95 hover:bg-stone-950 hover:text-red-700"
          >
            <img src={procurement.src} alt="" className="h-10 w-10" />
            Total assets
          </Link>
        </nav>
      </div>
      <div className="p-4">
        <button
          onClick={handleLogout}
          className="w-full py-2.5 px-4 bg-red-600 hover:bg-red-700 text-white font-semibold rounded transition-colors transform hover:scale-95"
        >
          Logout
        </button>
      </div>
    </div>
  );
};

export default Sidebar;

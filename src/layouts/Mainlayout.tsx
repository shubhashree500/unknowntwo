import { FC, ReactNode } from 'react';
import Sidebar from '../components/home/SideBar';

interface MainLayoutProps {
  children: ReactNode;
}

const MainLayout: FC<MainLayoutProps> = ({ children }) => {
  return (
    <div className="flex overflow-hidden h-screen">
      
      <div className="sticky top-0 h-screen">
        <Sidebar />
      </div>
      
     
      <main className="flex-1  bg-gray-100 overflow-auto">
        {children}
      </main>
    </div>
  );
};

export default MainLayout;

// import Sidebar from '../components/dashboard/Sidebar';
// import ModeToggle from '../components/ModeToggle'; 
import {Outlet} from 'react-router-dom';
const MainLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <section>
      <div className='flex'>
        <div className='hidden md:block h-[100vh] w-[300px]'>
          {/* <Sidebar /> */}
        </div>
        <div className='p-5 w-full md:max-w-[1140px]'>
          <span className="flex items-center justify-between pb-4">
            <h2>DASHBOARD</h2>
            {/* <ModeToggle /> */}
          </span>
          <Outlet />
        </div>
      </div>
    </section>
  );
};

export default MainLayout;

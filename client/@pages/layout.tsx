import {Outlet} from 'react-router-dom';

const MainLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <section>
      <div className='flex'>
        <div className='p-5 w-full md:max-w-[1140px]'><Outlet /></div>
      </div>
    </section>
  );
};

export default MainLayout;

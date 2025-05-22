import { StrictMode } from 'react';
import { BrowserRouter, Routes } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import { hydrateRoot } from 'react-dom/client';
import buildRoutes from './@core/buildRoutes';

hydrateRoot(document,
  <StrictMode> 
    <HelmetProvider> 
      <BrowserRouter> 
        <Routes>
         {buildRoutes()} 
        </Routes>
      </BrowserRouter>
    </HelmetProvider>
  </StrictMode>
);


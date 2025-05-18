import { StrictMode } from 'react';
import { hydrateRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import Routes from './Routes';

hydrateRoot(
  document, 
  <StrictMode>
   <HelmetProvider>
     <BrowserRouter>
       <Routes />
     </BrowserRouter>
   </HelmetProvider> 
  </StrictMode>,
);

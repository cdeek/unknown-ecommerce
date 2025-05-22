import bodyParser from 'body-parser';
import cookieParser from 'cookie-parser';
import { parse } from 'url';
import dotenv from 'dotenv';
import express from 'express';
import http from 'http';
import path from 'path';
// import { watch } from './HMR'
import { render } from '../client/render';

import connectDb from './config/db';

 import {
   productRoutes, authRoutes,
   categoryRoutes, reviewRoutes,
   orderRoutes, paymentRoutes,
   cartRoutes, couponRoutes,
   reportRoutes, pageRoutes
 } from './routes'; 

 dotenv.config(); 

const port = parseInt(process.env.PORT || '3000', 10)
const dev = process.env.NODE_ENV !== 'production';
const app = express(); 
const httpServer = http.createServer(app);
const workspace = process.cwd();

const start = async () => {
  try { 
    // connect to dataBase
    // await connectDb(); 
   
    // Middleware 
    app.use('/static', express.static(path.join(workspace, 'dist', 'static')));
    app.use(express.static(path.join(workspace, 'public')));
    app.use(bodyParser.json());
    app.use(express.json());
    app.use(bodyParser.urlencoded({ extended: true }));
    app.use(cookieParser()); 
  
    app.get('/sitesmap', async (req, res) => {
      render(req, res, true);
    })
    // routes 
    app.use("/api/products", productRoutes);
    app.use("/api/auth", authRoutes);
    app.use("/api/category", categoryRoutes);
    app.use("/api/review", reviewRoutes);
    app.use("/api/order", orderRoutes);
    app.use("/api/payment", paymentRoutes);
    app.use("/api/cart", cartRoutes);
    app.use("/api/coupon", couponRoutes);  
    app.use("/api/page", pageRoutes);  
    app.use("/api/report", reportRoutes);  

    app.use('*all', (req, res) => {
      try {
        if (req.path.startsWith('/api')) return;
        render(req, res);
      } catch (e) {
        console.error(e.stack);
        res.status(500).end(e.stack);
      }
    });


    httpServer.listen(port, () => {
      console.log(`>🚀 Ready on port ${port} as ${ dev ? "development" : "production"}`)
    });
  } catch (err) {
    if (err instanceof Error) {
      console.error(err.stack);
    } else {
      console.error('Unknown error:', err);
    }
    process.exit(1); 
  }
}; 

start();

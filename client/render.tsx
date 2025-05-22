import React, { StrictMode } from 'react';
import { renderToPipeableStream } from 'react-dom/server';
import { StaticRouter, Routes } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import buildRoutes from './@core/buildRoutes';

export function render(req, res, crawler = false) {
  const helmetContext = {};
  let didError = false;

  const { pipe, abort } = renderToPipeableStream(
    <StrictMode>
      <HelmetProvider context={helmetContext}>
        <StaticRouter location={req.originalUrl}> 
          <Routes>
            {buildRoutes()} 
          </Routes>
        </StaticRouter>
      </HelmetProvider>
    </StrictMode>,
    {
      bootstrapModules: ['/static/index.js'],

      onShellReady() {
        if (!crawler) {
          const { helmet } = helmetContext as any;
         
          res.statusCode = didError ? 500 : 200;
          res.setHeader('Content-Type', 'text/html');
          res.write(`<!DOCTYPE html>
            <html ${helmet?.htmlAttributes?.toString() || ''}>
            <head>
              <meta charset="UTF-8" />
              ${helmet?.title?.toString() || ''}
              ${helmet?.meta?.toString() || ''}
              <link rel="canonical" href="${req.protocol}://${req.get('host')}${req.url}" />
              <link rel="stylesheet" href="/static/style.css" />
              ${helmet?.link?.toString() || ''}
              ${helmet?.script?.toString() || ''}
            </head>
            <body ${helmet?.bodyAttributes?.toString() || ''}>`);

          pipe(res, { end: false });
          res.on('close', () => {
            res.end(` 
             <p>Testing</p>
            </body></html>
            `);
          });
        }
      },
      
      onShellError(error) {
        console.error(error);
        res.status(500).send(`<!doctype html>
          <p>Something went wrong</p>
          
        `);
      },

      onAllReady() {
        if (crawler) {
          const { helmet } = helmetContext as any;
          res.statusCode = didError ? 500 : 200;
          res.setHeader('Content-Type', 'text/html');
          res.write(`<!DOCTYPE html>
            <html ${helmet?.htmlAttributes?.toString() || ''}>
            <head>
              <meta charset="UTF-8" />
              ${helmet?.title?.toString() || ''}
              ${helmet?.meta?.toString() || ''}
              <link rel="canonical" href="${req.protocol}://${req.get('host')}${req.url}" />
              <link rel="stylesheet" href="/static/style.css" />
              ${helmet?.link?.toString() || ''}
              ${helmet?.script?.toString() || ''}
            </head>
            <body ${helmet?.bodyAttributes?.toString() || ''}>`);

          pipe(res, { end: false });
          res.on('close', () => {
            res.end(`
             <p>Testing</p>
            </body></html>
            `);
          });
        }
      },

      onError(err) {
        didError = true;
        console.error(err);
      },
    }
  );

  setTimeout(() => {
    abort();
  }, 10000);
}

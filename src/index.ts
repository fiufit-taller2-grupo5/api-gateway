import express, { Express, Request, Response } from 'express';
import { App } from './App';
import { AppRouter } from './AppRouter';

const port = 80;

const expressApp = express();

const app = new App(expressApp, port, new AppRouter(expressApp));

app.startListening();

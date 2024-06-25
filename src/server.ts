import puppeteer, { Browser, Page } from "puppeteer";
import { Program } from "./program.js";
import express, { Express, Request, Response } from "express";

(async () => {
  
 
})();

const app: Express = express();
  const port = 3000;

  app.get('/', async (req: Request, res: Response) => {
    const program = new Program();
    const url = req.query.url;
    if(url == null) {
      console.log('Url parameter is required');
      res.status(400).send('Url parameter is required');
      return;
    }
    if (typeof url !== "string") {
      res.status(400).send("Query param 'url' has to be of type string");
      return;
    }
    console.log('Starting report for url:', url);
    const result  = await program.reportAsync(url);
    return res.json(result);
  });

  app.listen(port, () => {
    console.log(`[server]: Server is running at http://localhost:${port}`);
  });
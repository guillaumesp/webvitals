import puppeteer, { Browser, Page } from "puppeteer";
import { Program } from "./program.js";


(async () => {
  const program = new Program();
  await program.mainAsync();
})();


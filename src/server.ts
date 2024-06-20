import puppeteer, { Browser, Page } from "puppeteer-core";
import { Program } from "./program.js";


(async () => {
  const program = new Program();
  await program.mainAsync();
})();


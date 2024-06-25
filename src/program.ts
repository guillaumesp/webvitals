import puppeteer, { Browser, Page } from "puppeteer";
import { LightHouseScan, LighthouseResults } from "./LightHouseScan.js";
import { DocumentOutlineIssueDetector, DocumentOutlineIssueDetectorResult } from "./DocumentOutlineIssueDetector.js";
import { BrowserUtils } from "./BrowserUtils.js";


export type TestResult = {
  firstLoadtime: number;
  secondLoadtime: number;
  documentOutlineIssuesResult: DocumentOutlineIssueDetectorResult;
  desktopLighthouseResult: LighthouseResults;
  mobileLighthouseResult: LighthouseResults;
  mobileBase64Screenshot: string;
  desktopBase64Screenshot: string;
}


export class Program {

  public async reportAsync(url: string): Promise<TestResult> {
    const browser = await puppeteer.launch({
      headless: true,
      //defaultViewport: null,
      ignoreDefaultArgs: ['--enable-automation'],
      executablePath: 'c:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe'
    });

    const result = await this.TestUrl(browser, url);

    await browser.close();
    return result;

  }




  private async TestUrl(browser: Browser, url: string): Promise<TestResult> {
    const firstLoadtime = await BrowserUtils.getPageLoadTime(url, browser);
    const secondLoadtime = await BrowserUtils.getPageLoadTime(url, browser);
    const documentOutlineIssuesResult = await DocumentOutlineIssueDetector.detect(url);
    var desktopLighthouseResult = await LightHouseScan.lighthouseScanAsync(url, 'desktop', browser);
    var mobileLighthouseResult = await LightHouseScan.lighthouseScanAsync(url, 'mobile', browser);
    const mobileBase64Screenshot = await BrowserUtils.screenshot(url, browser, 'mobile');
    const desktopBase64Screenshot = await BrowserUtils.screenshot(url, browser, 'desktop');

    return {
      firstLoadtime: firstLoadtime,
      secondLoadtime: secondLoadtime,
      documentOutlineIssuesResult: documentOutlineIssuesResult,
      desktopLighthouseResult: desktopLighthouseResult,
      mobileLighthouseResult: mobileLighthouseResult,
      mobileBase64Screenshot: mobileBase64Screenshot,
      desktopBase64Screenshot: desktopBase64Screenshot
    };
  }





}

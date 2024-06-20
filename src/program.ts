import puppeteer, { Browser, Page } from "puppeteer-core";
import lighthouse, {desktopConfig} from 'lighthouse';
import fs from 'fs';

type LighthouseResults = {
  performance: number;
  accessibility: number;
  bestPractices: number;
  seo: number;
  pwa: number;
  firstContentfulPaint: string;
  speedIndex: string;
  largestContentfulPaint: string;
  timeToInteractive: string;
  totalBlockingTime: string;
  cumulativeLayoutShift: string;
};


export class Program {

  public async mainAsync() {
    const browser = await puppeteer.launch({
      headless: true,
      defaultViewport: null,
      ignoreDefaultArgs: ['--enable-automation'],
      executablePath: 'c:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe'
    });


      const desktopPage = await this.getDesktopPage(browser);
      var desktopTest = await this.lighthouseScanAsync('https://www.euro4x4parts.com', desktopPage);
      console.log(desktopTest);


    await browser.close();


  }


  private async lighthouseScanAsync(url: string, page: Page): Promise<LighthouseResults | undefined> {
    const runnerResult = await lighthouse(url, undefined, desktopConfig, page);
    if (runnerResult == null) {
      console.log('Lighthouse failed');
      return undefined;
    }

    const rawResults = Object.values(runnerResult.lhr.categories);
    return <LighthouseResults>{
      performance: this.toPercent(rawResults.find(c => c.id === 'performance')?.score),
      accessibility: this.toPercent(rawResults.find(c => c.id === 'accessibility')?.score),
      bestPractices: this.toPercent(rawResults.find(c => c.id === 'best-practices')?.score),
      seo: this.toPercent(rawResults.find(c => c.id === 'seo')?.score),
      pwa: this.toPercent(rawResults.find(c => c.id === 'pwa')?.score),
      firstContentfulPaint: runnerResult.lhr.audits['first-contentful-paint'].displayValue,
      speedIndex: runnerResult.lhr.audits['speed-index'].displayValue,
      largestContentfulPaint: runnerResult.lhr.audits['largest-contentful-paint'].displayValue,
      timeToInteractive: runnerResult.lhr.audits['interactive'].displayValue,
      totalBlockingTime: runnerResult.lhr.audits['total-blocking-time'].displayValue,
      cumulativeLayoutShift: runnerResult.lhr.audits['cumulative-layout-shift'].displayValue
    };
  }


  private toPercent(score: number | null | undefined): number {
    if (score == null) {
      return 0;
    }
    return score * 100;
  }

  private async screenshot(url: string, filename: string, page: Page) {
    await page.goto(url);
    await page.screenshot({ path: filename });
  }

  private async getDesktopPage(browser: Browser): Promise<Page> {
    const desktopPage = await browser.newPage();
    desktopPage.setViewport({ width: 1920, height: 1080 });
    return desktopPage;
  };

  private async getMobilePage(browser: Browser): Promise<Page> {
    const desktopPage = await browser.newPage();
    desktopPage.setViewport({ width: 1080, height: 2400 });
    return desktopPage;
  };

}

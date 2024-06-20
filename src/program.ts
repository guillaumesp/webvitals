import puppeteer, { Browser, Page } from "puppeteer-core";
import lighthouse, { desktopConfig } from 'lighthouse';

type PerformanceResults = {
  firstContentfulPaintDisplayValue: string;
  speedIndexDisplayValue: string;
  largestContentfulPaintDisplayValue: string;
  timeToInteractiveDisplayValue: string;
  totalBlockingTimeDisplayValue: string;
  cumulativeLayoutShiftDisplayValue: string;
  firstContentfulPaint: number;
  speedIndex: number;
  largestContentfulPaint: number;
  timeToInteractive: number;
  totalBlockingTime: number;
  cumulativeLayoutShift: number;
}

type LighthouseResults = {
  performanceScore: number;
  performance : PerformanceResults;
  accessibilityScore: number;
  bestPracticesScore: number;
  seoScore: number;
  pwaScore: number;
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
    const mobilePage = await this.getMobilePage(browser);
    var desktopTest = await this.lighthouseScanAsync('https://www.euro4x4parts.com', 'desktop', desktopPage);
    var mobileTest = await this.lighthouseScanAsync('https://www.euro4x4parts.com', 'mobile', mobilePage);
    
    console.log(desktopTest);
    console.log(mobileTest);

    await browser.close();


  }


  private async lighthouseScanAsync(url: string, type: 'desktop' | 'mobile', page: Page): Promise<LighthouseResults | undefined> {
    const runnerResult = await lighthouse(url, undefined, type === 'desktop' ? desktopConfig : undefined, page);
    if (runnerResult == null) {
      console.log('Lighthouse failed');
      return undefined;
    }

    const rawResults = Object.values(runnerResult.lhr.categories);
    return <LighthouseResults>{
      performanceScore: this.toPercent(rawResults.find(c => c.id === 'performance')?.score),
      performance: {
        firstContentfulPaintDisplayValue: runnerResult.lhr.audits['first-contentful-paint'].displayValue,
        speedIndexDisplayValue: runnerResult.lhr.audits['speed-index'].displayValue,
        largestContentfulPaintDisplayValue: runnerResult.lhr.audits['largest-contentful-paint'].displayValue,
        timeToInteractiveDisplayValue: runnerResult.lhr.audits['interactive'].displayValue,
        totalBlockingTimeDisplayValue: runnerResult.lhr.audits['total-blocking-time'].displayValue,
        cumulativeLayoutShiftDisplayValue: runnerResult.lhr.audits['cumulative-layout-shift'].displayValue,
        firstContentfulPaint: runnerResult.lhr.audits['first-contentful-paint'].numericValue,
        speedIndex: runnerResult.lhr.audits['speed-index'].numericValue,
        largestContentfulPaint: runnerResult.lhr.audits['largest-contentful-paint'].numericValue,
        timeToInteractive: runnerResult.lhr.audits['interactive'].numericValue,
        totalBlockingTime: runnerResult.lhr.audits['total-blocking-time'].numericValue,
        cumulativeLayoutShift: runnerResult.lhr.audits['cumulative-layout-shift'].numericValue,

      },
      accessibilityScore: this.toPercent(rawResults.find(c => c.id === 'accessibility')?.score),
      bestPracticesScore: this.toPercent(rawResults.find(c => c.id === 'best-practices')?.score),
      seoScore: this.toPercent(rawResults.find(c => c.id === 'seo')?.score),
      pwaScore: this.toPercent(rawResults.find(c => c.id === 'pwa')?.score),
     
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

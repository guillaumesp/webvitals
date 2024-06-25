import { Browser, Page } from "puppeteer";

export class BrowserUtils {
    public static async getPage(type : 'desktop'|'mobile', browser: Browser): Promise<Page> {
        const page = await browser.newPage();
        if(type === 'desktop') {
          page.setViewport({ width: 1920, height: 1080 });
        } else if(type === 'mobile') {
          page.setViewport({ width: 1080, height: 2400 });
        } else {
          throw new Error('Invalid type');
        }
        return page;
      };

      public static async getPageLoadTime(url: string, browser: Browser, type : 'desktop'|'mobile' = 'desktop'): Promise<number> {
        const page = await this.getPage(type, browser);
        await page.goto(url);
        const metrics = await page.metrics();
        if(metrics.TaskDuration === undefined) {
          throw new Error('Task duration is undefined');
        }
        return metrics.TaskDuration;

      }

      public static async screenshot(url: string, browser: Browser, type : 'desktop'|'mobile' = 'desktop'): Promise<string> {
        const page = await this.getPage(type, browser);
        await page.goto(url);
        const buffer = await page.screenshot({fullPage: true, type: 'jpeg'});
        //to base64 image
        return buffer.toString('base64');
      }
}
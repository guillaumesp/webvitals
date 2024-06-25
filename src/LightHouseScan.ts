import lighthouse, { RunnerResult, desktopConfig } from "lighthouse";
import { Browser } from "puppeteer";
import { BrowserUtils } from "./BrowserUtils.js";

export type PerformanceResults = {
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

export type LighthouseResults = {
    performanceScore: number;
    performance: PerformanceResults;
    accessibilityScore: number;
    bestPracticesScore: number;
    seoScore: number;
    pwaScore: number;
};



export class LightHouseScan {


    public static async lighthouseScanAsync(url: string, type: 'desktop' | 'mobile', browser: Browser): Promise<LighthouseResults> {

        let runnerResult: RunnerResult | undefined;
        if (type === 'desktop') {
            const desktopPage = await BrowserUtils.getPage(type, browser);
            runnerResult = await lighthouse(url, undefined, desktopConfig, desktopPage);
        } else if (type === 'mobile') {
            const mobilePage = await BrowserUtils.getPage(type, browser);
            runnerResult = await lighthouse(url, undefined, undefined, mobilePage);
        } else {
            throw new Error('Invalid type');
        }
        if (runnerResult == null) {
            throw new Error('Lighthouse failed');
        }

        //fs.writeFileSync(`./${type}.json`, JSON.stringify(runnerResult.lhr.audits));
        const rawResults = Object.values(runnerResult.lhr.categories);
        return <LighthouseResults>{
            performanceScore: this.toPercent(rawResults.find(c => c.id === 'performance')?.score),
            performance: {
                firstContentfulPaintDisplayValue: runnerResult.lhr.audits['first-contentful-paint'].displayValue,
                firstContentfulPaint: runnerResult.lhr.audits['first-contentful-paint'].numericValue,
                speedIndexDisplayValue: runnerResult.lhr.audits['speed-index'].displayValue,
                speedIndex: runnerResult.lhr.audits['speed-index'].numericValue,
                largestContentfulPaintDisplayValue: runnerResult.lhr.audits['largest-contentful-paint'].displayValue,
                largestContentfulPaint: runnerResult.lhr.audits['largest-contentful-paint'].numericValue,
                timeToInteractiveDisplayValue: runnerResult.lhr.audits['interactive'].displayValue,
                timeToInteractive: runnerResult.lhr.audits['interactive'].numericValue,
                totalBlockingTimeDisplayValue: runnerResult.lhr.audits['total-blocking-time'].displayValue,
                totalBlockingTime: runnerResult.lhr.audits['total-blocking-time'].numericValue,
                cumulativeLayoutShiftDisplayValue: runnerResult.lhr.audits['cumulative-layout-shift'].displayValue,
                cumulativeLayoutShift: runnerResult.lhr.audits['cumulative-layout-shift'].numericValue,

            },
            accessibilityScore: this.toPercent(rawResults.find(c => c.id === 'accessibility')?.score),
            bestPracticesScore: this.toPercent(rawResults.find(c => c.id === 'best-practices')?.score),
            seoScore: this.toPercent(rawResults.find(c => c.id === 'seo')?.score),
            pwaScore: this.toPercent(rawResults.find(c => c.id === 'pwa')?.score),

        };

    }

    private static toPercent(score: number | null | undefined): number {
        if (score == null) {
            return 0;
        }
        return score * 100;
    }


}
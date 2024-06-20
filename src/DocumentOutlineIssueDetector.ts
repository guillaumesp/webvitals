import { JSDOM } from 'jsdom';

export type DocumentOutlineIssueDetectorResult = {
 HnIssues: string[]|undefined;
ImgIssues: string[]|undefined;
}

export class DocumentOutlineIssueDetector {
    public static async detect(url: string): Promise<DocumentOutlineIssueDetectorResult> {

        const reponse = await fetch(url);
        const html = await reponse.text();
        return <DocumentOutlineIssueDetectorResult>{
            HnIssues: this.findHnDocumentOutlineIssues(html),
            ImgIssues: this.findImgTagsWithoutAlt(html)
        };
    }

    /**
 * Finds hierarchy issues in the document outline.
 * Issues include:
 * - A h2 tag followed by a h4 tag without a h3 tag in between.
 * - A document with no h1 tag.
 * - A document that does not begin with an h1 tag.
 * @param {string} htmlContent - The HTML content of the document.
 * @returns {string[]} An array of messages describing the found issues.
 */
    private static findHnDocumentOutlineIssues(htmlContent: string): string[]|undefined {
        const dom = new JSDOM(htmlContent);
        const document = dom.window.document;
        const headings = document.querySelectorAll('h1, h2, h3, h4, h5, h6');
        const issues: string[] = [];

        // Check for no h1 tag
        if (!document.querySelector('h1')) {
            issues.push('Document has no h1 tag.');
        }

        // Check if the document does not begin with an h1 tag
        if (headings.length > 0 && headings[0].tagName.toLowerCase() !== 'h1') {
            issues.push('Document does not begin with an h1 tag.');
        }

        // Check for hierarchy issues
        let previousLevel = 0;
        headings.forEach(heading => {
            const currentLevel = parseInt(heading.tagName.substring(1), 10);

            if (currentLevel - previousLevel > 1 && previousLevel !== 0) {
                issues.push(`Hierarchy issue: ${heading.tagName} follows ${'H' + previousLevel} without an intermediate level.`);
            }
            previousLevel = currentLevel;
        });
        return issues.length > 0 ? issues : undefined;
    }

    /**
 * Analyzes HTML content and finds issues with image tags without alt attributes.
 * @param {string} htmlContent - The HTML content to be analyzed.
 * @returns {string[]} An array of messages describing the found issues.
 */
private static findImgTagsWithoutAlt(htmlContent: string): string[]|undefined {
    const dom = new JSDOM(htmlContent);
    const document = dom.window.document;
    const images = document.querySelectorAll('img');
    const issues: string[] = [];

    images.forEach((img, index) => {
        if (!img.hasAttribute('alt')) {
            issues.push(`Image with src : ${img.src.slice(-30)} is missing an alt attribute.`);
        }
    });

    return issues.length > 0 ? issues : undefined;
}

}
import puppeteer from 'puppeteer';

(async () => {
    try {
        const browser = await puppeteer.launch({ headless: "new" });
        const page = await browser.newPage();

        // Capture console messages
        page.on('console', msg => console.log('BROWSER CONSOLE:', msg.type(), msg.text()));

        // Capture unhandled errors
        page.on('pageerror', error => console.error('BROWSER ERROR:', error.message));

        console.log('Navigating to localhost:5173...');
        await page.goto('http://localhost:5173', { waitUntil: 'networkidle2' });

        console.log('Page loaded. Waiting a couple of seconds...');
        await new Promise(resolve => setTimeout(resolve, 2000));

        await browser.close();
        console.log('Done.');
    } catch (e) {
        console.error('SCRIPT ERROR:', e);
    }
})();

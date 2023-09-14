import fs from 'fs-extra';
import path from "path";
import { launch } from 'puppeteer';
import random from "./random.js";

export default async function savePage(url) {

    let browser

    try {

        let __dirname = path.resolve();
        let config = fs.readJSONSync(path.join(__dirname, './config.json'));
        let launchOptions = {
            headless: "new",
            args: ['--no-sandbox'],
            executablePath: config?.executablePath
        };

        browser = await launch(launchOptions).catch(e => console.log('Error: browser is not launch ', e));
        let page = await browser?.newPage();
        page?.setDefaultNavigationTimeout(600000);
        let response = await page?.goto(url, {
            waitUntil: 'load',
            timeout: 600000
        });

        if (response?.status() === 200) {

            // let filename = `${random(18)}.html`
            let bt = '#nav-description > div:nth-child(2) > button';
            // await page?.click(bt);
            let more = await page?.waitForSelector(bt);
            await more.click();
            // let pageHtml = await page.content();
            let pageHtml = await page.evaluate(() => document.querySelector('*').outerHTML);
            // await fs.writeFile(path.join(__dirname, `./pages/${filename}`), pageHtml).catch(e => console.log(`Error: write file ${filename} `, e));
            // let readFile = await fs.readFile(path.join(__dirname, `./pages/${filename}`), "utf8").catch(e => console.log(`Error: read file ${filename} `, e));

            let pages = await browser?.pages();
            await Promise.all(pages.map(page => page?.close()));
            await browser?.close();

            return {
                html: pageHtml, // readFile,
                // filename: filename,
                status: response?.status()
            }
        }

        else {
            console.log(`${url}\n\n response.status : `, response?.status());

            return {
                html: null,
                // filename: null,
                status: response?.status()
            }
        }


    } catch (error) {
        console.log(error);
        return {
            error: error.toString()
        }
    } finally {

        await browser?.close();
    }


}
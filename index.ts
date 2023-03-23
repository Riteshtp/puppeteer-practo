import puppeteer, { Page } from 'puppeteer';
import { PASS, RETRIES, USER } from './config';
import { loadJsonFromFile } from './utils';

export type ItemType = {
    name: string;
    type: string;
    dispensible_unit: string;
    manufacturer: string;
    prefix?: string | null;
    reorder: string | number;
};
async function loginToPracto(page: Page, user: string, pass: string) {
    await page.goto('https://accounts.practo.com/login');
    await page.type('#username', user);
    await page.type('#password', pass);

    // Click the login button
    await page.click('#login');
    await page.waitForNavigation({ waitUntil: 'networkidle2' });
    console.log('Logged In.');
}
async function enterDataIntoInput(page: Page, selector: string, data: string) {
    await page.waitForSelector(selector);
    await page.type(selector, data);
}

async function enterDataIntoSelect(page: Page, selector: string, data: string) {
    await page.waitForSelector(selector);
    await page.select(selector, data);
}

async function goToAddPage(page: Page, isAddPage: boolean, currRetries = 0) {
    if (isAddPage) {
        console.log(`All good. Entering data...`);
        return;
    }
    if (currRetries > RETRIES)
        throw new Error(
            `Failed To Navigate to /add page even after ${RETRIES} tries.`
        );
    await page.goto('https://ray.practo.com/inventory#/items/add', {
        waitUntil: 'networkidle2',
    });
    let checkAddPage = true;
    try {
        await page.waitForSelector('#inventory', { timeout: 1000 });
    } catch {
        checkAddPage = false;
    }
    await goToAddPage(page, checkAddPage, currRetries + 1);
}

async function submitForm(page: Page) {
    for (let index = 0; index < 45; index++) {
        await page.keyboard.press('Tab');
    }
    await page.keyboard.press('Enter');
    await page.waitForNavigation({ waitUntil: 'networkidle2' });
}

(async () => {
    const data = await loadJsonFromFile('data.json');
    const browser = await puppeteer.launch({ headless: false });
    const page = await browser.newPage();
    // Set screen size
    // await page.setViewport({ width: 1920, height: 1080 });
    try {
        await loginToPracto(page, USER, PASS);

        //check if page is on the correct URL;
        // const isAddPage = page.url().endsWith('/items/add');
        let index = 0;

        let arrayOfItems: Array<ItemType> = data;
        let numberOfItems = arrayOfItems.length;
        console.log(`Trying to enter ${numberOfItems} items...`);
        while (index < numberOfItems) {
            let item = arrayOfItems[index]; //object- in -array
            await goToAddPage(page, false, 0);
            try {
                //item-name
                try {
                    await page.waitForSelector(
                        'body > div.introjs-helperLayer > div > div.introjs-tooltipbuttons > a.introjs-button.introjs-skipbutton',
                        { timeout: 10000 }
                    );
                    await page.click(
                        'body > div.introjs-helperLayer > div > div.introjs-tooltipbuttons > a.introjs-button.introjs-skipbutton'
                    );
                } catch (e) {}
                await enterDataIntoInput(
                    page,
                    'input[ng-model="item.name"]',
                    item.name
                );
                try {
                    await page.waitForSelector(
                        'body > div.introjs-helperLayer > div > div.introjs-tooltipbuttons > a',
                        { timeout: 2000 }
                    );
                    await page.click(
                        'body > div.introjs-helperLayer > div > div.introjs-tooltipbuttons > a'
                    );
                } catch (e) {}

                await enterDataIntoSelect(
                    page,
                    'select[ng-model="item.type"]',
                    item.type.toLowerCase()
                );
                await enterDataIntoInput(
                    page,
                    'input[ng-model="item.dispensable_unit"]',
                    item.dispensible_unit
                );
                await enterDataIntoInput(
                    page,
                    'input[ng-model="item.reorder_level"]',
                    String(item.reorder)
                ),
                    //pseudo select by search and enter
                    await page.waitForSelector('.chzn-search>input[type=text]');
                await page.type(
                    '.chzn-search>input[type=text]',
                    item.manufacturer
                );
                try {
                    await page.waitForSelector(
                        'body > div.introjs-helperLayer > div > div.introjs-tooltipbuttons > a.introjs-button.introjs-skipbutton',
                        { timeout: 2000 }
                    );
                    await page.click(
                        'body > div.introjs-helperLayer > div > div.introjs-tooltipbuttons > a.introjs-button.introjs-skipbutton'
                    );
                } catch (e) {}
                await page.focus('.chzn-search>input[type=text]');
                await page.keyboard.press('Enter');

                if (item.type.toLowerCase() === 'drug') {
                    //select by iterating through options
                    await page.waitForSelector(
                        'select[ng-model="item.drug.prefix"]'
                    );
                    const drug_prefix = await page.$(
                        'select[ng-model="item.drug.prefix"]'
                    );
                    if (!drug_prefix) {
                        throw new Error('no drug prefix');
                    }
                    const options = await drug_prefix.$$eval(
                        'option',
                        (options) =>
                            options.map(({ value, text }) => {
                                return {
                                    value,
                                    text,
                                };
                            })
                    );
                    // Select the first option in the select element
                    const toBeSelected = options.find(
                        (opt) =>
                            opt.text.toLowerCase() ===
                            item.prefix?.toLowerCase()
                    );

                    if (!toBeSelected) {
                        throw new Error(
                            'No dispensible unit select option found'
                        );
                    }
                    await drug_prefix.select(toBeSelected.value);
                }
                index++;
                // await submitForm(page);
            } catch (e) {
                console.error(e);
                break;
            }
            console.log(`Inserted item - ${item.name} ...`);
        }
        console.log('Completed! :+1:');
        // await browser.close();
    } catch {}
})();
//IIFE

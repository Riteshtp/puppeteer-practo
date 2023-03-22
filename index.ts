import puppeteer from 'puppeteer'
;(async () => {
    const browser = await puppeteer.launch({ headless: false })
    const page = await browser.newPage()
    // Set screen size

    // await page.setViewport({ width: 1080, height: 1024 })
    await page.goto('https://accounts.practo.com/login')
    await page.type('#username', 'DUMMY')
    await page.type('#password', 'DUMMY')
    // Click the login button
    await page.click('#login')

    await page.waitForNavigation({ waitUntil: 'networkidle2' })
    // const addPage = await browser.newPage();
    await page.goto('https://ray.practo.com/inventory#/items/add', {
        waitUntil: 'networkidle2',
    })
    await page.goto('https://ray.practo.com/inventory#/items/add', {
        waitUntil: 'networkidle2',
    })

    await page.waitForSelector('input[ng-model="item.name"]')

    await page.type('input[ng-model="item.name"]', 'Ritesh')
    await page.waitForSelector(
        'body > div.introjs-helperLayer > div > div.introjs-tooltipbuttons > a'
    )
    await page.click(
        'body > div.introjs-helperLayer > div > div.introjs-tooltipbuttons > a'
    )
    await page.waitForSelector('select[ng-model="item.type"]')
    await page.select('select[ng-model="item.type"]', 'Drug')
    await page.waitForSelector('input[ng-model="item.dispensable_unit"]')
    await page.type('input[ng-model="item.dispensable_unit"]', 'Bottle')
    await page.waitForSelector('.chzn-search>input[type=text]')
    await page.type('.chzn-search>input[type=text]', 'SDL')
    await page.waitForSelector(
        'body > div.introjs-helperLayer > div > div.introjs-tooltipbuttons > a.introjs-button.introjs-skipbutton'
    )
    await page.click(
        'body > div.introjs-helperLayer > div > div.introjs-tooltipbuttons > a.introjs-button.introjs-skipbutton'
    )

    await page.focus('.chzn-search>input[type=text]')
    await page.keyboard.press('Enter')
    await page.waitForSelector('input[ng-model="item.drug.visible"]')
    await page.$eval(
        'input[ng-model="item.drug.visible"]',
        (check) => ((check.checked as any) = false)
    )

    await page.waitForSelector(
        '#inventory > div > div:nth-child(2) > ng:view > div.headerwrap.ng-scope > div:nth-child(1) > div > div.floatright.submenu > div > span.buttons > a.button.button.primary.leftmargin_10'
    )
    await page.click(
        '#inventory > div > div:nth-child(2) > ng:view > div.headerwrap.ng-scope > div:nth-child(1) > div > div.floatright.submenu > div > span.buttons > a.button.button.primary.leftmargin_10'
    )
    // await page.waitForSelector('select[ng-model="item.manufacturer_id"]')
    // const manufacturer_id_select = await page.$(
    //     'select[ng-model="item.manufacturer_id"]'
    // )
    // if (!manufacturer_id_select) {
    //     throw new Error('No manufacturer ID select')
    // }
    // const options = await manufacturer_id_select.$$eval('option', (options) =>
    //     options.map(({ value, text }) => {
    //         return {
    //             value,
    //             text,
    //         }
    //     })
    // )
    // console.log(options)

    // // Select the first option in the select element
    // const toBeSelected = options.find((opt) => opt.text === 'SDL')
    // if (!toBeSelected) {
    //     throw new Error('No manufacturer ID select option found')
    // }
    // console.log(toBeSelected)
    // await manufacturer_id_select.select(toBeSelected.value + 1)

    // await page.select('select[ng-model="item.manufacturer_id"]', 'SDL')
    // console.log('Logged In.')
    // await browser.close();
})()

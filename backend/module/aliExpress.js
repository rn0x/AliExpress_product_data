import fetch from 'node-fetch';
import { JSDOM } from "jsdom";
import { CookieJar } from "tough-cookie";

/**
 * إرجاع معلومات عن المنتج مثل الإسم والسعر والوصف الخ...
 * by rn0x
 * @param {string|number} input 
 * @param {"en"|"ar"|"fr"|"it"|"de"|"es"|"tr"|"vi"|"he"|"th"|"pl"|"nl"|"ko"|"ja"|"pt"} language 
 * @returns 
 */

export default async function aliExpress(input, language) {

    if (isAaliExpress(input) || isNumber(input)) {

        let cookieJar = new CookieJar();
        let lang = language === "en" ? "www" : language;
        let productId = isLink(input) ? extractNumber(input) : input;
        let url = `https://${lang?.toLowerCase()}.aliexpress.com/item/${productId}.html`;
        let options = {};
        options.headers = {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:109.0) Gecko/20100101 Firefox/117.0', // تحديد رأس User-Agent
            'Accept-Language': 'ar,en-US;q=0.7,en;q=0.3', // تحديد رأس Accept-Language
            'Cookie': cookieJar?.getCookieStringSync(url)
            // يمكنك تحديد المزيد من الرؤوس حسب الحاجة
        }
        options.follow = 10;
        let response = await fetch(url, options);
        let setCookieHeaders = response?.headers?.raw()?.['set-cookie'];
        setCookieHeaders?.forEach(setCookieHeader => {
          cookieJar?.setCookieSync(setCookieHeader, url);
        });
        let body = await response?.text();

        if (response?.status === 200 && body) {

            // إنشاء كائن DOM باستخدام JSDOM وتمكين تشغيل النص البرمجي بشكل خطير

            let dom = new JSDOM(body, { runScripts: "dangerously" });
            let dataValue = dom.window?.runParams?.data;

            if (dataValue) {

                let Obj = {
                    title: dataValue?.metaDataComponent?.title,
                    description: dataValue?.metaDataComponent?.description,
                    keywords: dataValue?.metaDataComponent?.keywords,
                    categoryUrl: dataValue?.categoryComponent?.categoryUrl,
                    categoryName: dataValue?.categoryComponent?.categoryName,
                    productId: dataValue?.productInfoComponent?.id,
                    tradeCount: dataValue?.tradeComponent?.formatTradeCount,
                    storeInfo: {
                        name: dataValue?.sellerComponent?.storeName,
                        companyId: dataValue?.sellerComponent?.companyId,
                        storeNumber: dataValue?.sellerComponent?.storeNum,
                        storeURL: dataValue?.sellerComponent?.storeURL,
                        storeLogo: dataValue?.sellerComponent?.storeLogo
                    },
                    images: dataValue?.imageComponent,
                    salePrice: {
                        actCurrencyFormatPrice: dataValue?.priceComponent?.discountPrice?.actCurrencyFormatPrice,
                        minActivityAmount: dataValue?.priceComponent?.discountPrice?.minActivityAmount,
                        maxActivityAmount: dataValue?.priceComponent?.discountPrice?.maxActivityAmount
                    },
                    origPrice: {
                        minAmount: dataValue?.priceComponent?.origPrice?.minAmount,
                        maxAmount: dataValue?.priceComponent?.origPrice?.maxAmount,
                    }
                }

                return Obj

            }

            else {
                return {
                    error: "لايوجد معلومات عن المنتج !!\n\nهل قمت بإدخال معرف المنتج او الرابط بشكل صحيح ؟"
                }
            }

        }

        else {

            return {
                error: response?.status
            }

        }

    }

    else {
        return {
            error: "تأكد من كتابة الرابط او معرف المنتج"
        }
    }

}

function extractNumber(input) {
    let regex = /\d+/;
    let match = input.match(regex);
    if (match) {
        return match[0];
    } else {
        return null;
    }
}

function isLink(text) {
    if (typeof text !== 'string') {

        return false
    }

    else {
        let pattern = new RegExp('^(https?:\\/\\/)?' + // protocol
            '((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|' + // domain name
            '((\\d{1,3}\\.){3}\\d{1,3}))' + // OR ip (v4) address
            '(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*' + // port and path
            '(\\?[;&a-z\\d%_.~+=-]*)?' + // query string
            '(\\#[-a-z\\d_]*)?$', 'i'); // fragment locator
        return !!pattern.test(text);
    }
}

function isAaliExpress(text) {
    return text?.includes("aliexpress.com/item")
}

function isNumber(input) {
    return !isNaN(input);
}
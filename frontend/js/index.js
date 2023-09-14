

let input_bt = document.getElementById("input_bt");
let logo = document.getElementById("logo");

logo.addEventListener("click", async e => {
    window.location = "./index.html"
});

input_bt.addEventListener("click", async e => {

    e.preventDefault();

    let alertEl = document.getElementById("alert");
    let loding = document.getElementById("loding");
    let input_bt = document.getElementById("input_bt");
    let input_link_id = document.getElementById("input_link_id");
    let info_data = document.getElementById("info_data");
    loding.style.display = "block";
    let aliexpress = await fetch("https://api.alsarmad.org/aliexpress", {
        method: "POST",
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            input: input_link_id?.value,
            language: "ar"
        }),
    });

    let json = await aliexpress?.json()

    if (!json?.error && json?.title !== undefined) {

        let body_input = document.getElementById("body_input");
        let title_m = document.getElementById("title_m");
        let description_m = document.getElementById("description_m");
        let keywords_m = document.getElementById("keywords_m");
        let categoryName_m = document.getElementById("categoryName_m");
        let categoryUrl_m = document.getElementById("categoryUrl_m");
        let productId_m = document.getElementById("productId_m");
        let tradeCount_m = document.getElementById("tradeCount_m");
        let storeInfo_name_m = document.getElementById("storeInfo_name_m");
        let storeInfo_companyId_m = document.getElementById("storeInfo_companyId_m");
        let storeInfo_storeURL_m = document.getElementById("storeInfo_storeURL_m");
        let storeInfo_storeNumber_m = document.getElementById("storeInfo_storeNumber_m");
        let storeInfo_storeLogo_m = document.getElementById("storeInfo_storeLogo_m");
        let actCurrencyFormatPrice_m = document.getElementById("actCurrencyFormatPrice_m");
        let minActivityAmount_m = document.getElementById("minActivityAmount_m");
        let maxActivityAmount_m = document.getElementById("maxActivityAmount_m");
        let images_aliExpress = document.getElementById("images_aliExpress");

        loding.style.display = "none";
        body_input.style.display = "none";
        info_data.style.display = "block";
        title_m.innerText = json?.title ? json?.title : "لايوجد";
        description_m.innerText = json?.description ? json?.description : "لايوجد";
        keywords_m.innerText = json?.keywords ? json?.keywords : "لايوجد";
        categoryName_m.innerText = json?.categoryName ? json?.categoryName : "لايوجد";
        categoryUrl_m.innerText = json?.categoryUrl ? `https:${json?.categoryUrl}` : "لايوجد";
        productId_m.innerText = json?.productId ? json?.productId : "لايوجد";
        tradeCount_m.innerText = json?.tradeCount ? json?.tradeCount : "لايوجد";
        storeInfo_name_m.innerText = json?.storeInfo?.name ? json?.storeInfo?.name : "لايوجد";
        storeInfo_companyId_m.innerText = json?.storeInfo?.companyId ? json?.storeInfo?.companyId : "لايوجد";
        storeInfo_storeURL_m.innerText = json?.storeInfo?.storeURL ? `https:${json?.storeInfo?.storeURL}` : "لايوجد";
        storeInfo_storeNumber_m.innerText = json?.storeInfo?.storeNumber ? json?.storeInfo?.storeNumber : "لايوجد";
        storeInfo_storeLogo_m.innerText = json?.storeInfo?.storeLogo ? json?.storeInfo?.storeLogo : "لايوجد";
        actCurrencyFormatPrice_m.innerText = json?.salePrice?.actCurrencyFormatPrice ? json?.salePrice?.actCurrencyFormatPrice : "لايوجد";
        minActivityAmount_m.innerText = json?.salePrice?.minActivityAmount?.formatedAmount ? json?.salePrice?.minActivityAmount?.formatedAmount : "لايوجد";
        maxActivityAmount_m.innerText = json?.salePrice?.maxActivityAmount?.formatedAmount ? json?.salePrice?.maxActivityAmount?.formatedAmount : "لايوجد";

        for (let item of json?.images?.imagePathList) {

            let image = document.createElement("img");
            images_aliExpress.appendChild(image);
            image.className = "images_h";
            image.src = item
        }
    }

    else {


        if (json?.title === undefined && !json?.error) {
            alertEl.innerText = "تأكد من كتابة الرابط او رقم المنتج بشكل صحيح";
            loding.style.display = "none";
            alertEl.style.display = "block"
            input_link_id.style.display = "none"
            input_bt.style.display = "none"
            await new Promise(r => setTimeout(r, 6000));
            alertEl.style.display = "none";
            window.location = "./index.html"

        }

        else {
            alertEl.innerText = json?.error;
            loding.style.display = "none";
            alertEl.style.display = "block";
            input_link_id.style.display = "none"
            input_bt.style.display = "none"
            await new Promise(r => setTimeout(r, 6000));
            alertEl.style.display = "none";
            window.location = "./index.html"

        }
    }
});
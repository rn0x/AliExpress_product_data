import fs from 'fs-extra';
import path from "path";
import random from "./module/random.js";
import aliExpress from "./module/aliExpress.js";
import getBuffer from "./module/getBuffer.js";
import RemoveBg from "./module/RemoveBg.js";
import express from "express";
import bodyParser from "body-parser";
import cors from "cors";

let __dirname = path.resolve();
let app = express();
let port = 4000;

app.use(bodyParser.json({ limit: '200mb' }));
app.use(cors());


// تحقق اذا لايوجد مجلد files قم بإنشائه

if (fs.existsSync(path.join(__dirname, "./files")) === false) {

    fs.mkdirSync(path.join(__dirname, "./files"), { recursive: true });
    
}



// الصفحة الرئيسية

app.get('/', (req, res) => {

    res.send("الواجهة الخلفية لـ جلب المنتاجات من علي إكسبريس")
});


// حذف خلفية الصورة 

app.post('/upload', async (req, res) => {

    let buffer = Buffer.from(req?.body?.bash64, 'base64');
    let filename = `${random(15)}-${req?.body?.filename}`;
    await fs.writeFile(path.join(__dirname, `files/${filename}`), buffer).catch(e => { console.log(e) });
    let remove = await RemoveBg({
        filename: path.join(__dirname, `./files/${filename}`),
        output: path.join(__dirname, `./files/removeBg-${filename}.png`)
    }).catch(e => { console.log(e) });
    await new Promise(r => setTimeout(r, 2000));
    let outputBuffer = await fs.readFile(path.join(__dirname, `./files/removeBg-${filename}.png`)).catch(e => { console.log(e) });
    res.json({
        ...remove,
        base64: Buffer?.from(outputBuffer)?.toString('base64')
    });

    // حذف الصورة الأصلية والصورة المفرغة بعد دقيقة 
    await new Promise(r => setTimeout(r, 60000));
    await fs.remove(path.join(__dirname, `./files/removeBg-${filename}.png`)).catch(e => { console.log(e) });
    await fs.remove(path.join(__dirname, `./files/${filename}`)).catch(e => { console.log(e) });

    console.log("finish removeBG");

});


// معلومات المنتج - علي إكسبريس

app.post('/aliexpress', async (req, res) => {

    let input = req?.body?.input;
    let language = req?.body?.language;
    let aliExpressOBJ = await aliExpress(input, language).catch(e => { console.log(e) });
    res.json(aliExpressOBJ);
});

// إحضار المخزون المؤقت من عنوان الصورة او الملف 

app.post('/getBuffer', async (req, res) => {

    let url = req?.body?.url;
    let buffer = await getBuffer(url).catch(e => { console.log(e) });

    if (buffer) {
        res.json({
            buffer: buffer,
            base64: Buffer?.from(buffer)?.toString('base64')
        });
    }

    else {
        res.json({
            error: "تأكد من إدخال الرابط بشكل صحيح !!"
        });
    }
    
});

app.listen(port, () => {
    console.log(`Example app listening on port ${port} \nhttp://localhost:${port}`)
});
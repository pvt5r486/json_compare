const fs = require('fs');
const path = require('path');

const filterSameKey = (aKeyArray, bKeyArray) => {
    const sameKey = [];
    aKeyArray.forEach((itemA) => {
        if (bKeyArray.indexOf(itemA) !== -1) {
            const findIdx = bKeyArray.indexOf(itemA)
            sameKey.push(bKeyArray[findIdx]);
        }
    });
    return sameKey;
}

const readFile = (filePath, fileName) => {
    return new Promise((resolve, reject) => {
        fs.readFile(path.join(filePath, `/${fileName}`), (err, data) => {
            if (err) {
                reject(`路徑[ ${filePath} ]下找不到[ ${fileName} ]，請檢查設定檔是否有誤 或 檔案是否存在`);
            } else {
                resolve(JSON.parse(data.toString()));
            }
        });
    });
}

const writeFile = (filePath, data) => {
    return new Promise((resolve, reject) => {
        fs.writeFile(filePath, data, (err) => {
            if (err) {
                reject(err);
            } else {
                console.log(`檔案 ${path.basename(filePath)} 已建立`);
                resolve();
            }
        });
    })
}

const checkFile = (filePath) => {
    return new Promise((resolve, reject) => {
        fs.access(filePath, (err) => {
            if (err) {
                reject(`檢測到設定的訪問路徑 ${filePath} 不存在，將進行環境的初始化`);
            } else {
                resolve();
            }
        });
    })
}

const makeFolder = (filePath) => {
    return new Promise((resolve, reject) => {
        fs.mkdir(filePath, (err) => {
            if (err) {
                reject('發生預期外的錯誤');
            } else {
                console.log(`資料夾 ${path.basename(filePath)} 已建立`);
                resolve();
            }
        });
    })
}

const copy = (from, to) => {
    fs.writeFileSync(to, fs.readFileSync(from));
    console.log(`檔案 ${path.basename(to)} 已建立`);
}

module.exports = {
    filterSameKey,
    readFile,
    writeFile,
    checkFile,
    makeFolder,
    copy
};
const util = require('./util');
const path = require('path');

const run = async (config) => {
    const {
        inputPath,
        outputPath,
        needParse,
        parsedFileName,
        originFileName,
        replaceFileName,
        outputReplacedFileName
    } = config

    const replaceFile = await util.readFile(inputPath, replaceFileName).catch((err) => {
        console.log(err);
    });

    const originFile = await util.readFile(inputPath, originFileName).catch((err) => {
        console.log(err);
    });

    if (replaceFile && originFile) {
        if (needParse === 'true') {
            const parsedData = parse(replaceFile);
            await util.writeFile(path.join(outputPath, `/${parsedFileName}`), JSON.stringify(parsedData));
            const replaceResult = replaceOriginData(originFile, parsedData);
            await util.writeFile(path.join(outputPath, `/${outputReplacedFileName}`), JSON.stringify(replaceResult));
        }

        if (needParse === 'false') {
            const replaceResult = replaceOriginData(originFile, replaceFile);
            await util.writeFile(path.join(outputPath, `/${outputReplacedFileName}`), JSON.stringify(replaceResult));
        }
    }
}

function parse(obj) {
    const keys = Object.keys(obj);
    const result = {};
    for (let key of keys) {
        if (typeof obj[key] === 'object') {
            result[key] = parse(obj[key]);
        } else {
            return obj[key];
        }
    };
    return result;
}

function replaceOriginData(originObj, replaceObj) {
    let originData = originObj;
    const originKeyArray = Object.keys(originObj);
    const replaceKeyArray = Object.keys(replaceObj);
    const sameKeyArray = util.filterSameKey(originKeyArray, replaceKeyArray);
    for (let key of sameKeyArray) {
        if (typeof originObj[key] === 'object' && typeof replaceObj[key] === 'object') {
            originData[key] = replaceOriginData(originObj[key], replaceObj[key])
        } else {
            if (originObj[key] !== replaceObj[key]) {
                originData[key] = replaceObj[key]
            } else {
                originData[key] = originObj[key]
            }
        }
    }
    return originData;
}

module.exports = {
    run
};
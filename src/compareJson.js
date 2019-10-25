const util = require('./util');

const run = async (config) => {
    const { 
        compareFileA,
        compareFileB,
        compareMarkA,
        compareMarkB,
        inputPath,
        outputPath,
        outputFileName
    } = config

    const compareDataA = await util.readFile(inputPath, compareFileA).catch((err) => {
        console.log(err);
    });
    const compareDataB = await util.readFile(inputPath, compareFileB).catch((err) => {
        console.log(err);
    });;

    if (compareDataA && compareDataB) {
        const diffValueResult = returnDiffValueJsonStr(compareDataA, compareMarkA, compareDataB, compareMarkB);
        await util.writeFile(`${outputPath}/${outputFileName}`, diffValueResult);
    }
}

function returnDiffValueJsonStr(compareA, compareMarkA, compareB, compareMarkB) {
    const aKeyArray = Object.keys(compareA);
    const bKeyArray = Object.keys(compareB);
    const sameKeyArray = util.filterSameKey(aKeyArray, bKeyArray);
    const result = {};
    sameKeyArray.forEach((key) => {
        if (typeof compareA[key] === 'object' && typeof compareB[key] === 'object') {
            const _result = JSON.parse(returnDiffValueJsonStr(compareA[key], compareMarkA, compareB[key], compareMarkB));
            if (Object.keys(_result).length !== 0) {
                result[key] = _result
            }
        } else {
            if (compareA[key] !== compareB[key]) {
                result[key] = {
                    [compareMarkA]: compareA[key],
                    [compareMarkB]: compareB[key],
                }
            }
        }
    });
    return JSON.stringify(result);
}

module.exports = {
    run
};
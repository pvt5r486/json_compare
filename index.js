#!/usr/bin/env node
const dovenv = require('dotenv');
const process = require('process');
const path = require('path');
const os = require('os');
const compare = require('./src/compareJson');
const parseAndReplace = require('./src/parseAndReplaceJson');
const util = require('./src/util');

(async function () {
    let inputPath = '';
    let outputPath = '';
    let configPath = '';
    if (os.platform() === 'win32') {
        inputPath = path.join(os.homedir(), '/Documents/jsonCompare_input');
        outputPath = path.join(os.homedir(), '/Documents/jsonCompare_output');
        configPath = path.join(os.homedir(), '/Documents/jsonCompare_config.env');
    } else {
        inputPath = path.join(os.homedir(), '/jsonCompare_input');
        outputPath = path.join(os.homedir(), '/jsonCompare_output');
        configPath = path.join(os.homedir(), '/jsonCompare_config.env');
    }

    await util.checkFile(configPath).catch(async (err) => {
        console.log(err);
        util.copy(path.join(__dirname, '/.env'), configPath);
    });

    dovenv.config({
        path: configPath
    });

    const pathArray = [inputPath, outputPath];
    for (folderPath of pathArray) {
        await util.checkFile(folderPath).catch(async (err) => {
            console.log(err);
            await util.makeFolder(folderPath).catch((err) => {
                console.log(err);
            });
        });
    }

    const compareConfig = {
        compareFileA: process.env.COMPARE_FILE_A,
        compareFileB: process.env.COMPARE_FILE_B,
        compareMarkA: process.env.COMPARE_MARK_A,
        compareMarkB: process.env.COMPARE_MARK_B,
        inputPath: inputPath,
        outputPath: outputPath,
        outputFileName: process.env.OUTPUT_FILE_NAME
    }

    const parseAndReplaceConfig = {
        inputPath: inputPath,
        outputPath: outputPath,
        needParse: process.env.NEEDPARSE,
        parsedFileName: process.env.PARSED_FILE_NAME,
        originFileName: process.env.ORIGIN_FILE_NAME,
        replaceFileName: process.env.REPLACE_FILE_NAME,
        outputReplacedFileName: process.env.OUTPUT_REPLACE_FILE_NAME
    }

    switch (process.argv[2]) {
        case '--compare':
            compare.run(compareConfig);
            break;
        case '--replace':
            parseAndReplace.run(parseAndReplaceConfig);
            break;
        default:
            console.log('請附上 [--compare] 或 [--replace] 參數進行後續操作');
            break;
    }
})();



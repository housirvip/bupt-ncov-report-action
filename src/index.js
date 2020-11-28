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
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
exports.__esModule = true;
var core = require("@actions/core");
var got_1 = require("got");
var tough_cookie_1 = require("tough-cookie");
var utils_1 = require("./utils");
var commander = require("commander");
// for BUPT
var PREFIX_URL = "https://app.bupt.edu.cn";
var LOGIN = "uc/wap/login/check";
var GET_REPORT = "ncov/wap/default/index";
var POST_REPORT = "ncov/wap/default/save";
var RETRY = 100;
var TIMEOUT = 2000;
var program = commander.program
    .version('0.0.1')
    .option('-u, --user [value]', 'BUPT username')
    .option('-p, --pass [value]', 'BUPT password')
    .option('-s, --server [value]', 'ServerJ push key')
    .parse(process.argv);
// for ServerJ
var serverJ = program.server;
// for user
var USER = program.user;
var PASS = program.pass;
// console.log(program.user)
// console.log(program.pass)
// console.log(program.server)
function sendNotify(text) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, got_1["default"].post("https://sc.ftqq.com/" + serverJ + ".send", {
                        form: {
                            text: '疫情防控上报成功' + new Date().toLocaleDateString(),
                            desp: text
                        },
                        responseType: 'json'
                    }).then(function (res) {
                        console.log(res.body);
                    })["catch"](function (err) {
                        console.log(err);
                    })];
                case 1:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    });
}
// sendNotify('asd', 'asd')
function login(loginForm) {
    return __awaiter(this, void 0, void 0, function () {
        var cookieJar, client, response;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    cookieJar = new tough_cookie_1.CookieJar();
                    client = got_1["default"].extend({
                        prefixUrl: PREFIX_URL,
                        cookieJar: cookieJar,
                        retry: RETRY,
                        timeout: TIMEOUT
                    });
                    return [4 /*yield*/, client.post(LOGIN, { form: loginForm })];
                case 1:
                    response = _a.sent();
                    if (response.statusCode != 200) {
                        throw new Error("login \u8BF7\u6C42\u8FD4\u56DE\u4E86 " + response.statusCode);
                    }
                    return [2 /*return*/, client];
            }
        });
    });
}
function getDailyReportFormData(client) {
    var _a, _b, _c, _d;
    return __awaiter(this, void 0, void 0, function () {
        var response, newForm, oldForm, geo, province, city, area, address;
        return __generator(this, function (_e) {
            switch (_e.label) {
                case 0: return [4 /*yield*/, client.get(GET_REPORT)];
                case 1:
                    response = _e.sent();
                    if (response.statusCode != 200) {
                        throw new Error("getFormData \u8BF7\u6C42\u8FD4\u56DE\u4E86 " + response.statusCode);
                    }
                    if (response.body.indexOf("登录") != -1) {
                        throw new Error("登录失败；请检查用户名与密码是否正确");
                    }
                    newForm = JSON.parse((_b = (_a = /var def = (\{.+\});/.exec(response.body)) === null || _a === void 0 ? void 0 : _a[1]) !== null && _b !== void 0 ? _b : "");
                    oldForm = JSON.parse((_d = (_c = /oldInfo: (\{.+\}),/.exec(response.body)) === null || _c === void 0 ? void 0 : _c[1]) !== null && _d !== void 0 ? _d : "");
                    if (oldForm.geo_api_info === undefined) {
                        throw new Error("昨天的信息不完整；请手动填报一天后继续使用本脚本");
                    }
                    geo = JSON.parse(oldForm.geo_api_info);
                    province = geo.addressComponent.province;
                    city = geo.addressComponent.city;
                    if (geo.addressComponent.city.trim() === "" && ["北京市", "上海市", "重庆市", "天津市"].indexOf(province) > -1) {
                        city = geo.addressComponent.province;
                    }
                    else {
                        city = geo.addressComponent.city;
                    }
                    area = geo.addressComponent.province + " "
                        + geo.addressComponent.city + " "
                        + geo.addressComponent.district;
                    address = geo.formattedAddress;
                    Object.assign(oldForm, newForm);
                    delete oldForm.jrdqtlqk;
                    delete oldForm.jrdqjcqk;
                    // 覆盖昨天的地址
                    oldForm.province = province;
                    oldForm.city = city;
                    oldForm.area = area;
                    oldForm.address = address;
                    // 强制覆盖一些字段
                    // 是否移动了位置？否
                    oldForm.ismoved = "0";
                    // 不在同城原因？空
                    oldForm.bztcyy = "";
                    // 是否省份不合？否
                    oldForm.sfsfbh = "0";
                    return [2 /*return*/, oldForm];
            }
        });
    });
}
function postDailyReportFormData(client, formData) {
    return __awaiter(this, void 0, void 0, function () {
        var response;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0: return [4 /*yield*/, client.post(POST_REPORT, { form: formData })];
                case 1:
                    response = _a.sent();
                    if (response.statusCode != 200) {
                        throw new Error("postFormData \u8BF7\u6C42\u8FD4\u56DE\u4E86 " + response.statusCode);
                    }
                    return [2 /*return*/, JSON.parse(response.body)];
            }
        });
    });
}
function main() {
    return __awaiter(this, void 0, void 0, function () {
        var loginForm, client, formData, reportReponse;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    loginForm = {
                        username: USER,
                        password: PASS
                    };
                    if (!(!!loginForm.username && !!loginForm.password)) {
                        throw new Error("无法登录；请填写用户名和密码");
                    }
                    console.log("用户登录中");
                    return [4 /*yield*/, login(loginForm)];
                case 1:
                    client = _a.sent();
                    return [4 /*yield*/, utils_1.sleep(utils_1.randomBetween(1000, 2000))];
                case 2:
                    _a.sent();
                    console.log("正在获取前一天的疫情填报信息");
                    return [4 /*yield*/, getDailyReportFormData(client)];
                case 3:
                    formData = _a.sent();
                    return [4 /*yield*/, utils_1.sleep(utils_1.randomBetween(1000, 2000))];
                case 4:
                    _a.sent();
                    console.log("正在提交今日疫情填报信息");
                    return [4 /*yield*/, postDailyReportFormData(client, formData)];
                case 5:
                    reportReponse = _a.sent();
                    console.log("\u4ECA\u65E5\u586B\u62A5\u7ED3\u679C\uFF1A" + reportReponse.m);
                    if (!!!serverJ) return [3 /*break*/, 7];
                    return [4 /*yield*/, sendNotify('今日填报结果' + reportReponse.m)];
                case 6:
                    _a.sent();
                    _a.label = 7;
                case 7: return [2 /*return*/];
            }
        });
    });
}
main()["catch"](function (err) {
    if (!!serverJ && err instanceof Error) {
        sendNotify('今日填报结果，填报失败，报错信息：' + err.message).then(function () {
            console.log(err);
        });
    }
    else {
        throw err;
    }
})["catch"](function (err) {
    if (err instanceof Error) {
        console.log(err.stack);
        core.setFailed(err.message);
    }
    else {
        core.setFailed(err);
    }
});

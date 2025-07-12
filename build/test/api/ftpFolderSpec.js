"use strict";
/*
 * Copyright (c) 2014-2025 Bjoern Kimminich & the OWASP Juice Shop contributors.
 * SPDX-License-Identifier: MIT
 */
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const frisby = __importStar(require("frisby"));
const URL = 'http://localhost:3000';
describe('/ftp', () => {
    it('GET serves a directory listing', () => {
        return frisby.get(URL + '/ftp')
            .expect('status', 200)
            .expect('header', 'content-type', /text\/html/)
            .expect('bodyContains', '<title>listing directory /ftp</title>');
    });
    it('GET a non-existing Markdown file in /ftp will return a 404 error', () => {
        return frisby.get(URL + '/ftp/doesnotexist.md')
            .expect('status', 404);
    });
    it('GET a non-existing PDF file in /ftp will return a 404 error', () => {
        return frisby.get(URL + '/ftp/doesnotexist.pdf')
            .expect('status', 404);
    });
    it('GET a non-existing file in /ftp will return a 403 error for invalid file type', () => {
        return frisby.get(URL + '/ftp/doesnotexist.exe')
            .expect('status', 403);
    });
    it('GET an existing file in /ftp will return a 403 error for invalid file type .gg', () => {
        return frisby.get(URL + '/ftp/eastere.gg')
            .expect('status', 403);
    });
    it('GET existing file /ftp/coupons_2013.md.bak will return a 403 error for invalid file type .bak', () => {
        return frisby.get(URL + '/ftp/coupons_2013.md.bak')
            .expect('status', 403);
    });
    it('GET existing file /ftp/package.json.bak will return a 403 error for invalid file type .bak', () => {
        return frisby.get(URL + '/ftp/package.json.bak')
            .expect('status', 403);
    });
    it('GET existing file /ftp/suspicious_errors.yml will return a 403 error for invalid file type .yml', () => {
        return frisby.get(URL + '/ftp/suspicious_errors.yml')
            .expect('status', 403);
    });
    it('GET the confidential file in /ftp', () => {
        return frisby.get(URL + '/ftp/acquisitions.md')
            .expect('status', 200)
            .expect('bodyContains', '# Planned Acquisitions');
    });
    it('GET the KeePass database in /ftp', () => {
        return frisby.get(URL + '/ftp/incident-support.kdbx')
            .expect('status', 200);
    });
    it('GET the easter egg file by using Poison Null Byte attack with .pdf suffix', () => {
        return frisby.get(URL + '/ftp/eastere.gg%00.pdf')
            .expect('status', 200)
            .expect('bodyContains', 'Congratulations, you found the easter egg!');
    });
    it('GET the easter egg file by using Poison Null Byte attack with .md suffix', () => {
        return frisby.get(URL + '/ftp/eastere.gg%00.md')
            .expect('status', 200)
            .expect('bodyContains', 'Congratulations, you found the easter egg!');
    });
    it('GET the SIEM signature file by using Poison Null Byte attack with .pdf suffix', () => {
        return frisby.get(URL + '/ftp/suspicious_errors.yml%00.pdf')
            .expect('status', 200)
            .expect('bodyContains', 'Suspicious error messages specific to the application');
    });
    it('GET the SIEM signature file by using Poison Null Byte attack with .md suffix', () => {
        return frisby.get(URL + '/ftp/suspicious_errors.yml%00.md')
            .expect('status', 200)
            .expect('bodyContains', 'Suspicious error messages specific to the application');
    });
    it('GET the 2013 coupon code file by using Poison Null Byte attack with .pdf suffix', () => {
        return frisby.get(URL + '/ftp/coupons_2013.md.bak%00.pdf')
            .expect('status', 200)
            .expect('bodyContains', 'n<MibgC7sn');
    });
    it('GET the 2013 coupon code file by using an Poison Null Byte attack with .md suffix', () => {
        return frisby.get(URL + '/ftp/coupons_2013.md.bak%00.md')
            .expect('status', 200)
            .expect('bodyContains', 'n<MibgC7sn');
    });
    it('GET the package.json.bak file by using Poison Null Byte attack with .pdf suffix', () => {
        return frisby.get(URL + '/ftp/package.json.bak%00.pdf')
            .expect('status', 200)
            .expect('bodyContains', '"name": "juice-shop",');
    });
    it('GET the package.json.bak file by using Poison Null Byte attack with .md suffix', () => {
        return frisby.get(URL + '/ftp/package.json.bak%00.md')
            .expect('status', 200)
            .expect('bodyContains', '"name": "juice-shop",');
    });
    it('GET a restricted file directly from file system path on server by tricking route definitions fails with 403 error', () => {
        return frisby.get(URL + '/ftp///eastere.gg')
            .expect('status', 403);
    });
    it('GET a restricted file directly from file system path on server by appending URL parameter fails with 403 error', () => {
        return frisby.get(URL + '/ftp/eastere.gg?.md')
            .expect('status', 403);
    });
    it('GET a file whose name contains a "/" fails with a 403 error', () => {
        return frisby.fetch(URL + '/ftp/%2fetc%2fos-release%2500.md', {}, { urlEncode: false })
            .expect('status', 403)
            .expect('bodyContains', 'Error: File names cannot contain forward slashes!');
    });
    it('GET an accessible file directly from file system path on server', () => {
        return frisby.get(URL + '/ftp/legal.md')
            .expect('status', 200)
            .expect('bodyContains', '# Legal Information');
    });
    it('GET a non-existing file via direct server file path /ftp will return a 404 error', () => {
        return frisby.get(URL + '/ftp/doesnotexist.md')
            .expect('status', 404);
    });
    it('GET the package.json.bak file contains a dependency on epilogue-js for "Typosquatting" challenge', () => {
        return frisby.get(URL + '/ftp/package.json.bak%00.md')
            .expect('status', 200)
            .expect('bodyContains', '"epilogue-js": "~0.7",');
    });
    it('GET file /ftp/quarantine/juicy_malware_linux_amd_64.url', () => {
        return frisby.get(URL + '/ftp/quarantine/juicy_malware_linux_amd_64.url')
            .expect('status', 200);
    });
    it('GET file /ftp/quarantine/juicy_malware_linux_arm_64.url', () => {
        return frisby.get(URL + '/ftp/quarantine/juicy_malware_linux_arm_64.url')
            .expect('status', 200);
    });
    it('GET existing file /ftp/quarantine/juicy_malware_macos_64.url', () => {
        return frisby.get(URL + '/ftp/quarantine/juicy_malware_macos_64.url')
            .expect('status', 200);
    });
    it('GET existing file /ftp/quarantine/juicy_malware_windows_64.exe.url', () => {
        return frisby.get(URL + '/ftp/quarantine/juicy_malware_windows_64.exe.url')
            .expect('status', 200);
    });
});
//# sourceMappingURL=ftpFolderSpec.js.map
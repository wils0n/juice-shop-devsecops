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
xdescribe('Required Internet resource', () => {
    describe('PasteBin paste for "Leaked Unsafe Product" challenge available', () => {
        it('for default configuration (https://pastebin.com/90dUgd7s)', () => {
            return frisby.get('https://pastebin.com/90dUgd7s')
                .expect('status', 200)
                .expect('bodyContains', 'Hueteroneel')
                .expect('bodyContains', 'this coupled with Eurogium Edule was sometimes found fatal');
        });
        xit('for 7MS configuration (https://pastebin.com/8SMbWPxc)', () => {
            return frisby.get('https://pastebin.com/8SMbWPxc')
                .expect('status', 200)
                .expect('bodyContains', 'TAYLOR SWIFT')
                .expect('bodyContains', 'KATY PERRY')
                .expect('bodyContains', '(Consider rivalries when picking song list for events as wrong combo could infuriate a mixed-fans audience, see https://www.nickiswift.com/2075/taylor-swifts-list-enemies)');
        });
        it('for BodgeIt Store configuration (https://pastebin.com/G47LrDr0)', () => {
            return frisby.get('https://pastebin.com/G47LrDr0')
                .expect('status', 200)
                .expect('bodyContains', 'Mind Blank - one willing creature you touch is immune any effect')
                .expect('bodyContains', 'They should seek out a Couatl, and undertake a quest to receive')
                .expect('bodyContains', 'They could acquire the aid of a rakshasa, and willingly invoke its')
                .expect('bodyContains', 'Note to self: Option (1) and (3) of the above should not be combined.');
        });
        xit('for Mozilla configuration (https://pastebin.com/t8jqE1y7)', () => {
            return frisby.get('https://pastebin.com/t8jqE1y7')
                .expect('status', 200)
                .expect('bodyContains', 'Fixed a bug that, when this plugin was installed together with both the')
                .expect('bodyContains', 'JuiceNote')
                .expect('bodyContains', 'Magische Firefox Suche')
                .expect('bodyContains', 'plugins, lwt your browser throw a')
                .expect('bodyContains', 'JuiceOverFlowError')
                .expect('bodyContains', 'The problem can still occur post-fix but at least now less frequently!');
        });
        it('for All Day DevOps configuration (https://pastebin.com/RXrihEMS)', () => {
            return frisby.get('https://pastebin.com/RXrihEMS')
                .expect('status', 200)
                .expect('bodyContains', 'The infamous 301 and 303 lasers.')
                .expect('bodyContains', 'Cheap Chinese crap with no quality control')
                .expect('bodyContains', 'permanent damage before you can blink your eye');
        });
    });
    it('Comment on "Top 10 Fruits you probably dont know" blog post with PasteBin paste URL spoiler available', () => {
        return frisby.get('https://listverse.disqus.com/top_20_fruits_you_probably_don039t_know/latest.rss')
            .expect('status', 200)
            .expect('bodyContains', 'Rippertuer Special Juice')
            .expect('bodyContains', 'https://pastebin.com/90dUgd7s');
    });
    it('PasteBin paste (https://pastebin.com/4U1V1UjU) for "Leaked Access Logs" challenge available', () => {
        return frisby.get('https://pastebin.com/4U1V1UjU')
            .expect('status', 200)
            .expect('bodyContains', 'current=0Y8rMnww$*9VFYE%C2%A759-!Fg1L6t&amp;6lB');
    });
    it('StackOverflow question "Less verbose access logs using expressjs/morgan" with log snippet and PasteBin paste URL spoiler available', () => {
        return frisby.get('https://stackoverflow.com/questions/57061271/less-verbose-access-logs-using-expressjs-morgan')
            .expect('status', 200)
            .expect('bodyContains', '/rest/continue-code')
            .expect('bodyContains', '/api/Challenges/?name=Score%20Board')
            .expect('bodyContains', 'https://pastebin.com/4U1V1UjU');
    });
    it('GitHub issue (https://github.com/apostrophecms/sanitize-html/issues/29) for "Server-side XSS Protection" challenge available', () => {
        return frisby.get('https://github.com/apostrophecms/sanitize-html/issues/29')
            .expect('status', 200)
            .expect('bodyContains', 'Sanitization is not applied recursively')
            .expect('bodyContains', 'I am not harmless: &lt;&lt;img src=&quot;csrf-attack&quot;/&gt;img src=&quot;csrf-attack&quot;/&gt; is sanitized to I am not harmless: &lt;img src=&quot;csrf-attack&quot;/&gt;');
    });
});
//# sourceMappingURL=internetResourcesSpec.js.map
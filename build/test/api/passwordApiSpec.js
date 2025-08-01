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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const frisby = __importStar(require("frisby"));
const config_1 = __importDefault(require("config"));
const API_URL = 'http://localhost:3000/api';
const REST_URL = 'http://localhost:3000/rest';
const jsonHeader = { 'content-type': 'application/json' };
describe('/rest/user/change-password', () => {
    it('GET password change for newly created user with recognized token as Authorization header', () => {
        return frisby.post(API_URL + '/Users', {
            headers: jsonHeader,
            body: {
                email: 'kuni@be.rt',
                password: 'kunigunde'
            }
        })
            .expect('status', 201)
            .then(() => {
            return frisby.post(REST_URL + '/user/login', {
                headers: jsonHeader,
                body: {
                    email: 'kuni@be.rt',
                    password: 'kunigunde'
                }
            })
                .expect('status', 200)
                .then(({ json }) => {
                return frisby.get(REST_URL + '/user/change-password?current=kunigunde&new=foo&repeat=foo', {
                    headers: { Authorization: 'Bearer ' + json.authentication.token }
                })
                    .expect('status', 200);
            });
        });
    });
    it('GET password change with passing wrong current password', () => {
        return frisby.post(REST_URL + '/user/login', {
            headers: jsonHeader,
            body: {
                email: 'bjoern@' + config_1.default.get('application.domain'),
                password: 'monkey summer birthday are all bad passwords but work just fine in a long passphrase'
            }
        })
            .expect('status', 200)
            .then(({ json }) => {
            return frisby.get(REST_URL + '/user/change-password?current=definetely_wrong&new=blubb&repeat=blubb', {
                headers: { Authorization: 'Bearer ' + json.authentication.token }
            })
                .expect('status', 401)
                .expect('bodyContains', 'Current password is not correct');
        });
    });
    it('GET password change without passing any passwords', () => {
        return frisby.get(REST_URL + '/user/change-password')
            .expect('status', 401)
            .expect('bodyContains', 'Password cannot be empty');
    });
    it('GET password change with passing wrong repeated password', () => {
        return frisby.get(REST_URL + '/user/change-password?new=foo&repeat=bar')
            .expect('status', 401)
            .expect('bodyContains', 'New and repeated password do not match');
    });
    it('GET password change without passing an authorization token', () => {
        return frisby.get(REST_URL + '/user/change-password?new=foo&repeat=foo')
            .expect('status', 500)
            .expect('header', 'content-type', /text\/html/)
            .expect('bodyContains', '<h1>' + config_1.default.get('application.name') + ' (Express')
            .expect('bodyContains', 'Error: Blocked illegal activity');
    });
    it('GET password change with passing unrecognized authorization token', () => {
        return frisby.get(REST_URL + '/user/change-password?new=foo&repeat=foo', { headers: { Authorization: 'Bearer unknown' } })
            .expect('status', 500)
            .expect('header', 'content-type', /text\/html/)
            .expect('bodyContains', '<h1>' + config_1.default.get('application.name') + ' (Express')
            .expect('bodyContains', 'Error: Blocked illegal activity');
    });
    it('GET password change for Bender without current password using GET request', () => {
        return frisby.post(REST_URL + '/user/login', {
            headers: jsonHeader,
            body: {
                email: 'bender@' + config_1.default.get('application.domain'),
                password: 'OhG0dPlease1nsertLiquor!'
            }
        })
            .expect('status', 200)
            .then(({ json }) => {
            return frisby.get(REST_URL + '/user/change-password?new=slurmCl4ssic&repeat=slurmCl4ssic', {
                headers: { Authorization: 'Bearer ' + json.authentication.token }
            })
                .expect('status', 200);
        });
    });
});
describe('/rest/user/reset-password', () => {
    it('POST password reset for Jim with correct answer to his security question', () => {
        return frisby.post(REST_URL + '/user/reset-password', {
            headers: jsonHeader,
            body: {
                email: 'jim@' + config_1.default.get('application.domain'),
                answer: 'Samuel',
                new: 'ncc-1701',
                repeat: 'ncc-1701'
            }
        })
            .expect('status', 200);
    });
    it('POST password reset for Bender with correct answer to his security question', () => {
        return frisby.post(REST_URL + '/user/reset-password', {
            headers: jsonHeader,
            body: {
                email: 'bender@' + config_1.default.get('application.domain'),
                answer: 'Stop\'n\'Drop',
                new: 'OhG0dPlease1nsertLiquor!',
                repeat: 'OhG0dPlease1nsertLiquor!'
            }
        })
            .expect('status', 200);
    });
    it('POST password reset for Bjoern´s internal account with correct answer to his security question', () => {
        return frisby.post(REST_URL + '/user/reset-password', {
            headers: jsonHeader,
            body: {
                email: 'bjoern@' + config_1.default.get('application.domain'),
                answer: 'West-2082',
                new: 'monkey summer birthday are all bad passwords but work just fine in a long passphrase',
                repeat: 'monkey summer birthday are all bad passwords but work just fine in a long passphrase'
            }
        })
            .expect('status', 200);
    });
    it('POST password reset for Bjoern´s OWASP account with correct answer to his security question', () => {
        return frisby.post(REST_URL + '/user/reset-password', {
            headers: jsonHeader,
            body: {
                email: 'bjoern@owasp.org',
                answer: 'Zaya',
                new: 'kitten lesser pooch karate buffoon indoors',
                repeat: 'kitten lesser pooch karate buffoon indoors'
            }
        })
            .expect('status', 200);
    });
    it('POST password reset for Morty with correct answer to his security question', () => {
        return frisby.post(REST_URL + '/user/reset-password', {
            headers: jsonHeader,
            body: {
                email: 'morty@' + config_1.default.get('application.domain'),
                answer: '5N0wb41L',
                new: 'iBurri3dMySe1fInTheB4ckyard!',
                repeat: 'iBurri3dMySe1fInTheB4ckyard!'
            }
        })
            .expect('status', 200);
    });
    it('POST password reset with wrong answer to security question', () => {
        return frisby.post(REST_URL + '/user/reset-password', {
            headers: jsonHeader,
            body: {
                email: 'bjoern@' + config_1.default.get('application.domain'),
                answer: '25436',
                new: '12345',
                repeat: '12345'
            }
        })
            .expect('status', 401)
            .expect('bodyContains', 'Wrong answer to security question.');
    });
    it('POST password reset without any data is blocked', () => {
        return frisby.post(REST_URL + '/user/reset-password')
            .expect('status', 500)
            .expect('header', 'content-type', /text\/html/)
            .expect('bodyContains', '<h1>' + config_1.default.get('application.name') + ' (Express')
            .expect('bodyContains', 'Error: Blocked illegal activity');
    });
    it('POST password reset without new password throws a 401 error', () => {
        return frisby.post(REST_URL + '/user/reset-password', {
            headers: jsonHeader,
            body: {
                email: 'bjoern@' + config_1.default.get('application.domain'),
                answer: 'W-2082',
                repeat: '12345'
            }
        })
            .expect('status', 401)
            .expect('bodyContains', 'Password cannot be empty.');
    });
    it('POST password reset with mismatching passwords throws a 401 error', () => {
        return frisby.post(REST_URL + '/user/reset-password', {
            headers: jsonHeader,
            body: {
                email: 'bjoern@' + config_1.default.get('application.domain'),
                answer: 'W-2082',
                new: '12345',
                repeat: '1234_'
            }
        })
            .expect('status', 401)
            .expect('bodyContains', 'New and repeated password do not match.');
    });
    it('POST password reset with no email address throws a 412 error', () => {
        return frisby.post(REST_URL + '/user/reset-password', {
            header: jsonHeader,
            body: {
                answer: 'W-2082',
                new: 'abcdef',
                repeat: 'abcdef'
            }
        })
            .expect('status', 500)
            .expect('header', 'content-type', /text\/html/)
            .expect('bodyContains', '<h1>' + config_1.default.get('application.name') + ' (Express')
            .expect('bodyContains', 'Error: Blocked illegal activity');
    });
    it('POST password reset with no answer to the security question throws a 412 error', () => {
        return frisby.post(REST_URL + '/user/reset-password', {
            header: jsonHeader,
            body: {
                email: 'bjoern@' + config_1.default.get('application.domain'),
                new: 'abcdef',
                repeat: 'abcdef'
            }
        })
            .expect('status', 500)
            .expect('header', 'content-type', /text\/html/)
            .expect('bodyContains', '<h1>' + config_1.default.get('application.name') + ' (Express')
            .expect('bodyContains', 'Error: Blocked illegal activity');
    });
});
//# sourceMappingURL=passwordApiSpec.js.map
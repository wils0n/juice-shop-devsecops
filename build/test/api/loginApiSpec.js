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
const Joi = frisby.Joi;
const API_URL = 'http://localhost:3000/api';
const REST_URL = 'http://localhost:3000/rest';
const jsonHeader = { 'content-type': 'application/json' };
describe('/rest/user/login', () => {
    it('POST login newly created user', () => {
        return frisby.post(API_URL + '/Users', {
            headers: jsonHeader,
            body: {
                email: 'kalli@kasper.le',
                password: 'kallliiii'
            }
        })
            .expect('status', 201)
            .then(() => {
            return frisby.post(REST_URL + '/user/login', {
                headers: jsonHeader,
                body: {
                    email: 'kalli@kasper.le',
                    password: 'kallliiii'
                }
            })
                .expect('status', 200)
                .expect('header', 'content-type', /application\/json/)
                .expect('jsonTypes', 'authentication', {
                token: Joi.string(),
                umail: Joi.string(),
                bid: Joi.number()
            });
        });
    });
    it('POST login non-existing user', () => {
        return frisby.post(REST_URL + '/user/login', {
            email: 'otto@mei.er',
            password: 'ooootto'
        }, { json: true })
            .expect('status', 401);
    });
    it('POST login without credentials', () => {
        return frisby.post(REST_URL + '/user/login', {
            email: undefined,
            password: undefined
        }, { json: true })
            .expect('status', 401);
    });
    it('POST login with admin credentials', () => {
        return frisby.post(REST_URL + '/user/login', {
            headers: jsonHeader,
            body: {
                email: 'admin@' + config_1.default.get('application.domain'),
                password: 'admin123'
            }
        })
            .expect('status', 200)
            .expect('header', 'content-type', /application\/json/)
            .expect('jsonTypes', 'authentication', {
            token: Joi.string()
        });
    });
    it('POST login with support-team credentials', () => {
        return frisby.post(REST_URL + '/user/login', {
            headers: jsonHeader,
            body: {
                email: 'support@' + config_1.default.get('application.domain'),
                password: 'J6aVjTgOpRs@?5l!Zkq2AYnCE@RF$P'
            }
        })
            .expect('status', 200)
            .expect('header', 'content-type', /application\/json/)
            .expect('jsonTypes', 'authentication', {
            token: Joi.string()
        });
    });
    it('POST login with MC SafeSearch credentials', () => {
        return frisby.post(REST_URL + '/user/login', {
            headers: jsonHeader,
            body: {
                email: 'mc.safesearch@' + config_1.default.get('application.domain'),
                password: 'Mr. N00dles'
            }
        })
            .expect('status', 200)
            .expect('header', 'content-type', /application\/json/)
            .expect('jsonTypes', 'authentication', {
            token: Joi.string()
        });
    });
    it('POST login with Amy credentials', () => {
        return frisby.post(REST_URL + '/user/login', {
            headers: jsonHeader,
            body: {
                email: 'amy@' + config_1.default.get('application.domain'),
                password: 'K1f.....................'
            }
        })
            .expect('status', 200)
            .expect('header', 'content-type', /application\/json/)
            .expect('jsonTypes', 'authentication', {
            token: Joi.string()
        });
    });
    it('POST login with wurstbrot credentials expects 2FA token', () => {
        return frisby.post(REST_URL + '/user/login', {
            headers: jsonHeader,
            body: {
                email: 'wurstbrot@' + config_1.default.get('application.domain'),
                password: 'EinBelegtesBrotMitSchinkenSCHINKEN!'
            }
        })
            .expect('status', 401)
            .expect('header', 'content-type', /application\/json/)
            .expect('jsonTypes', 'data', {
            tmpToken: Joi.string()
        })
            .expect('json', {
            status: 'totp_token_required'
        });
    });
    it('POST login as bjoern.kimminich@gmail.com with known password', () => {
        return frisby.post(REST_URL + '/user/login', {
            headers: jsonHeader,
            body: {
                email: 'bjoern.kimminich@gmail.com',
                password: 'bW9jLmxpYW1nQGhjaW5pbW1pay5ucmVvamI='
            }
        })
            .expect('status', 200)
            .expect('header', 'content-type', /application\/json/)
            .expect('jsonTypes', 'authentication', {
            token: Joi.string()
        });
    });
    it('POST login with WHERE-clause disabling SQL injection attack', () => {
        return frisby.post(REST_URL + '/user/login', {
            header: jsonHeader,
            body: {
                email: '\' or 1=1--',
                password: undefined
            }
        })
            .expect('status', 200)
            .expect('header', 'content-type', /application\/json/)
            .expect('jsonTypes', 'authentication', {
            token: Joi.string()
        });
    });
    it('POST login with known email "admin@juice-sh.op" in SQL injection attack', () => {
        return frisby.post(REST_URL + '/user/login', {
            header: jsonHeader,
            body: {
                email: 'admin@' + config_1.default.get('application.domain') + '\'--',
                password: undefined
            }
        })
            .expect('status', 200)
            .expect('header', 'content-type', /application\/json/)
            .expect('jsonTypes', 'authentication', {
            token: Joi.string()
        });
    });
    it('POST login with known email "jim@juice-sh.op" in SQL injection attack', () => {
        return frisby.post(REST_URL + '/user/login', {
            header: jsonHeader,
            body: {
                email: 'jim@' + config_1.default.get('application.domain') + '\'--',
                password: undefined
            }
        })
            .expect('status', 200)
            .expect('header', 'content-type', /application\/json/)
            .expect('jsonTypes', 'authentication', {
            token: Joi.string()
        });
    });
    it('POST login with known email "bender@juice-sh.op" in SQL injection attack', () => {
        return frisby.post(REST_URL + '/user/login', {
            header: jsonHeader,
            body: {
                email: 'bender@' + config_1.default.get('application.domain') + '\'--',
                password: undefined
            }
        })
            .expect('status', 200)
            .expect('header', 'content-type', /application\/json/)
            .expect('jsonTypes', 'authentication', {
            token: Joi.string()
        });
    });
    it('POST login with non-existing email "acc0unt4nt@juice-sh.op" via UNION SELECT injection attack', () => {
        return frisby.post(REST_URL + '/user/login', {
            header: jsonHeader,
            body: {
                email: `' UNION SELECT * FROM (SELECT 15 as 'id', '' as 'username', 'acc0unt4nt@${config_1.default.get('application.domain')}' as 'email', '12345' as 'password', 'accounting' as 'role', '' as deluxeToken, '1.2.3.4' as 'lastLoginIp' , '/assets/public/images/uploads/default.svg' as 'profileImage', '' as 'totpSecret', 1 as 'isActive', '1999-08-16 14:14:41.644 +00:00' as 'createdAt', '1999-08-16 14:33:41.930 +00:00' as 'updatedAt', null as 'deletedAt')--`,
                password: undefined
            }
        })
            .expect('status', 200)
            .expect('header', 'content-type', /application\/json/)
            .expect('jsonTypes', 'authentication', {
            token: Joi.string()
        });
    });
    it('POST login with query-breaking SQL Injection attack', () => {
        return frisby.post(REST_URL + '/user/login', {
            header: jsonHeader,
            body: {
                email: '\';',
                password: undefined
            }
        })
            .expect('status', 401);
    });
});
describe('/rest/saveLoginIp', () => {
    it('GET last login IP will be saved as True-Client-IP header value', () => {
        return frisby.post(REST_URL + '/user/login', {
            headers: jsonHeader,
            body: {
                email: 'bjoern.kimminich@gmail.com',
                password: 'bW9jLmxpYW1nQGhjaW5pbW1pay5ucmVvamI='
            }
        })
            .expect('status', 200)
            .then(({ json: jsonLogin }) => {
            return frisby.get(REST_URL + '/saveLoginIp', {
                headers: {
                    Authorization: 'Bearer ' + jsonLogin.authentication.token,
                    'true-client-ip': '1.2.3.4'
                }
            })
                .expect('status', 200)
                .expect('json', { lastLoginIp: '1.2.3.4' });
        });
    });
    xit('GET last login IP will be saved as remote IP when True-Client-IP is not present', () => {
        return frisby.post(REST_URL + '/user/login', {
            headers: jsonHeader,
            body: {
                email: 'bjoern.kimminich@gmail.com',
                password: 'bW9jLmxpYW1nQGhjaW5pbW1pay5ucmVvamI='
            }
        })
            .expect('status', 200)
            .then(({ json: jsonLogin }) => {
            return frisby.get(REST_URL + '/saveLoginIp', {
                headers: {
                    Authorization: 'Bearer ' + jsonLogin.authentication.token
                }
            })
                .expect('status', 200)
                .expect('json', { lastLoginIp: '127.0.0.1' });
        });
    });
});
//# sourceMappingURL=loginApiSpec.js.map
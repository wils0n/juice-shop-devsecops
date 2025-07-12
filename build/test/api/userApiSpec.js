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
const globals_1 = require("@jest/globals");
const frisby = __importStar(require("frisby"));
const datacache_1 = require("../../data/datacache");
const security = __importStar(require("../../lib/insecurity"));
const utils = __importStar(require("../../lib/utils"));
const Joi = frisby.Joi;
const API_URL = 'http://localhost:3000/api';
const REST_URL = 'http://localhost:3000/rest';
const authHeader = { Authorization: `Bearer ${security.authorize()}`, 'content-type': 'application/json' };
const jsonHeader = { 'content-type': 'application/json' };
describe('/api/Users', () => {
    it('GET all users is forbidden via public API', () => {
        return frisby.get(`${API_URL}/Users`)
            .expect('status', 401);
    });
    it('GET all users', () => {
        return frisby.get(`${API_URL}/Users`, { headers: authHeader })
            .expect('status', 200);
    });
    it('GET all users doesnt include passwords', () => {
        return frisby.get(`${API_URL}/Users`, { headers: authHeader })
            .expect('status', 200)
            .expect('jsonTypes', 'data.*', {
            password: Joi.any().forbidden()
        });
    });
    it('POST new user', () => {
        return frisby.post(`${API_URL}/Users`, {
            headers: jsonHeader,
            body: {
                email: 'horst@horstma.nn',
                password: 'hooooorst'
            }
        })
            .expect('status', 201)
            .expect('header', 'content-type', /application\/json/)
            .expect('jsonTypes', 'data', {
            id: Joi.number(),
            createdAt: Joi.string(),
            updatedAt: Joi.string(),
            password: Joi.any().forbidden()
        });
    });
    it('POST new admin', () => {
        return frisby.post(`${API_URL}/Users`, {
            headers: jsonHeader,
            body: {
                email: 'horst2@horstma.nn',
                password: 'hooooorst',
                role: 'admin'
            }
        })
            .expect('status', 201)
            .expect('header', 'content-type', /application\/json/)
            .expect('jsonTypes', 'data', {
            id: Joi.number(),
            createdAt: Joi.string(),
            updatedAt: Joi.string(),
            password: Joi.any().forbidden()
        })
            .expect('json', 'data', {
            role: 'admin'
        });
    });
    it('POST new blank user', () => {
        return frisby.post(`${API_URL}/Users`, {
            headers: jsonHeader,
            body: {
                email: ' ',
                password: ' '
            }
        })
            .expect('status', 201)
            .expect('header', 'content-type', /application\/json/)
            .expect('jsonTypes', 'data', {
            id: Joi.number(),
            createdAt: Joi.string(),
            updatedAt: Joi.string(),
            password: Joi.any().forbidden()
        });
    });
    it('POST same blank user in database', () => {
        return frisby.post(`${API_URL}/Users`, {
            headers: jsonHeader,
            body: {
                email: ' ',
                password: ' '
            }
        }).post(`${API_URL}/Users`, {
            headers: jsonHeader,
            body: {
                email: ' ',
                password: ' '
            }
        })
            .expect('status', 400)
            .expect('header', 'content-type', /application\/json/);
    });
    it('POST whitespaces user', () => {
        return frisby.post(`${API_URL}/Users`, {
            headers: jsonHeader,
            body: {
                email: ' test@gmail.com',
                password: ' test'
            }
        })
            .expect('status', 201)
            .expect('header', 'content-type', /application\/json/)
            .expect('jsonTypes', 'data', {
            id: Joi.number(),
            created: Joi.string(),
            updatedAt: Joi.string(),
            password: Joi.any().forbidden()
        });
    });
    it('POST new deluxe user', () => {
        return frisby.post(`${API_URL}/Users`, {
            headers: jsonHeader,
            body: {
                email: 'horst3@horstma.nn',
                password: 'hooooorst',
                role: 'deluxe'
            }
        })
            .expect('status', 201)
            .expect('header', 'content-type', /application\/json/)
            .expect('jsonTypes', 'data', {
            id: Joi.number(),
            createdAt: Joi.string(),
            updatedAt: Joi.string(),
            password: Joi.any().forbidden()
        })
            .expect('json', 'data', {
            role: 'deluxe'
        });
    });
    it('POST new accounting user', () => {
        return frisby.post(`${API_URL}/Users`, {
            headers: jsonHeader,
            body: {
                email: 'horst4@horstma.nn',
                password: 'hooooorst',
                role: 'accounting'
            }
        })
            .expect('status', 201)
            .expect('header', 'content-type', /application\/json/)
            .expect('jsonTypes', 'data', {
            id: Joi.number(),
            createdAt: Joi.string(),
            updatedAt: Joi.string(),
            password: Joi.any().forbidden()
        })
            .expect('json', 'data', {
            role: 'accounting'
        });
    });
    it('POST user not belonging to customer, deluxe, accounting, admin is forbidden', () => {
        return frisby.post(`${API_URL}/Users`, {
            headers: jsonHeader,
            body: {
                email: 'horst5@horstma.nn',
                password: 'hooooorst',
                role: 'accountinguser'
            }
        })
            .expect('status', 400)
            .expect('header', 'content-type', /application\/json/)
            .then(({ json }) => {
            (0, globals_1.expect)(json.message).toBe('Validation error: Validation isIn on role failed');
            (0, globals_1.expect)(json.errors[0].field).toBe('role');
            (0, globals_1.expect)(json.errors[0].message).toBe('Validation isIn on role failed');
        });
    });
    if (utils.isChallengeEnabled(datacache_1.challenges.usernameXssChallenge)) {
        it('POST new user with XSS attack in email address', () => {
            return frisby.post(`${API_URL}/Users`, {
                headers: jsonHeader,
                body: {
                    email: '<iframe src="javascript:alert(`xss`)">',
                    password: 'does.not.matter'
                }
            })
                .expect('status', 201)
                .expect('header', 'content-type', /application\/json/)
                .expect('json', 'data', { email: '<iframe src="javascript:alert(`xss`)">' });
        });
    }
});
describe('/api/Users/:id', () => {
    it('GET existing user by id is forbidden via public API', () => {
        return frisby.get(`${API_URL}/Users/1`)
            .expect('status', 401);
    });
    it('PUT update existing user is forbidden via public API', () => {
        return frisby.put(`${API_URL}/Users/1`, {
            header: jsonHeader,
            body: { email: 'administr@t.or' }
        })
            .expect('status', 401);
    });
    it('DELETE existing user is forbidden via public API', () => {
        return frisby.del(`${API_URL}/Users/1`)
            .expect('status', 401);
    });
    it('GET existing user by id', () => {
        return frisby.get(`${API_URL}/Users/1`, { headers: authHeader })
            .expect('status', 200);
    });
    it('PUT update existing user is forbidden via API even when authenticated', () => {
        return frisby.put(`${API_URL}/Users/1`, {
            headers: authHeader,
            body: { email: 'horst.horstmann@horstma.nn' }
        })
            .expect('status', 401);
    });
    it('DELETE existing user is forbidden via API even when authenticated', () => {
        return frisby.del(`${API_URL}/Users/1`, { headers: authHeader })
            .expect('status', 401);
    });
});
describe('/rest/user/whoami', () => {
    it('GET own user id and email on who-am-i request', () => {
        return frisby.post(`${REST_URL}/user/login`, {
            headers: jsonHeader,
            body: {
                email: 'bjoern.kimminich@gmail.com',
                password: 'bW9jLmxpYW1nQGhjaW5pbW1pay5ucmVvamI='
            }
        })
            .expect('status', 200)
            .then(({ json }) => {
            return frisby.get(`${REST_URL}/user/whoami`, { headers: { Cookie: `token=${json.authentication.token}` } })
                .expect('status', 200)
                .expect('header', 'content-type', /application\/json/)
                .expect('jsonTypes', 'user', {
                id: Joi.number(),
                email: Joi.string()
            })
                .expect('json', 'user', {
                email: 'bjoern.kimminich@gmail.com'
            });
        });
    });
    it('GET who-am-i request returns nothing on missing auth token', () => {
        return frisby.get(`${REST_URL}/user/whoami`)
            .expect('status', 200)
            .expect('header', 'content-type', /application\/json/)
            .expect('json', {
            user: {}
        });
    });
    it('GET who-am-i request returns nothing on invalid auth token', () => {
        return frisby.get(`${REST_URL}/user/whoami`, { headers: { Authorization: 'Bearer InvalidAuthToken' } })
            .expect('status', 200)
            .expect('header', 'content-type', /application\/json/)
            .expect('json', {
            user: {}
        });
    });
    it('GET who-am-i request returns nothing on broken auth token', () => {
        return frisby.get(`${REST_URL}/user/whoami`, { headers: { Authorization: 'BoarBeatsBear' } })
            .expect('status', 200)
            .expect('header', 'content-type', /application\/json/)
            .expect('json', {
            user: {}
        });
    });
    it('GET who-am-i request returns nothing on expired auth token', () => {
        return frisby.get(`${REST_URL}/user/whoami`, { headers: { Authorization: 'eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdGF0dXMiOiJzdWNjZXNzIiwiZGF0YSI6eyJpZCI6MSwidXNlcm5hbWUiOiIiLCJlbWFpbCI6ImFkbWluQGp1aWNlLXNoLm9wIiwicGFzc3dvcmQiOiIwMTkyMDIzYTdiYmQ3MzI1MDUxNmYwNjlkZjE4YjUwMCIsInJvbGUiOiJhZG1pbiIsImxhc3RMb2dpbklwIjoiMC4wLjAuMCIsInByb2ZpbGVJbWFnZSI6ImRlZmF1bHQuc3ZnIiwidG90cFNlY3JldCI6IiIsImlzQWN0aXZlIjp0cnVlLCJjcmVhdGVkQXQiOiIyMDE5LTA4LTE5IDE1OjU2OjE1LjYyOSArMDA6MDAiLCJ1cGRhdGVkQXQiOiIyMDE5LTA4LTE5IDE1OjU2OjE1LjYyOSArMDA6MDAiLCJkZWxldGVkQXQiOm51bGx9LCJpYXQiOjE1NjYyMzAyMjQsImV4cCI6MTU2NjI0ODIyNH0.FL0kkcInY5sDMGKeLHfEOYDTQd3BjR6_mK7Tcm_RH6iCLotTSRRoRxHpLkbtIQKqBFIt14J4BpLapkzG7ppRWcEley5nego-4iFOmXQvCBz5ISS3HdtM0saJnOe0agyVUen3huFp4F2UCth_y2ScjMn_4AgW66cz8NSFPRVpC8g' } })
            .expect('status', 200)
            .expect('header', 'content-type', /application\/json/)
            .expect('json', {
            user: {}
        });
    });
});
//# sourceMappingURL=userApiSpec.js.map
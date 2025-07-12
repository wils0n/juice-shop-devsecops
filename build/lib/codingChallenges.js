"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getCodeChallenges = exports.findFilesWithCodeChallenges = exports.SNIPPET_PATHS = void 0;
const promises_1 = __importDefault(require("node:fs/promises"));
const node_path_1 = __importDefault(require("node:path"));
const logger_1 = __importDefault(require("./logger"));
exports.SNIPPET_PATHS = Object.freeze(['./server.ts', './routes', './lib', './data', './data/static/web3-snippets', './frontend/src/app', './models']);
const findFilesWithCodeChallenges = async (paths) => {
    const matches = [];
    for (const currPath of paths) {
        if ((await promises_1.default.lstat(currPath)).isDirectory()) {
            const files = await promises_1.default.readdir(currPath);
            const moreMatches = await (0, exports.findFilesWithCodeChallenges)(files.map(file => node_path_1.default.resolve(currPath, file)));
            matches.push(...moreMatches);
        }
        else {
            try {
                const code = await promises_1.default.readFile(currPath, 'utf8');
                if (
                // strings are split so that it doesn't find itself...
                code.includes('// vuln-code' + '-snippet start') ||
                    code.includes('# vuln-code' + '-snippet start')) {
                    matches.push({ path: currPath, content: code });
                }
            }
            catch (e) {
                logger_1.default.warn(`File ${currPath} could not be read. it might have been moved or deleted. If coding challenges are contained in the file, they will not be available.`);
            }
        }
    }
    return matches;
};
exports.findFilesWithCodeChallenges = findFilesWithCodeChallenges;
function getCodeChallengesFromFile(file) {
    const fileContent = file.content;
    // get all challenges which are in the file by a regex capture group
    const challengeKeyRegex = /[/#]{0,2} vuln-code-snippet start (?<challenges>.*)/g;
    const challenges = [...fileContent.matchAll(challengeKeyRegex)]
        .flatMap(match => match.groups?.challenges?.split(' ') ?? [])
        .filter(Boolean);
    return challenges.map((challengeKey) => getCodingChallengeFromFileContent(fileContent, challengeKey));
}
function getCodingChallengeFromFileContent(source, challengeKey) {
    const snippets = source.match(`[/#]{0,2} vuln-code-snippet start.*${challengeKey}([^])*vuln-code-snippet end.*${challengeKey}`);
    if (snippets == null) {
        throw new BrokenBoundary('Broken code snippet boundaries for: ' + challengeKey);
    }
    let snippet = snippets[0]; // TODO Currently only a single code snippet is supported
    snippet = snippet.replace(/\s?[/#]{0,2} vuln-code-snippet start.*[\r\n]{0,2}/g, '');
    snippet = snippet.replace(/\s?[/#]{0,2} vuln-code-snippet end.*/g, '');
    snippet = snippet.replace(/.*[/#]{0,2} vuln-code-snippet hide-line[\r\n]{0,2}/g, '');
    snippet = snippet.replace(/.*[/#]{0,2} vuln-code-snippet hide-start([^])*[/#]{0,2} vuln-code-snippet hide-end[\r\n]{0,2}/g, '');
    snippet = snippet.trim();
    let lines = snippet.split('\r\n');
    if (lines.length === 1)
        lines = snippet.split('\n');
    if (lines.length === 1)
        lines = snippet.split('\r');
    const vulnLines = [];
    const neutralLines = [];
    for (let i = 0; i < lines.length; i++) {
        if (new RegExp(`vuln-code-snippet vuln-line.*${challengeKey}`).exec(lines[i]) != null) {
            vulnLines.push(i + 1);
        }
        else if (new RegExp(`vuln-code-snippet neutral-line.*${challengeKey}`).exec(lines[i]) != null) {
            neutralLines.push(i + 1);
        }
    }
    snippet = snippet.replace(/\s?[/#]{0,2} vuln-code-snippet vuln-line.*/g, '');
    snippet = snippet.replace(/\s?[/#]{0,2} vuln-code-snippet neutral-line.*/g, '');
    return { challengeKey, snippet, vulnLines, neutralLines };
}
class BrokenBoundary extends Error {
    constructor(message) {
        super(message);
        this.name = 'BrokenBoundary';
        this.message = message;
    }
}
// dont use directly, use getCodeChallenges getter
let _internalCodeChallenges = null;
async function getCodeChallenges() {
    if (_internalCodeChallenges === null) {
        _internalCodeChallenges = new Map();
        const filesWithCodeChallenges = await (0, exports.findFilesWithCodeChallenges)(exports.SNIPPET_PATHS);
        for (const fileMatch of filesWithCodeChallenges) {
            for (const codeChallenge of getCodeChallengesFromFile(fileMatch)) {
                _internalCodeChallenges.set(codeChallenge.challengeKey, {
                    snippet: codeChallenge.snippet,
                    vulnLines: codeChallenge.vulnLines,
                    neutralLines: codeChallenge.neutralLines
                });
            }
        }
    }
    return _internalCodeChallenges;
}
exports.getCodeChallenges = getCodeChallenges;
//# sourceMappingURL=codingChallenges.js.map
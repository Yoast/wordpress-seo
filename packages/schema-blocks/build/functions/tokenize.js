"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var tokenizr_1 = __importDefault(require("tokenizr"));
var lexer = new tokenizr_1.default();
lexer.rule("default", /(.*?)({{[a-zA-Z-]+|$)/, function (ctx, matches) {
    if (matches[1] && matches[1].length > 0) {
        ctx.accept("constant", matches[1]);
    }
    if (matches[2] && matches[2].slice(0, 2) === "{{") {
        ctx.state("definition");
        ctx.accept("definition", matches[2].slice(2));
    }
}, "open-instruction");
lexer.rule("definition", /\s*}}/, function (ctx) {
    ctx.untag("undefined");
    ctx.state("default");
    ctx.ignore();
}, "close-instruction");
// Options object key
lexer.rule("definition", /\s*([a-zA-Z][a-zA-Z0-9-_]*)=/, function (ctx, matches) {
    ctx.accept("key", matches[1]);
    ctx.state("definition-value");
}, "options-object-key");
// Open object
lexer.rule("definition-value", /\s*\{/, function (ctx) {
    ctx.tag("object");
    ctx.accept("object-open");
    ctx.state("definition-key");
}, "open-object");
// Close object
lexer.rule("definition-value #object", /\s*}/, function (ctx) {
    ctx.untag("object");
    ctx.accept("object-close");
    ctx.state("definition");
}, "close-object");
// Object keys
lexer.rule("definition-key #object", /\s*"([^"\\]+|\\.)*":/, function (ctx, matches) {
    ctx.accept("key", matches[1]);
    ctx.state("definition-value");
}, "object-key");
// Comma in object
lexer.rule("definition-value #object", /\s*,/, function (ctx) {
    ctx.state("definition-key");
    ctx.ignore();
}, "object-comma");
// Open array
lexer.rule("definition-value", /\s*\[/, function (ctx) {
    ctx.tag("array");
    ctx.accept("array-open");
}, "open-array");
// Close array
lexer.rule("definition-value #array", /\s*]/, function (ctx) {
    ctx.untag("array");
    ctx.accept("array-close");
    ctx.state("definition");
}, "close-array");
// Comma in array
lexer.rule("definition-value #array", /\s*,/, function (ctx) {
    ctx.ignore();
}, "array-comma");
// Number values
lexer.rule("definition-value", /\s*(\d+)/, function (ctx, matches) {
    ctx.accept("value", parseInt(matches[1], 10));
    if (!ctx.tagged("array") && !ctx.tagged("object")) {
        ctx.state("definition");
    }
}, "number-value");
// Boolean values
lexer.rule("definition-value", /\s*(true|false)/, function (ctx, matches) {
    ctx.accept("value", matches[1] === "true");
    if (!ctx.tagged("array") && !ctx.tagged("object")) {
        ctx.state("definition");
    }
}, "boolean-value");
// String values
lexer.rule("definition-value", /\s*"([^"\\]+|\\.)*"/, function (ctx, matches) {
    ctx.accept("value", matches[1]);
    if (!ctx.tagged("array") && !ctx.tagged("object")) {
        ctx.state("definition");
    }
}, "string-value");
/**
 * Tokenizes a given text.
 *
 * @param text The text.
 *
 * @returns An array of tokens.
 */
function tokenize(text) {
    lexer.reset();
    lexer.input(text);
    return lexer.tokens();
}
exports.default = tokenize;

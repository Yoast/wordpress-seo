"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var lodash_1 = require("lodash");
var separator_1 = require("./separator");
var tokenize_1 = __importDefault(require("./tokenize"));
var id = 0;
/**
 * Processes an array.
 *
 * @param tokens The tokens.
 *
 * @returns The array.
 */
function processArray(tokens) {
    var value = [];
    // Consume the array-open token.
    tokens.shift();
    while (!tokens[0].isA("array-close")) {
        if (!tokens[0].isA("value")) {
            throw "Template parse error: Array must contain values";
        }
        value.push(tokens.shift().value);
    }
    // Consume the array-close token.
    tokens.shift();
    return value;
}
/**
 * Processes an object.
 *
 * @param tokens The tokens.
 *
 * @returns The object.
 */
function processObject(tokens) {
    var value = {};
    // Consume the object-open token.
    tokens.shift();
    while (!tokens[0].isA("object-close")) {
        if (!tokens[0].isA("key") || !tokens[1].isA("value")) {
            throw "Template parse error: Object must contain key-value pairs";
        }
        var objectKey = tokens.shift().value;
        value[objectKey] = tokens.shift().value;
    }
    // Consume the object-close token.
    tokens.shift();
    return value;
}
/**
 * Processes an instruction.
 *
 * @param token            The current token.
 * @param tokens           The remaining tokens.
 * @param instructionClass The instruction class.
 *
 * @returns The instruction.
 */
function processBlockInstruction(token, tokens, instructionClass) {
    var instruction = instructionClass.create(token.value, id++);
    while (tokens[0] && tokens[0].isA("key")) {
        var key = lodash_1.camelCase(tokens.shift().value);
        var value = void 0;
        if (tokens[0].isA("array-open")) {
            value = processArray(tokens);
        }
        else if (tokens[0].isA("object-open")) {
            value = processObject(tokens);
        }
        else if (tokens[0].isA("value")) {
            value = tokens.shift().value;
        }
        instruction.options[key] = value;
    }
    return instruction;
}
/**
 * Transforms an array of tokens into a template BlockDefinition.
 *
 * @param template         The template to process.
 * @param definitionClass  The definition class.
 * @param instructionClass The instruction class.
 *
 * @return The template BlockDefinition.
 */
function process(template, definitionClass, instructionClass) {
    var tokens = tokenize_1.default(template);
    var separator = separator_1.generateUniqueSeparator(template, definitionClass.separatorCharacters);
    var definition = new definitionClass(separator);
    while (true) {
        var token = tokens.shift();
        if (!token) {
            break;
        }
        if (token.isA("constant")) {
            definition.template += token.value;
            continue;
        }
        if (token.isA("definition")) {
            var instruction = processBlockInstruction(token, tokens, instructionClass);
            definition.instructions[instruction.id] = instruction;
            if (instruction.renderable()) {
                definition.template += separator + instruction.id + separator;
            }
        }
    }
    return definitionClass.parser(definition);
}
exports.default = process;

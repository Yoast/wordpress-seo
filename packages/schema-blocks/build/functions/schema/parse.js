"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var lodash_1 = require("lodash");
var SchemaObjectLeaf_1 = __importDefault(require("../../leaves/schema/SchemaObjectLeaf"));
var SchemaArrayLeaf_1 = __importDefault(require("../../leaves/schema/SchemaArrayLeaf"));
var SchemaInstructionLeaf_1 = __importDefault(require("../../leaves/schema/SchemaInstructionLeaf"));
var SchemaConstantLeaf_1 = __importDefault(require("../../leaves/schema/SchemaConstantLeaf"));
var SchemaInterpolatedLeaf_1 = __importDefault(require("../../leaves/schema/SchemaInterpolatedLeaf"));
/**
 * Parses a JSON value.
 *
 * @param value The value being parsed.
 * @param definition The definition being parsed.
 *
 * @returns The parsed leaf.
 */
function parseValue(value, definition) {
    if (Array.isArray(value)) {
        var parsedArray = value.map(function (arrayValue) { return parseValue(arrayValue, definition); });
        return new SchemaArrayLeaf_1.default(parsedArray);
    }
    if (typeof value === "object") {
        var parsedObject = lodash_1.mapValues(value, function (objectValue) { return parseValue(objectValue, definition); });
        return new SchemaObjectLeaf_1.default(parsedObject);
    }
    if (typeof value === "number") {
        var string = value.toString();
        if (string.startsWith(definition.separator) && string.endsWith(definition.separator)) {
            var instructionId = string.slice(definition.separator.length, -definition.separator.length);
            return new SchemaInstructionLeaf_1.default(definition.instructions[instructionId]);
        }
        return new SchemaConstantLeaf_1.default(value);
    }
    if (typeof value === "string") {
        if (value.indexOf(definition.separator) === -1) {
            return new SchemaConstantLeaf_1.default(value);
        }
        var parts = value.split(definition.separator);
        var parsedParts = parts
            .map(function (partValue, i) { return (i % 2) ? definition.instructions[partValue] : partValue; })
            .filter(function (partValue) { return partValue !== ""; });
        return new SchemaInterpolatedLeaf_1.default(parsedParts);
    }
    return new SchemaConstantLeaf_1.default(value);
}
/**
 * Parses a schema definition.
 *
 * @param definition The schema definition being parsed.
 *
 * @returns The parsed schema definition.
 */
function parse(definition) {
    var value = JSON.parse(definition.template);
    definition.tree = parseValue(value, definition);
    return definition;
}
exports.default = parse;

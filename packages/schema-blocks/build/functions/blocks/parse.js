"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var lodash_1 = require("lodash");
var BlockInstructionLeaf_1 = __importDefault(require("../../leaves/blocks/BlockInstructionLeaf"));
var BlockTextLeaf_1 = __importDefault(require("../../leaves/blocks/BlockTextLeaf"));
var BlockElementLeaf_1 = __importDefault(require("../../leaves/blocks/BlockElementLeaf"));
var BlockRootLeaf_1 = __importDefault(require("../../leaves/blocks/BlockRootLeaf"));
/**
 * Parses text into leaves.
 *
 * @param text       The text.
 * @param definition The block BlockDefinition.
 *
 * @returns The parsed leaves.
 */
function parseText(text, _a) {
    var separator = _a.separator, instructions = _a.instructions;
    var parts = text.split(separator);
    return parts
        .map(function (value, i) { return (i % 2) ? new BlockInstructionLeaf_1.default(instructions[value]) : new BlockTextLeaf_1.default(value); })
        .filter(function (leaf) { return !(leaf instanceof BlockTextLeaf_1.default && leaf.value === ""); });
}
/**
 * Parses a list of nodes.
 *
 * @param nodes      The nodes.
 * @param definition The BlockDefinition being parsed.
 *
 * @returns The nodes parsed as leaves.
 */
function parseNodes(nodes, definition) {
    var parsed = lodash_1.flatMap(nodes, function (node) { return parseNode(node, definition); });
    if (parsed.length === 0) {
        return null;
    }
    return parsed;
}
/**
 * Parses a node.
 *
 * @param node       The node to be parsed.
 * @param definition The BlockDefinition being parsed.
 *
 * @returns {BlockLeaf[]} The parsed leaves.
 */
function parseNode(node, definition) {
    switch (node.nodeType) {
        case Node.TEXT_NODE:
            return parseText(node.nodeValue, definition);
        case Node.ELEMENT_NODE: {
            var leaf_1 = new BlockElementLeaf_1.default(node.nodeName.toLowerCase());
            for (var i = 0; i < node.attributes.length; i++) {
                var attribute = node.attributes[i];
                leaf_1.attributes[attribute.name] = parseText(attribute.value, definition);
            }
            leaf_1.children = parseNodes(node.childNodes, definition);
            if (leaf_1.children) {
                leaf_1.children.forEach(function (child) {
                    child.parent = leaf_1;
                });
            }
            return [leaf_1];
        }
    }
    return [];
}
/**
 * Parses a BlockDefinition.
 *
 * @param definition The BlockDefinition being parsed.
 *
 * @returns The parsed BlockDefinition.
 */
function parse(definition) {
    var parser = new DOMParser();
    var doc = parser.parseFromString(definition.template, "text/html");
    definition.tree = new BlockRootLeaf_1.default(parseNodes(doc.body.childNodes, definition));
    return definition;
}
exports.default = parse;

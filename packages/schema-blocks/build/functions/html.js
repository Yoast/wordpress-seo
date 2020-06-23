"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * Strips tags from HTML nodes.
 *
 * @param nodes The nodes.
 * @param allowedTags The allowed tags.
 */
function stripTagsFromNodes(nodes, allowedTags) {
    nodes.forEach(function (node) {
        if (node.nodeType !== Node.ELEMENT_NODE) {
            return;
        }
        var tag = node.nodeName.toLowerCase();
        if (tag === "script" || tag === "style") {
            node.remove();
            return;
        }
        stripTagsFromNodes(node.childNodes, allowedTags);
        if (allowedTags.includes(tag)) {
            return;
        }
        node.replaceWith.apply(node, Array.from(node.childNodes));
    });
}
/**
 * Strips tags from HTML.
 *
 * @param html The HTML.
 * @param allowedTags Optional. The allowed tags.
 *
 * @returns The stripped HTML.
 */
function stripTags(html, allowedTags) {
    if (allowedTags === void 0) { allowedTags = []; }
    var parser = new DOMParser();
    var document = parser.parseFromString(html, "text/html");
    stripTagsFromNodes(document.body.childNodes, allowedTags);
    return document.body.innerHTML;
}
exports.stripTags = stripTags;
/**
 * Splits nodes on a specific tag.
 *
 * @param nodes The nodes.
 * @param tag   The tag to split on.
 *
 * @returns The inner HTML of all nodes with the given tag.
 */
function splitNodesOnTag(nodes, tag) {
    var values = [];
    nodes.forEach(function (node) {
        if (node.nodeType !== Node.ELEMENT_NODE) {
            return;
        }
        var nodeTag = node.nodeName.toLowerCase();
        if (nodeTag === tag) {
            values.push(node.innerHTML);
            return;
        }
        values = values.concat(splitNodesOnTag(node.childNodes, tag));
    });
    return values;
}
/**
 * Splits HTML on a specific tag.
 *
 * @param html The HTML.
 * @param tag  The tag to spit on.
 *
 * @returns The inner HTML of each tag.
 */
function splitOnTag(html, tag) {
    var parser = new DOMParser();
    var document = parser.parseFromString(html, "text/html");
    return splitNodesOnTag(document.body.childNodes, tag);
}
exports.splitOnTag = splitOnTag;

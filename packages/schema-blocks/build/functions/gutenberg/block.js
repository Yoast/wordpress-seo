"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var data_1 = require("@wordpress/data");
/**
 * Returns a normalized block ID.
 *
 * @param block The block.
 *
 * @returns A normalized block ID.
 */
function getBlockId(block) {
    var parts = [block.name.replace(/\//g, "-")];
    var clientId = block.clientId;
    var parentClientId;
    do {
        parentClientId = data_1.select("core/block-editor").getBlockRootClientId(clientId);
        var number = data_1.select("core/block-editor").getBlockIndex(clientId, parentClientId);
        parts.push(number.toString());
        clientId = parentClientId;
    } while (parentClientId !== "");
    return parts.join("-");
}
exports.getBlockId = getBlockId;
/**
 * Returns a fully qualified schema ID for a block.
 *
 * @param block The block.
 *
 * @returns A fully qualified schema ID.
 */
function getBlockSchemaId(block) {
    return data_1.select("core/editor").getPermalink() + "#/schema/" + getBlockId(block);
}
exports.getBlockSchemaId = getBlockSchemaId;

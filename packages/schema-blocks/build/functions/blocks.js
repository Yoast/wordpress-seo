"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var data_1 = require("@wordpress/data");
/**
 * Gets attributes of inner blocks.
 *
 * @param clientId The client ID of the parent block.
 * @param blocks   A mapping of block name to attribute key.
 *
 * @returns An array contain block names and values.
 */
function getInnerBlocksAttributes(clientId, blocks) {
    var innerBlocks = data_1.select("core/block-editor").getBlock(clientId).innerBlocks;
    innerBlocks = innerBlocks.filter(function (block) { return block.name in blocks; });
    var values = [];
    for (var _i = 0, innerBlocks_1 = innerBlocks; _i < innerBlocks_1.length; _i++) {
        var block = innerBlocks_1[_i];
        var key = blocks[block.name];
        values.push({ name: block.name, value: block.attributes[key] });
    }
    return values;
}
exports.getInnerBlocksAttributes = getInnerBlocksAttributes;

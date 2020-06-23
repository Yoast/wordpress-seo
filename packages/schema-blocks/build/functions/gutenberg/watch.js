"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var lodash_1 = require("lodash");
var data_1 = require("@wordpress/data");
var SchemaDefinition_1 = require("../../core/schema/SchemaDefinition");
var updatingSchema = false;
var previousRootBlocks;
/**
 * Returns whether or not a schema definition should be rendered.
 *
 * @param definition      The definition.
 * @param parentHasSchema Whether or not a parent has already rendered schema.
 *
 * @returns Whether or not this schema should be rendered.
 */
function shouldRenderSchema(definition, parentHasSchema) {
    if (typeof definition === "undefined") {
        return false;
    }
    if (parentHasSchema && definition.separateInGraph()) {
        return true;
    }
    if (!parentHasSchema && !definition.onlyNested()) {
        return true;
    }
    return false;
}
/**
 * Renders a block's schema and updates the attributes if it has changed.
 *
 * @param block      The block to render schema for.
 * @param definition The definition of the schema.
 */
function renderSchema(block, definition) {
    var schema = definition.render(block);
    console.log("Generated shema for block: ", block, schema);
    if (lodash_1.isEqual(schema, block.attributes["yoast-schema"])) {
        return;
    }
    data_1.dispatch("core/block-editor").updateBlockAttributes(block.clientId, { "yoast-schema": schema });
}
/**
 * Generates schema for blocks.
 *
 * @param blocks          The blocks.
 * @param previousBlocks  Optional. The previous blocks used for schema generation.
 * @param parentHasSchema Optional. Whether or not the parent has already rendered schema.
 */
function generateSchemaForBlocks(blocks, previousBlocks, parentHasSchema) {
    if (previousBlocks === void 0) { previousBlocks = []; }
    if (parentHasSchema === void 0) { parentHasSchema = false; }
    console.log("Generating schema!");
    for (var i = 0; i < blocks.length; i++) {
        var block = blocks[i];
        var previousBlock = previousBlocks[i];
        if (block === previousBlock) {
            continue;
        }
        var definition = SchemaDefinition_1.schemaDefinitions[block.name];
        if (shouldRenderSchema(definition, parentHasSchema)) {
            renderSchema(block, definition);
            if (Array.isArray(block.innerBlocks)) {
                generateSchemaForBlocks(block.innerBlocks, previousBlock ? previousBlock.innerBlocks : [], true);
            }
            continue;
        }
        if (Array.isArray(block.innerBlocks)) {
            generateSchemaForBlocks(block.innerBlocks, previousBlock ? previousBlock.innerBlocks : [], parentHasSchema);
        }
    }
}
/**
 * Watches Gutenberg for relevant changes.
 */
function watch() {
    data_1.subscribe(function () {
        if (updatingSchema) {
            return;
        }
        var rootBlocks = data_1.select("core/block-editor").getBlocks();
        if (rootBlocks === previousRootBlocks) {
            return;
        }
        updatingSchema = true;
        generateSchemaForBlocks(rootBlocks, previousRootBlocks);
        previousRootBlocks = rootBlocks;
        updatingSchema = false;
    });
}
exports.default = watch;

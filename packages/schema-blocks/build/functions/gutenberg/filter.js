"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var hooks_1 = require("@wordpress/hooks");
var SchemaDefinition_1 = require("../../core/schema/SchemaDefinition");
/**
 * Filters in schema attributes for blocks.
 */
function filter() {
    hooks_1.addFilter("blocks.registerBlockType", "wordpress-seo/schema-blocks/schema-attribute", function (settings, name) {
        if (!Object.keys(SchemaDefinition_1.schemaDefinitions).includes(name)) {
            return settings;
        }
        console.log("Adding schema to: ", name);
        if (!settings.attributes) {
            settings.attributes = {};
        }
        settings.attributes["yoast-schema"] = { type: "object" };
        return settings;
    });
}
exports.default = filter;

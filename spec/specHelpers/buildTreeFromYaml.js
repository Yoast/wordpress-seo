import { load } from "js-yaml";

/**
 * Parses the given input string to a tree representation.
 *
 * @param {string} input The YAML string to parse to a tree.
 *
 * @returns {module:tree/structure.Node} The parsed tree.
 */
const buildTreeFromYaml = function( input ) {
	return load( input );
};

export default buildTreeFromYaml;

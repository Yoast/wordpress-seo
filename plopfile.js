/* External dependencies */
const _flatMap = require( "lodash/flatMap" );
const _isUndefined = require( "lodash/isUndefined" );
const isArray = require( "lodash/isArray" );
const omit = require( "lodash/omit" );
const { paramCase } = require( "change-case" );
const path = require( "path" );

/* Internal dependencies */
const configuration = require( "./scripts/plop-code-generation/configuration.js" );

const blocks = [];

const BLOCK_PREFIX = "yoast/";
const DISCLAIMER = "// THIS FILE IS GENERATED, DO NOT MANUALLY EDIT!";

const templatesPath = path.join( __dirname, "scripts/plop-templates" );
const basePath = path.join( __dirname, "js/src/structured-data-blocks" );

function mapDefinitionToData( definition ) {
	let allowedBlocks = [];
	let template = [];

	if ( definition.attributes ) {
		const attributes = definition.attributes;

		attributes.forEach( ( attribute ) => {
			let allowedChildren = [];

			switch ( attribute.source ) {
				case "area":
					if ( isArray( attribute.childrenTypes ) ) {
						allowedChildren = attribute.childrenTypes.map( child => {
							return BLOCK_PREFIX + paramCase( child );
						} );
					}

					allowedBlocks = allowedBlocks.concat( allowedChildren );
					break;
			}
		} );

		if ( isArray( definition.editTemplate ) ) {
			template = definition.editTemplate.map( ( templateEntry ) => {
				return [ BLOCK_PREFIX + paramCase( templateEntry ), {}, [] ];
			} );
		}
	}

	return {
		templateLock: false,
		template: JSON.stringify( template ),
		allowedBlocks: JSON.stringify( allowedBlocks ),
		type: definition[ "@type" ],
		title: definition.blockLabel || definition[ "@type" ],
		description: definition.description || "",
		icon: definition.icon || "",
		keywords: JSON.stringify( definition.keywords || [] ),
		multiple: _isUndefined( definition.multiple ) ? true : definition.multiple,
		blockPrefix: BLOCK_PREFIX,
		disclaimer: DISCLAIMER,
	};
}

const generators = _flatMap( configuration, ( definitions, definitionPath ) => {
	return _flatMap( definitions, definition => {
		const data = mapDefinitionToData( definition );

		blocks.push( {
			block: data.type,
			path: definitionPath + "/",
		} );

		return {
			name: data.type,
			description: "Generate code for " + data.type + " block",
			prompts: [],
			actions: [
				{
					type: "add",
					path: path.join( basePath, definitionPath, `register-${data.type}.js` ),
					templateFile: path.join( templatesPath, "structural-block-registration.hbs" ),
					data: data,
					force: true,
				},
				{
					type: "add",
					path: path.join( basePath, definitionPath, `${data.type}.js` ),
					templateFile: path.join( templatesPath, "structural-block-component.hbs" ),
					data: data,
					force: true,
				},
			],
		};
	} );
} );

// Required viewing: https://www.youtube.com/watch?v=o3YWv4pWqk4.
module.exports = function( plop ) {
	generators.forEach( ( generator ) => {
		plop.setGenerator( "structural-blocks-" + generator.name, omit( generator, [ "name" ] ) );
	} );

	plop.setGenerator( "structural-blocks-list", {
		description: "Generate the registration of all the structural blocks",
		prompts: [],
		actions: [
			{
				type: "add",
				path: path.join( basePath, "index.js" ),
				templateFile: path.join( templatesPath, "structural-blocks-list.hbs" ),
				data: {
					blocks: blocks,
					disclaimer: DISCLAIMER,
				},
				force: true,
			},
		],
	} );
};

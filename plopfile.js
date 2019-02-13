/* External dependencies */
const _flatMap = require( "lodash/flatMap" );
const _isUndefined = require( "lodash/isUndefined" );
const isArray = require( "lodash/isArray" );
const omit = require( "lodash/omit" );
const { paramCase } = require( "change-case" );
const path = require( "path" );

/* Internal dependencies */
const mainConfiguration = require( "./scripts/plop-code-generation/configuration.js" );

const BLOCK_PREFIX = "yoast/";
const DISCLAIMER = "// THIS FILE IS GENERATED, DO NOT MANUALLY EDIT!";

const templatesPath = path.join( __dirname, "scripts/plop-templates" );
const basePath = path.join( __dirname, "js/src/structured-data-blocks" );

function createBlockName( entityName ) {
	return BLOCK_PREFIX + paramCase( entityName );
}

function mapDefinitionToBlockData( definition ) {
	let allowedBlocks = [];
	let template = [];
	let templateLock = false;

	if ( definition.attributes ) {
		const attributes = definition.attributes;

		attributes.forEach( ( attribute ) => {
			let allowedChildren = [];

			const { collection, source, type, childrenTypes } = attribute;

			switch ( source ) {
				case "area":
					switch ( type ) {
						case "array":

							if ( collection === false ) {
								templateLock = true;
								if ( isArray( childrenTypes ) ) {
									allowedChildren = childrenTypes.map( child => {
										return createBlockName( child );
									} );
								}
							} else {
								// Because this is an array we need to use the collection as the allowed block.
								allowedChildren.push( createBlockName( collection.name ) );
							}
							break;

						default:
							if ( isArray( childrenTypes ) ) {
								allowedChildren = childrenTypes.map( child => {
									return createBlockName( child );
								} );
							}
							break;
					}

					allowedBlocks = allowedBlocks.concat( allowedChildren );
					break;
			}
		} );

		if ( isArray( definition.editTemplate ) ) {
			template = definition.editTemplate.map( ( templateEntry ) => {
				return [ createBlockName( templateEntry ), {}, [] ];
			} );
		}
	}

	return {
		templateLock: templateLock,
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

const blocksToGenerate = [];

function isCollectionAttribute( attribute ) {
	return attribute.source === "area" && attribute.type === "array";
}

function walkAttributes( definitionPath, attributes = [] ) {
	attributes.forEach( attribute => {

		console.log( attribute );
		console.log( isCollectionAttribute( attribute ) );

		if ( isCollectionAttribute( attribute ) ) {
			const { collection } = attribute;

			if ( collection === false ) {
				return;
			}

			// TODO: Maybe allow template in definition
			const template = [];
			const allowedBlocks = attribute.childrenTypes.map( createBlockName );

			// Create new block with the collection name
			const blockData = {
				templateLock: false,
				template: false,
				allowedBlocks: JSON.stringify( allowedBlocks ),
				type: collection.name,
				title: collection.title || collection.name,
				description: collection.description || "",
				icon: collection.icon || "",
				keywords: JSON.stringify( collection.keywords || [] ),
				multiple: _isUndefined( collection.multiple ) ? true : collection.multiple,
				blockPrefix: BLOCK_PREFIX,
				disclaimer: DISCLAIMER,
			};

			blocksToGenerate.push( {
				data: blockData,
				definitionPath,
			} );
		}
	} );
}

function walkDefinitions( definitions, definitionPath ) {
	definitions.forEach( definition => {
		const data = mapDefinitionToBlockData( definition );
		walkAttributes( definitionPath, definition.attributes );

		blocksToGenerate.push( {
			data,
			definitionPath,
		} );
	} );
}

function walkConfiguration( configuration ) {
	Object.keys( configuration ).forEach( definitionPath => {
		const definitions = configuration[ definitionPath ];

		walkDefinitions( definitions, definitionPath );
	} );
}

function mapBlockToGenerator( block ) {
	const { data, definitionPath } = block;

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
}

function mapBlocksToGenerators( blocks ) {
	return blocks.map( mapBlockToGenerator );
}

function mapBlockToImport( block ) {
	return {
		block: block.data.type,
		path: block.definitionPath + "/",
	};
}

function mapBlocksToImports( blocks ) {
	return blocks.map( mapBlockToImport );
}

walkConfiguration( mainConfiguration );
const generators = mapBlocksToGenerators( blocksToGenerate );
const blockImports = mapBlocksToImports( blocksToGenerate );

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
					blocks: blockImports,
					disclaimer: DISCLAIMER,
				},
				force: true,
			},
		],
	} );
};

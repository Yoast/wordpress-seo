import ParsedPaper from "../ParsedPaper";
import { forEach } from "lodash";

/**
 * A class responsible for pre-processing the Paper, returning a ParsedPaper.
 *
 * @module parsedPaper
 *
 * @see module:parsedPaper/builder
 * @see module:parsedPaper/structure
 */
class PaperParser {
	/**
	 * Constructs a PaperParser class.
	 *
	 * @param {Function} treeBuilder A function that receives text and returns a tree.
	 *
	 * @constructor
	 */
	constructor( treeBuilder ) {
		this._parsedPaper = new ParsedPaper();
		this._treeBuilder = treeBuilder;

		this._metaDataModifiers = {};
	}

	/**
	 * Processes a Paper resulting in a ParsedPaper.
	 *
	 * @param {Paper} paper The Paper to parse.
	 *
	 * @returns {ParsedPaper} A parsedPaper instance.
	 */
	parse( paper ) {
		// Build tree and set it to the ParsedPaper.
		this._parsedPaper.setTree(
			this._treeBuilder( paper.getText() )
		);

		// Build metaData and set it to the ParsedPaper.
		this._parsedPaper.setMetaData(
			this.constructMetaData( paper )
		);

		return this._parsedPaper;
	}

	/**
	 * Constructs the metaData from the Paper.
	 *
	 * @param {Paper} paper The paper to construct the metaData from.
	 *
	 * @returns {Object} The metaData.
	 */
	constructMetaData( paper ) {
		let metaData = {};

		// Map things to metaData.

		// Run additional modifiers;
		metaData = Object.assign( {}, this.runMetaDataModifiers( metaData, paper ) );

		return metaData;
	}

	/**
	 * Sets a metaData modifying function behind a function name on the internal metaDataModifiers object.
	 *
	 * @param {string}   modifierName       The name of the to be registered function.
	 * @param {Function} modifierFunction   The function that modifies the metaData. Should accept a metaData object
	 * 									    and optionally the paper.
	 * @returns {void}
	 */
	registerMetaDataModifier( modifierName, modifierFunction ) {
		/*
		 * The metaDataModifier should accept the metaData and return the altered metaData.
		 */
		this._metaDataModifiers[ modifierName ] = modifierFunction;
	}

	/**
	 * Runs all registered metaDataModifiers.
	 * If one of the functions errors, it is skipped and its metaData changes are discarded.
	 *
	 * @param {Object} metaData The initial state of the metaData, that should be modified.
	 * @param {Paper}  paper    The paper.
	 *
	 * @returns {Object} A modified metaData object.
	 */
	runMetaDataModifiers( metaData, paper ) {
		let modifiedMetaData = metaData;
		forEach( this._metaDataModifiers, ( modifierFunction, modifierName ) => {
			try {
				const previousMetaData = Object.assign( {}, modifiedMetaData );
				modifiedMetaData = modifierFunction( previousMetaData, paper );
			} catch ( modifierError ) {
				console.warn( `An error with message "${ modifierError.message}" occurred in metaData modifier ` +
				`function called ${ modifierName }. Skipping that function...` );
			}
		} );
		return modifiedMetaData;
	}
}

export default PaperParser;

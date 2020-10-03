import { merge } from "lodash-es";
import InvalidTypeError from "../../errors/invalidType";
import MissingArgument from "../../errors/missingArgument";
import { isUndefined } from "lodash-es";
import { isEmpty } from "lodash-es";

/**
 * The researches contains all the researches
 */
export default class Researcher {
	/**
	 * Constructor
	 * @param {Paper} paper The Paper object that is needed within the researches.
	 * @constructor
	 */
	constructor( paper ) {
		this.paper = paper;

		this.defaultResearches = {};

		this._data = {};

		this.customResearches = {};
	}

	/**
	 * Set the Paper associated with the Researcher.
	 * @param {Paper} paper The Paper to use within the Researcher
	 * @throws {InvalidTypeError} Parameter needs to be an instance of the Paper object.
	 * @returns {void}
	 */
	setPaper( paper ) {
		this.paper = paper;
	}

	/**
	 * Add a custom research that will be available within the Researcher.
	 * @param {string} name A name to reference the research by.
	 * @param {function} research The function to be added to the Researcher.
	 * @throws {MissingArgument} Research name cannot be empty.
	 * @throws {InvalidTypeError} The research requires a valid Function callback.
	 * @returns {void}
	 */
	addResearch( name, research ) {
		if (isUndefined( name ) || isEmpty( name )) {
			throw new MissingArgument( "Research name cannot be empty" );
		}

		if ( ! ( research instanceof Function ) ) {
			throw new InvalidTypeError( "The research requires a Function callback." );
		}

		this.customResearches[ name ] = research;
	}

	/**
	 * Check whether or not the research is known by the Researcher.
	 * @param {string} name The name to reference the research by.
	 * @returns {boolean} Whether or not the research is known by the Researcher
	 */
	hasResearch( name ) {
		return Object.keys( this.getAvailableResearches() ).filter(
			function( research ) {
				return research === name;
			} ).length > 0;
	}

	/**
	 * Return all available researches.
	 * @returns {Object} An object containing all available researches.
	 */
	getAvailableResearches() {
		return merge( this.defaultResearches, this.customResearches );
	}

	/**
	 * Return the Research by name.
	 * @param {string} name The name to reference the research by.
	 *
	 * @returns {*} Returns the result of the research or false if research does not exist.
	 * @throws {MissingArgument} Research name cannot be empty.
	 */
	getResearch( name ) {
		if ( isUndefined( name ) || isEmpty( name ) ) {
			throw new MissingArgument( "Research name cannot be empty" );
		}

		if ( ! this.hasResearch( name ) ) {
			return false;
		}

		return this.getAvailableResearches()[ name ]( this.paper, this );
	}

	/**
	 * Add research data to the researcher by the research name.
	 *
	 * @param {string} research The identifier of the research.
	 * @param {Object} data     The data object.
	 *
	 * @returns {void}.
	 */
	addResearchData( research, data ) {
		this._data[ research ] = data;
	}

	/**
	 * Return the research data from a research data provider by research name.
	 *
	 * @param {string} research The identifier of the research.
	 *
	 * @returns {*} The data provided by the provider, false if the data do not exist
	 */
	getData( research ) {
		if ( this._data.hasOwnProperty( research ) ) {
			return this._data[ research ];
		}

		return false;
	}
}

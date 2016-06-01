/* global require */
(function() {
	'use strict';

	var isUndefined = require( 'lodash/isUndefined' );
	var isEmpty = require( 'lodash/isEmpty' );
	var indexOf = require( 'lodash/indexOf' );
	var defaults = require( 'lodash/defaults' );

	var defaultOptions = { source: 'wpseoReplaceVarsL10n', scope: [], aliases: [] };

	/**
	 * Constructs the replace var.
	 *
	 * @param {string} placeholder The placeholder to search for.
	 * @param {string} replacement The name of the property to search for as an replacement.
	 * @param {object} [options] The options to be used to determine things as scope, source and search for aliases.
	 * @constructor
	 */
	var ReplaceVar = function( placeholder, replacement, options ) {
		this.placeholder    = placeholder;
		this.replacement    = replacement;

		this.options        = defaults( options, defaultOptions );
	};

	/**
	 * Gets the placeholder for the current replace var.
	 *
	 * @param {bool} [includeAliases] Whether or not to include aliases when getting the placeholder.
	 * @returns {string} The placeholder.
	 */
	ReplaceVar.prototype.getPlaceholder = function( includeAliases ) {
		includeAliases = includeAliases || false;

		if ( includeAliases && this.hasAlias() ) {
			return this.placeholder + '|' + this.getAliases().join('|');
		}

		return this.placeholder;
	};

	/**
	 * Override the source of the replacement.
	 *
	 * @param {string} source The source to use.
	 */
	ReplaceVar.prototype.setSource = function( source ) {
		this.options.source = source;
	};

	/**
	 * Determines whether or not the replace var has a scope defined.
	 *
	 * @returns {boolean} Returns true if a scope is defined and not empty.
	 */
	ReplaceVar.prototype.hasScope = function() {
		return ! isEmpty( this.options.scope );
	};

	/**
	 * Adds a scope to the replace var.
	 *
	 * @param {string} scope The scope to add.
	 */
	ReplaceVar.prototype.addScope = function( scope ) {
		if ( ! this.hasScope() ) {
			this.options.scope = [];
		}

		this.options.scope.push( scope );
	};

	/**
	 * Determines whether the passed scope is defined in the replace var.
	 *
	 * @param {string} scope The scope to check for.
	 * @returns {boolean} Whether or not the passed scope is present in the replace var.
	 */
	ReplaceVar.prototype.inScope = function( scope ) {
		if ( ! this.hasScope() ) {
			return true;
		}

		return indexOf( this.options.scope, scope ) > -1;
	};

	/**
	 * Determines whether or not the current replace var has an alias.
	 *
	 * @returns {boolean} Whether or not the current replace var has one or more aliases.
	 */
	ReplaceVar.prototype.hasAlias = function() {
		return ! isEmpty( this.options.aliases );
	};

	/**
	 * Adds an alias to the replace var.
	 *
	 * @param {string} alias The alias to add.
	 */
	ReplaceVar.prototype.addAlias = function( alias ) {
		if ( ! this.hasAlias() ) {
			this.options.aliases = [];
		}

		this.options.aliases.push( alias );
	};

	/**
	 * Gets the aliases for the current replace var.
	 *
	 * @returns {array} The aliases available to the replace var.
	 */
	ReplaceVar.prototype.getAliases = function() {
		return this.options.aliases;
	};

	module.exports = ReplaceVar;
}());

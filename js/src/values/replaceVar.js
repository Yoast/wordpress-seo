'use strict';

var isUndefined = require( 'lodash/isUndefined' );
var indexOf = require( 'lodash/indexOf' );
var defaults = require( 'lodash/defaults' );

/**
 * Constructs the replace var
 *
 * @param placeholder
 * @param replacement
 * @param options
 * @constructor
 */
var ReplaceVar = function( placeholder, replacement, options ) {
	this.placeholder    = placeholder;
	this.replacement    = replacement;

	this.options        = defaults( options, { source: 'wpseoReplaceVarsL10n', scope: [], aliases: [] } );
};

ReplaceVar.prototype.getPlaceholder = function( includeAliases ) {
	includeAliases = includeAliases || false;

	if ( includeAliases === true && this.hasAlias() ) {
		return this.placeholder + '|' + this.getAliases().join('|');
	}

	return this.placeholder;
};

/**
 * Override the source of the replacement
 *
 * @param source
 */
ReplaceVar.prototype.setSource = function( source ) {
	this.options.source = source;
};

ReplaceVar.prototype.hasScope = function() {
	return isUndefined( this.options.scope ) === false && this.options.scope.length > 0;
};

ReplaceVar.prototype.setScope = function( scope ) {
	if ( this.hasScope() === false ) {
		this.options.scope = [];
	}

	this.options.scope.push( scope );
};

ReplaceVar.prototype.inScope = function( scope ) {
	if ( this.hasScope() === false ) {
		return true;
	}

	return indexOf( this.options.scope, scope ) > -1;
};

ReplaceVar.prototype.hasAlias = function() {
	return isUndefined( this.options.aliases ) === false && this.options.aliases.length > 0;
};

ReplaceVar.prototype.setAlias = function( alias ) {
	if ( this.hasAlias() === false ) {
		this.options.aliases = [];
	}

	this.options.aliases.push( alias );
};

ReplaceVar.prototype.getAliases = function() {
	return this.options.aliases;
};

module.exports = ReplaceVar;

var addClass = require( "./../addClass" );
var addModifierToClass = require( "./addModifierToClass" );

/**
 * Adds a BEM modifier to an element
 *
 * @param {string} modifier Modifier to add to the target
 * @param {string} targetClass The target to add the modifier to
 * @param {HTMLElement} targetParent The parent in which the target should be
 */
function addModifier( modifier, targetClass, targetParent ) {
	var element = targetParent.getElementsByClassName( targetClass )[0];
	var newClass = addModifierToClass( modifier, targetClass );

	addClass( element, newClass );
}

module.exports = addModifier;

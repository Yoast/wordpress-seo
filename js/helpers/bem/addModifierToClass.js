/**
 * Adds a modifier to a class name, makes sure
 *
 * @param {string} modifier
 * @param {string} className
 */
function addModifierToClass( modifier, className ) {
	var baseClass = className.replace( /--.+/, '' );

	return baseClass + "--" + modifier;
}

module.exports = addModifierToClass;

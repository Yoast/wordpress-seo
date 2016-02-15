module.exports = function (i18n, descriptionValue, descriptionReplacements) {
	var value = descriptionValue || "";
	var replacements = descriptionReplacements || [];

	if ( value === "" ) {
		return value;
	}

	if ( replacements.length > 0)  {
		// Return formatted value
		console.log(descriptionReplacements)
		return i18n.sprintf(value.text, descriptionReplacements);
	}

	// Return translated value
	return value;
}

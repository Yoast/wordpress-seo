import { TITLE_VARIABLE_REPLACE } from "../constants";

/**
 * Enforces the title replacement variable ('%%title%%' for posts, '%%term_title%%' for terms) in a template.
 *
 * @param {string} template The template.
 * @param {string} contentType The content type ('post' or 'term').
 * @returns {string} The template; either including the replacement variable or being the replacement variable.
 */
export const enforceTitleVariable = ( template, contentType ) =>
	template.includes( TITLE_VARIABLE_REPLACE[ contentType ] ) ? template : TITLE_VARIABLE_REPLACE[ contentType ];

import fs from "fs";
import path from "path";

/**
 *
 * @param {string} language The language of the text
 * @param {string} textName The name of the text
 * @returns {*} The test text from an html fle
 */
export default function( language, textName ) {
	return fs.readFileSync(
		path.join( "./spec/fullTextTests/testTexts", language, `${textName}.html` ),
		{ encoding: "UTF8" } );
}

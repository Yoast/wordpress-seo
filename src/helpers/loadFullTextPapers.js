import fs from "fs";
import path from "path";

/**
 *
 * @param language
 * @param textName
 * @returns {*}
 */
export default function ( language, textName )
{
	return fs.readFileSync(
		path.join( "./spec/fullTextTests/testTexts", language, `${textName}.html` ),
		{ encoding: "UTF8" } );
}
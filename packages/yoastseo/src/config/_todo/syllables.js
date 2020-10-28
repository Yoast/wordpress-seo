/** @module config/syllables */

import getLanguage from '../../languageProcessing/helpers/language/getLanguage.js';

import de from "./syllables/de.json";
import en from "./syllables/en.json";
import nl from "./syllables/nl.json";
import it from "./syllables/it.json";
import ru from "./syllables/ru.json";
import fr from "./syllables/fr.json";
import es from "./syllables/es.json";
import pt from "./syllables/pt.json";

const languages = { de, nl, en, it, ru, fr, es, pt };

export default function( locale = "en_US" ) {
	let language = getLanguage( locale );

	if ( languages.hasOwnProperty( language ) ) {
		return languages[ language ];
	}

	// If an unknown locale is used, default to English.
	return languages[ "en" ];
}

<?php

namespace Yoast\WP\SEO\Helpers;

/**
 * A helper object for language features.
 */
class Language_Helper {

	/**
	 * Checks whether word form recognition is active for the used language.
	 *
	 * @param string $language The used language.
	 *
	 * @return boolean Whether word form recognition is active for the used language.
	 */
	public function is_word_form_recognition_active( $language ) {
		$supported_languages = [ 'de', 'en', 'es', 'fr', 'it', 'nl', 'ru', 'id', 'pt', 'pl', 'ar' ];

		return \in_array( $language, $supported_languages, true );
	}

	/**
	 * Checks whether the given language has function word support.
	 * (E.g. function words are used or filtered out for this language when doing some SEO and readability assessments).
	 *
	 * @param string $language The language to check.
	 *
	 * @return bool Whether the language has function word support.
	 */
	public function has_function_word_support( $language ) {
		$supported_languages = [ 'en', 'de', 'nl', 'fr', 'es', 'it', 'pt', 'ru', 'pl', 'sv', 'id', 'he', 'ar' ];

		return \in_array( $language, $supported_languages, true );
	}
}

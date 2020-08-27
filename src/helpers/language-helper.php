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
		$supported_languages = [ 'de', 'en', 'es', 'fr', 'it', 'nl', 'ru', 'id', 'pt', 'pl' ];

		return \in_array( $language, $supported_languages, true );
	}
}

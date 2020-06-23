<?php
/**
 * A helper object for language features.
 *
 * @package Yoast\YoastSEO\Helpers
 */

namespace Yoast\WP\SEO\Helpers;

/**
 * Class Language_Helper
 */
class Language_Helper {

	/**
	 * List of word form supported languages.
	 *
	 * This list needs to be changed on the wordpress-seo repository!
	 *
	 * @var string[]
	 */
	protected $word_form_languages = [ 'de', 'en', 'es', 'fr', 'it', 'nl', 'ru' ];

	/**
	 * List of prominent words supported languages.
	 *
	 * This list needs to be changed on the wordpress-seo repository!
	 *
	 * @var string[]
	 */
	protected $prominent_words_languages = [ 'en', 'de', 'nl', 'es', 'fr', 'it', 'pt', 'ru', 'pl', 'sv', 'id' ];

	/**
	 * Checks whether word form recognition is active for the used language.
	 *
	 * @param string $language The used language.
	 *
	 * @return boolean Whether word form recognition is active for the used language.
	 */
	public function is_word_form_recognition_active( $language ) {
		return in_array( $language, $this->word_form_languages, true );
	}

	/**
	 * Checks whether the language supports prominent words.
	 *
	 * @param string $language The used language.
	 *
	 * @return boolean Whether the supplied language supports prominent words.
	 */
	public function is_prominent_words_supported( $language ) {
		return in_array( $language, $this->prominent_words_languages, true );
	}
}

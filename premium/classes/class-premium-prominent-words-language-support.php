<?php
class WPSEO_Premium_Prominent_Words_Language_Support {

	protected $supported_languages = array( 'en', 'de' );

	/**
	 * Returns whether the current language is supported for the link suggestions.
	 *
	 * @return bool Whether the current language is supported for the link suggestions.
	 */
	public function is_language_supported( $locale ) {
		$language = WPSEO_Utils::get_language( get_locale() );
		return in_array( $language, $this->supported_languages );
	}

}

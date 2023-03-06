<?php
/**
 * WPSEO plugin file.
 *
 * @package WPSEO\Internals
 * @since   5.9.0
 */

/**
 * Group of language utility methods for use by WPSEO.
 * All methods are static, this is just a sort of namespacing class wrapper.
 */
class WPSEO_Language_Utils {

	/**
	 * Returns the language part of a given locale, defaults to english when the $locale is empty.
	 *
	 * @param string|null $locale The locale to get the language of.
	 *
	 * @return string The language part of the locale.
	 */
	public static function get_language( $locale = null ) {
		$language = 'en';

		if ( empty( $locale ) || ! is_string( $locale ) ) {
			return $language;
		}

		$locale_parts = explode( '_', $locale );

		if ( ! empty( $locale_parts[0] ) && ( strlen( $locale_parts[0] ) === 2 || strlen( $locale_parts[0] ) === 3 ) ) {
			$language = $locale_parts[0];
		}

		return $language;
	}

	/**
	 * Returns the full name for the sites' language.
	 *
	 * @return string The language name.
	 */
	public static function get_site_language_name() {
		require_once ABSPATH . 'wp-admin/includes/translation-install.php';

		$translations = wp_get_available_translations();
		$locale       = get_locale();
		$language     = isset( $translations[ $locale ] ) ? $translations[ $locale ]['native_name'] : 'English (US)';

		return $language;
	}

	/**
	 * Returns the l10n array for the knowledge graph company info missing.
	 *
	 * @deprecated 20.3
	 * @codeCoverageIgnore
	 *
	 * @return array The l10n array.
	 */
	public static function get_knowledge_graph_company_info_missing_l10n() {
		_deprecated_function( __METHOD__, 'Yoast SEO 20.3' );

		return [
			'URL'     => esc_url( WPSEO_Shortlinker::get( 'https://yoa.st/3r3' ) ),
			/* translators: 1: expands to a link opening tag; 2: expands to a link closing tag */
			'message' => esc_html__(
				'A company name and logo need to be set for structured data to work properly. Since you haven’t set these yet, we are using the site name and logo as default values. %1$sLearn more about the importance of structured data.%2$s',
				'wordpress-seo'
			),
		];
	}
}

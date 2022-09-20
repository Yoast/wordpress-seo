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
	 * Returns the user locale for the language to be used in the admin.
	 *
	 * WordPress 4.7 introduced the ability for users to specify an Admin language
	 * different from the language used on the front end. This checks if the feature
	 * is available and returns the user's language, with a fallback to the site's language.
	 * Can be removed when support for WordPress 4.6 will be dropped, in favor
	 * of WordPress get_user_locale() that already fallbacks to the site's locale.
	 *
	 * @deprecated 15.6
	 * @codeCoverageIgnore
	 *
	 * @return string The locale.
	 */
	public static function get_user_locale() {
		_deprecated_function( __METHOD__, 'WPSEO 15.5', 'get_user_locale' );
		return get_user_locale();
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
	 * @return array The l10n array.
	 */
	public static function get_knowledge_graph_company_info_missing_l10n() {
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

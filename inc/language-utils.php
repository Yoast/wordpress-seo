<?php
/**
 * @package    WPSEO\Internals
 * @since      5.9.0
 */

/**
 * Group of language utility methods for use by WPSEO.
 * All methods are static, this is just a sort of namespacing class wrapper.
 */
class WPSEO_Language_Utils {
	/**
	 * Returns the language part of a given locale, defaults to english when the $locale is empty.
	 *
	 * @param string $locale The locale to get the language of.
	 *
	 * @returns string The language part of the locale.
	 */
	public static function get_language( $locale = null ) {
		$language = 'en';

		if ( ! empty( $locale ) && strlen( $locale ) >= 2 ) {
			$language = substr( $locale, 0, 2 );
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
	 * @returns string The locale.
	 */
	public static function get_user_locale() {
		if ( function_exists( 'get_user_locale' ) ) {
			return get_user_locale();
		}

		return get_locale();
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
}

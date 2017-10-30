<?php
/**
 * @package    WPSEO
 * @subpackage Internal
 */

/**
 * Class containing methods for WPSEO Advanced Settings.
 */
class WPSEO_Advanced_Settings {

	/**
	 * @var array The default advanced pages.
	 */
	private static $default_advanced_pages = array(
		'wpseo_titles',
		'wpseo_social',
		'wpseo_xml',
		'wpseo_advanced',
		'wpseo_tools',
	);

	/**
	 * @var array Additional advanced settings pages.
	 */
	private static $additional_advanced_pages = array();

	/**
	 * Gets the list of default advanced pages.
	 *
	 * @return array The default advanced pages.
	 */
	public static function get_advanced_pages() {
		return self::$default_advanced_pages;
	}

	/**
	 * Adds a page as an advanced settings page if it isn't already present or a default page.
	 *
	 * @param string $page The page to add.
	 *
	 * @returns void
	 */
	public static function add_advanced_page( $page ) {
		if ( ! in_array( $page, self::$default_advanced_pages, true ) && ! in_array( $page, self::$additional_advanced_pages, true ) ) {
			self::$additional_advanced_pages[] = $page;
		}
	}

	/**
	 * Checks if the current page is a Yoast SEO advanced settings page.
	 *
	 * @param string $page The page to check.
	 *
	 * @return bool Whether or not the page is considered an advanced settings page.
	 */
	public static function is_advanced_settings_page( $page ) {
		if ( is_string( $page ) ) {
			return in_array( $page, self::$default_advanced_pages, true ) || in_array( $page, self::$additional_advanced_pages, true );
		}

		return false;
	}
}

<?php
/**
 * WPSEO plugin file.
 *
 * @package WPSEO\Admin
 */

/**
 * This class adds the Social tab to the Yoast SEO metabox and makes sure the settings are saved.
 *
 * @deprecated 14.6
 *
 * @codeCoverageIgnore
 */
class WPSEO_Social_Admin extends WPSEO_Metabox {

	/**
	 * Class constructor.
	 *
	 * @deprecated 14.6
	 *
	 * @codeCoverageIgnore
	 */
	public function __construct() {
		_deprecated_function( __METHOD__, 'WPSEO 14.6' );
	}

	/**
	 * Translate text strings for use in the meta box.
	 *
	 * IMPORTANT: if you want to add a new string (option) somewhere, make sure you add that array key to
	 * the main meta box definition array in the class WPSEO_Meta() as well!!!!
	 *
	 * @deprecated 14.6
	 *
	 * @codeCoverageIgnore
	 */
	public static function translate_meta_boxes() {
		_deprecated_function( __METHOD__, 'WPSEO 14.6' );
	}

	/**
	 * Returns the metabox section for the social settings.
	 *
	 * @deprecated 14.6
	 *
	 * @codeCoverageIgnore
	 *
	 * @return WPSEO_Metabox_Collapsibles_Sections
	 */
	public function get_meta_section() {
		_deprecated_function( __METHOD__, 'WPSEO 14.6' );

		return null;
	}

	/**
	 * Returns the Upgrade to Premium notice.
	 *
	 * @deprecated 14.6
	 *
	 * @codeCoverageIgnore
	 *
	 * @param string $network The social network.
	 *
	 * @return string The notice HTML on the free version, empty string on premium.
	 */
	public function get_premium_notice( $network ) {
		_deprecated_function( __METHOD__, 'WPSEO 14.6' );

		return 'class_social_admin';
	}

	/**
	 * Filter over the meta boxes to save, this function adds the Social meta boxes.
	 *
	 * @deprecated 14.6
	 *
	 * @codeCoverageIgnore
	 *
	 * @param array $field_defs Array of metaboxes to save.
	 *
	 * @return array
	 */
	public function save_meta_boxes( $field_defs ) {
		_deprecated_function( __METHOD__, 'WPSEO 14.6' );

		return [];
	}

	/**
	 * This method will compare opengraph fields with the posted values.
	 *
	 * When fields are changed, the facebook cache will be purged.
	 *
	 * @deprecated 14.6
	 *
	 * @codeCoverageIgnore
	 *
	 * @param WP_Post $post Post instance.
	 */
	public function og_data_compare( $post ) {
		_deprecated_function( __METHOD__, 'WPSEO 14.6' );
	}
}

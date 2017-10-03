<?php
/**
 * @package WPSEO\Premium
 */

/**
 * Represents some util helpers for the orphaned posts.
 */
class WPSEO_Premium_Orphaned_Content_Utils {

	/**
	 * Checks if the orphaned content feature is enabled.
	 *
	 * @return bool True when the text link counter is enabled.
	 */
	public static function is_feature_enabled() {
		static $options;

		if ( ! WPSEO_Link_Table_Accessible::is_accessible() || ! WPSEO_Meta_Table_Accessible::is_accessible() ) {
			return false;
		}

		if ( $options === null ) {
			$options = WPSEO_Options::get_options( array( 'wpseo' ) );
		}

		return $options['enable_text_link_counter'];
	}

	/**
	 * Checks if there are unprocessed objects.
	 *
	 * @return bool True when there are unprocessed objects.
	 */
	public static function has_unprocessed_content() {
		static $has_unprocessed_posts;

		if ( $has_unprocessed_posts === null ) {
			$has_unprocessed_posts = WPSEO_Link_Query::has_unprocessed_posts( WPSEO_Link_Utils::get_public_post_types() );
		}

		return $has_unprocessed_posts;
	}
}

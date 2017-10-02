<?php
/**
 * @package WPSEO\Premium
 */

/**
 * Represents some util helpers for the orphaned posts.
 */
class WPSEO_Premium_Orphaned_Post_Utils {

	/**
	 * Checks if the text link counter is enabled.
	 *
	 * @return bool True when the text link counter is enabled.
	 */
	public static function is_link_feature_enabled() {
		static $options;

		if ( $options === null ) {
			$options = WPSEO_Options::get_options( array( 'wpseo' ) );
		}

		return $options['enable_text_link_counter'];
	}

	/**
	 * Checks if there aren't unprocessed posts.
	 *
	 * @return bool True when there aren't unprocessed posts.
	 */
	public static function can_count_orphaned_posts() {
		static $can_count_orphaned_posts;

		if ( $can_count_orphaned_posts === null ) {
			$can_count_orphaned_posts = ! WPSEO_Link_Query::has_unprocessed_posts( WPSEO_Link_Utils::get_public_post_types() );
		}

		return $can_count_orphaned_posts;
	}

	/**
	 * Checks if the text link feature is enabled and there are no unprocessed posts.
	 *
	 * @return bool True when feature is active.
	 */
	public static function is_link_feature_active() {
		return self::is_link_feature_enabled() && self::can_count_orphaned_posts();
	}
}

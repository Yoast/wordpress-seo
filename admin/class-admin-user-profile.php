<?php
/**
 * WPSEO plugin file.
 *
 * @package WPSEO\Admin
 * @since   1.8.0
 */

/**
 * Customizes user profile.
 */
class WPSEO_Admin_User_Profile {

	/**
	 * Class constructor.
	 */
	public function __construct() {
		add_action( 'update_user_meta', [ $this, 'clear_author_sitemap_cache' ], 10, 3 );
	}

	/**
	 * Clear author sitemap cache when settings are changed.
	 *
	 * @since 3.1
	 *
	 * @param int    $meta_id   The ID of the meta option changed.
	 * @param int    $object_id The ID of the user.
	 * @param string $meta_key  The key of the meta field changed.
	 *
	 * @return void
	 */
	public function clear_author_sitemap_cache( $meta_id, $object_id, $meta_key ) {
		if ( $meta_key === '_yoast_wpseo_profile_updated' ) {
			WPSEO_Sitemaps_Cache::clear( [ 'author' ] );
		}
	}
}

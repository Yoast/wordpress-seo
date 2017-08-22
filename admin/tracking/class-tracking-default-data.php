<?php
/**
 * @package WPSEO\Admin\Tracking
 */

/**
 * Represents the default data.
 */
class WPSEO_Tracking_Default_Data implements WPSEO_Collection {

	/**
	 * Returns the collection data.
	 *
	 * @return array The collection data.
	 */
	public function get() {
		return array(
			'siteTitle'    => get_option( 'blogname' ),
			'siteEmail'    => get_option( 'admin_email' ),
			'@timestamp'   => (int) date( 'Uv' ),
			'wpVersion'    => $this->get_wordpress_version(),
			'homeURL'      => home_url(),
			'adminURL'     => admin_url(),
			'isMultisite'  => is_multisite(),
			'siteLanguage' => get_bloginfo( 'language' ),
		);
	}

	/**
	 * Returns the WordPress version.
	 *
	 * @return string The version.
	 */
	protected function get_wordpress_version() {
		global $wp_version;

		return $wp_version;
	}
}

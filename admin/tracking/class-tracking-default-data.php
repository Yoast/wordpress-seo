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
			'name'         => $this->get_user_info( 'name' ),
			'email'        => $this->get_user_info( 'email' ),
			'@timestamp'   => date( 'U' ),
			'wpVersion'    => $this->get_wordpress_version(),
			'homeURL'      => home_url(),
			'isMultisite'  => is_multisite(),
			'siteLanguage' => get_bloginfo( 'language' ),
		);
	}

	/**
	 * Returns info about the current user.
	 *
	 * @param string $what What to retrieve, defaults to name.
	 *
	 * @return string
	 */
	protected function get_user_info( $what = 'name' ) {
		$current_user = wp_get_current_user();
		switch ( $what ) {
			case 'email':
				return $current_user->user_email;
			case 'name':
				return trim( $current_user->user_firstname . ' ' . $current_user->user_lastname );
		}

		return '';
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

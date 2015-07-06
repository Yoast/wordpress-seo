<?php
/**
 * @package WPSEO\Premium
 */

/**
 * Class WPSEO_Watcher
 */
abstract class WPSEO_Watcher {

	/**
	 * Parses the hidden field with the old url to show in the form
	 *
	 * @param string $url
	 * @param string $type
	 *
	 * @return string
	 */
	protected function parse_url_field( $url, $type ) {

		// Output the hidden field
		return '<input type="hidden" name="wpseo_old_' . $type . '_url" value="' . esc_attr( $url ) . '"/>';

	}

	/**
	 * This method checks if it's desirable to create a redirect
	 *
	 * @param string $old_url
	 * @param string $new_url
	 *
	 * @return bool
	 */
	protected function should_create_redirect( $old_url, $new_url ) {

		// Get the site URL
		$site = parse_url( get_site_url() );

		if ( $old_url != $new_url && $old_url != '/' && ( ! isset( $site['path'] ) || ( isset( $site['path'] ) && $old_url != $site['path'] . '/' ) ) ) {
			return true;
		}
	}

	/**
	 * Creates notification with given $message
	 *
	 * This method will also apply filter for $notification_type to determine if notification has to be shown
	 *
	 * @param string $message
	 * @param string $notification_type
	 * @param string $id
	 */
	protected function create_notification( $message, $notification_type, $id ) {
		$show_notification = true;
		$show_notification = apply_filters( 'wpseo_enable_notification_' . $this->watch_type . '_' . $notification_type, $show_notification );

		if ( $show_notification ) {
			// Add the message to the notifications center
			Yoast_Notification_Center::get()->add_notification( new Yoast_Notification( $message, array( 'type' => 'updated', 'id' => $id ) ) );
		}

	}

	/**
	 * Opens the redirect manager and create the redirect
	 *
	 * @param string $old_url
	 * @param string $new_url
	 * @param int    $header_code
	 */
	protected function create_redirect( $old_url, $new_url, $header_code = 301 ) {
		// The URL redirect manager
		$redirect_manager = new WPSEO_URL_Redirect_Manager();

		// Create the redirect
		$redirect_manager->create_redirect( $old_url, $new_url, $header_code );
	}

	/**
	 * Returns the string to the javascript method from where a new redirect can be added
	 *
	 * @param string $url
	 * @param string $id
	 *
	 * @return string
	 */
	protected function javascript_create_redirect( $url, $id ) {
		return 'javascript:wpseo_create_redirect("' . urlencode( $url ) . '", "' . wp_create_nonce( 'wpseo-redirects-ajax-security' ) . '","' . esc_attr( $id ) . '");';
	}

	/**
	 * Returns the string to the javascript method from where the added redirect can be undone
	 *
	 * @param string $old_url
	 * @param string $id
	 *
	 * @return string
	 */
	protected function javascript_undo_redirect( $old_url, $id ) {
		return 'javascript:wpseo_undo_redirect("' . urlencode( $old_url ) . '", "' . wp_create_nonce( 'wpseo-redirects-ajax-security' ) . '","' . esc_attr( $id ) . '");';
	}

	/**
	 * Return the url to the admin page where the just added redirect can be found
	 *
	 * @param string $old_url
	 *
	 * @return string
	 */
	protected function admin_redirect_url( $old_url ) {
		return admin_url( 'admin.php?page=wpseo_redirects&s=' . urlencode( $old_url ) );
	}

}

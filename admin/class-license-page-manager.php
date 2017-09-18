<?php
/**
 * @package WPSEO\Admin
 */

/**
 * Represents the values for a single Yoast Premium extension plugin.
 */
class WPSEO_License_Page_Manager implements WPSEO_WordPress_Integration {

	const VERSION_LEGACY = '1';
	const VERSION_BACKWARDS_COMPATIBILITY = '2';

	/**
	 * Registers all hooks to WordPress.
	 */
	public function register_hooks() {
		add_filter( 'http_response', array( $this, 'handle_response' ), 10, 3 );

		if ( $this->get_version() === self::VERSION_BACKWARDS_COMPATIBILITY ) {
			add_filter( 'yoast-license-valid', '__return_true' );
			add_filter( 'yoast-show-license-notice', '__return_false' );
			add_action( 'admin_init', array( $this, 'validate_extensions' ), 15 );
		}
		else {
			add_action( 'admin_init', array( $this, 'remove_faulty_notifications' ), 15 );
		}
	}

	/**
	 * Validates the extensions and show a notice for the invalid extensions.
	 */
	public function validate_extensions() {

		if ( filter_input( INPUT_GET, 'page' ) === WPSEO_Admin::PAGE_IDENTIFIER ) {
			/**
			 * Filter: 'yoast-active-extensions' - Collects all active extensions. This hook is implemented in the
			 *                                     license manager.
			 *
			 * @api array $extensions The array with extensions.
			 */
			apply_filters( 'yoast-active-extensions', array() );
		}

		$extension_list = new WPSEO_Extensions();
		$extensions = $extension_list->get();

		$notification_center = Yoast_Notification_Center::get();

		foreach ( $extensions as $product_name ) {
			$notification = $this->create_notification( $product_name );

			// Add a notification when the installed plugin isn't activated in My Yoast.
			if ( $extension_list->is_installed( $product_name ) && ! $extension_list->is_valid( $product_name ) ) {
				$notification_center->add_notification( $notification );

				continue;
			}

			$notification_center->remove_notification( $notification );
		}
	}

	/**
	 * Removes the faulty set notifications.
	 */
	public function remove_faulty_notifications() {
		$extension_list = new WPSEO_Extensions();
		$extensions = $extension_list->get();

		$notification_center = Yoast_Notification_Center::get();

		foreach ( $extensions as $product_name ) {
			$notification = $this->create_notification( $product_name );
			$notification_center->remove_notification( $notification );
		}
	}

	/**
	 * Handles the response.
	 *
	 * @param array  $response          HTTP response.
	 * @param array  $request_arguments HTTP request arguments. Unused.
	 * @param string $url               The request URL.
	 *
	 * @return array The response array.
	 */
	public function handle_response( array $response, $request_arguments, $url ) {
		$response_code = wp_remote_retrieve_response_code( $response );

		if ( $response_code === 200 && $this->is_expected_endpoint( $url )  ) {
			$response_data = $this->parse_response( $response );
			$this->detect_version( $response_data );
		}

		return $response;
	}

	/**
	 * Returns the license page to use based on the version number.
	 *
	 * @return string The page to use.
	 */
	public function get_license_page() {
		if ( $this->get_version() === self::VERSION_BACKWARDS_COMPATIBILITY ) {
			return 'licenses';
		}

		return 'licenses-legacy';
	}

	/**
	 * Returns the version number of the license server.
	 *
	 * @return int The version number
	 */
	protected function get_version() {
		return get_option( $this->get_option_name(), self::VERSION_LEGACY );
	}

	/**
	 * Returns the option name.
	 *
	 * @return string The option name.
	 */
	protected function get_option_name() {
		return 'wpseo_license_server_version';
	}

	/**
	 * Sets the version when there is a value in the response.
	 *
	 * @param array $response The response to extract the version from.
	 */
	protected function detect_version( $response ) {
		if ( ! empty( $response['serverVersion'] ) ) {
			$this->set_version( $response['serverVersion'] );
		}
	}

	/**
	 * Sets the version.
	 *
	 * @param string $server_version The version number to save.
	 */
	protected function set_version( $server_version ) {
		update_option( $this->get_option_name(), $server_version );
	}

	/**
	 * Parses the response by getting its body and do a unserialize of it.
	 *
	 * @param array $response The response to parse.
	 *
	 * @return mixed|string|false The parsed response.
	 */
	protected function parse_response( $response ) {
		$response = json_decode( wp_remote_retrieve_body( $response ), true );
		$response = maybe_unserialize( $response );

		return $response;
	}

	/**
	 * Checks if the given url matches the expected endpoint.
	 *
	 * @param string $url The url to check.
	 *
	 * @return bool True when url matches the endpoint.
	 */
	protected function is_expected_endpoint( $url ) {
		$url_parts = wp_parse_url( $url );

		$is_yoast_com = ( in_array( $url_parts['host'], array( 'yoast.com', 'my.yoast.com' ), true ) );
		$is_edd_api   = ( isset( $url_parts['path'] ) && $url_parts['path'] === '/edd-sl-api' );

		return $is_yoast_com && $is_edd_api;
	}

	/**
	 * Creates an instance of Yoast_Notification
	 *
	 * @param string $product_name The product to create the notification for.
	 *
	 * @return Yoast_Notification The created notification.
	 */
	protected function create_notification( $product_name ) {
		$notification_options = array(
			'type'         => Yoast_Notification::ERROR,
			'id'           => 'wpseo-dismiss-' . sanitize_title_with_dashes( $product_name,  null, 'save' ),
			'capabilities' => 'manage_options',
		);

		$notification = new Yoast_Notification(
		/* translators: %1$s expands to the product name. %2$s expands to a link to My Yoast  */
			sprintf(
				__( 'You are not receiving updates or support! Fix this problem by adding this site and enabling %1$s for it in %2$s.', 'wordpress-seo' ),
				$product_name,
				'<a href="https://yoa.st/13j" target="_blank">My Yoast</a>'
			),
			$notification_options
		);

		return $notification;
	}
}

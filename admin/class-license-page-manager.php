<?php
/**
 * WPSEO plugin file.
 *
 * @package WPSEO\Admin
 */

/**
 * Represents the values for a single Yoast Premium extension plugin.
 */
class WPSEO_License_Page_Manager implements WPSEO_WordPress_Integration {

	/**
	 * Version number for License Page Manager.
	 *
	 * @var string
	 */
	const VERSION_BACKWARDS_COMPATIBILITY = '2';

	/**
	 * Array with the Yoast extensions.
	 *
	 * @var array
	 */
	protected $extensions = [
		'Yoast SEO Premium'     => WPSEO_Addon_Manager::PREMIUM_SLUG,
		'News SEO'              => WPSEO_Addon_Manager::NEWS_SLUG,
		'Yoast WooCommerce SEO' => WPSEO_Addon_Manager::WOOCOMMERCE_SLUG,
		'Video SEO'             => WPSEO_Addon_Manager::VIDEO_SLUG,
		'Local SEO'             => WPSEO_Addon_Manager::LOCAL_SLUG,
	];

	/**
	 * Registers all hooks to WordPress.
	 */
	public function register_hooks() {
		if ( $this->get_version() === self::VERSION_BACKWARDS_COMPATIBILITY ) {
			add_action( 'admin_init', [ $this, 'validate_extensions' ], 15 );
		}
		else {
			add_action( 'admin_init', [ $this, 'remove_faulty_notifications' ], 15 );
		}
	}

	/**
	 * Validates the extensions and show a notice for the invalid extensions.
	 */
	public function validate_extensions() {
		$notification_center = Yoast_Notification_Center::get();
		$addon_manager       = new WPSEO_Addon_Manager();

		foreach ( $this->extensions as $product_name => $slug ) {
			$notification = $this->create_notification( $product_name );

			// Add a notification when the installed plugin isn't activated in My Yoast.
			if ( $addon_manager->is_installed( $slug ) && ! $addon_manager->has_valid_subscription( $slug ) ) {
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
		$notification_center = Yoast_Notification_Center::get();

		foreach ( array_keys( $this->extensions ) as $product_name ) {
			$notification = $this->create_notification( $product_name );
			$notification_center->remove_notification( $notification );
		}
	}

	/**
	 * Returns the version number of the license server.
	 *
	 * @return int The version number
	 */
	protected function get_version() {
		return WPSEO_Options::get( $this->get_option_name(), self::VERSION_BACKWARDS_COMPATIBILITY );
	}

	/**
	 * Returns the option name.
	 *
	 * @return string The option name.
	 */
	protected function get_option_name() {
		return 'license_server_version';
	}

	/**
	 * Creates an instance of Yoast_Notification.
	 *
	 * @param string $product_name The product to create the notification for.
	 *
	 * @return Yoast_Notification The created notification.
	 */
	protected function create_notification( $product_name ) {
		$notification_options = [
			'type'         => Yoast_Notification::ERROR,
			'id'           => 'wpseo-dismiss-' . sanitize_title_with_dashes( $product_name, null, 'save' ),
			'capabilities' => 'wpseo_manage_options',
		];

		return new Yoast_Notification(
			sprintf(
				/* translators: %1$s expands to the product name. %2$s expands to a link to My Yoast  */
				__( 'You are not receiving updates or support! Fix this problem by adding this site and enabling %1$s for it in %2$s.', 'wordpress-seo' ),
				$product_name,
				'<a href="' . WPSEO_Shortlinker::get( 'https://yoa.st/13j' ) . '" target="_blank">My Yoast</a>'
			),
			$notification_options
		);
	}

	/* ********************* DEPRECATED METHODS ********************* */

	/**
	 * Handles the response.
	 *
	 * @deprecated 15.1
	 * @codeCoverageIgnore
	 *
	 * @param array  $response          HTTP response.
	 * @param array  $request_arguments HTTP request arguments. Unused.
	 * @param string $url               The request URL.
	 *
	 * @return array The response array.
	 */
	public function handle_response( array $response, $request_arguments, $url ) {
		_deprecated_function( __METHOD__, 'WPSEO 15.1' );

		return $response;
	}

	/**
	 * Returns the license page to use based on the version number.
	 *
	 * @deprecated 15.1
	 * @codeCoverageIgnore
	 *
	 * @return string The page to use.
	 */
	public function get_license_page() {
		_deprecated_function( __METHOD__, '15.1' );

		return 'licenses';
	}
}

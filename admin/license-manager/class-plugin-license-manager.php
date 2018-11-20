<?php
/**
 * WPSEO plugin file.
 *
 * @package WPSEO\Admin\License_Manager
 */

/**
 * Class WPSEO_Plugin_License_Manager
 */
final class WPSEO_Plugin_License_Manager {
	/**
	 * @const VERSION The version number of the License_Manager class
	 */
	const VERSION = 1;
	/**
	 * @var WPSEO_Product Product
	 */
	protected $product;
	/**
	 * @var boolean True if remote license activation just failed
	 */
	private $remote_license_activation_failed = false;
	/**
	 * @var array Array of license related options
	 */
	private $options = array();
	/**
	 * @var string Used to prefix ID's, option names, etc..
	 */
	protected $prefix;
	/**
	 * @var bool Boolean indicating whether this plugin is network activated
	 */
	protected $is_network_activated = false;

	/**
	 * Constructor
	 *
	 * @param WPSEO_Product $product
	 */
	public function __construct( WPSEO_Product $product ) {
		$this->product = $product;
		$this->prefix  = sanitize_title_with_dashes( $this->product->get_item_name() . '_', null, 'save' );
	}

	/**
	 * Setup hooks
	 *
	 */
	public function setup_hooks() {
		// Adds the plugin to the active extensions.
		add_filter( 'yoast-active-extensions', array( $this, 'set_active_extension' ) );

		register_deactivation_hook( $this->product->get_file(), array( $this, 'deactivate_license' ) );

		if ( apply_filters( 'yoast-license-valid', $this->license_is_valid() ) ) {
			new WPSEO_Plugin_Update_Manager( $this->product, $this );
		}
	}

	/**
	 * Checks if the license is valid and put it into the list with extensions.
	 *
	 * @param array $extensions The extensions used in Yoast SEO.
	 *
	 * @return array
	 */
	public function set_active_extension( $extensions ) {
		if ( ! $this->license_is_valid() ) {
			$this->activate_license();
		}

		if ( $this->license_is_valid() ) {
			$extensions[] = $this->product->get_slug();
		}

		return $extensions;
	}

	/**
	 * Remotely activate License
	 * @return boolean True if the license is now activated, false if not
	 */
	public function activate_license() {

		$result = $this->call_license_api( 'activate' );

		if ( $result && ( ! isset ( $result->status ) || $result->status !== 'error' ) ) {
			// show success notice if license is valid
			if ( $result->license === 'valid' ) {
				$success = true;
				$message = $this->get_successful_activation_message( $result );
			} else {
				$this->remote_license_activation_failed = true;

				$success = false;
				$message = $this->get_unsuccessful_activation_message( $result );
			}

			// Append custom HTML message to default message.
			$message .= $this->get_custom_message( $result );

			if ( $this->show_license_notice() ) {
				$this->set_notice( $message, $success );
			}

			$this->set_license_status( $result->license );
		}

		return $this->license_is_valid();
	}

	/**
	 * Remotely deactivate License
	 * @return boolean True if the license is now deactivated, false if not
	 */
	public function deactivate_license() {

		$result = $this->call_license_api( 'deactivate' );

		if ( $result ) {

			// show notice if license is deactivated
			if ( $result->license === 'deactivated' ) {
				$success = true;
				$message = sprintf( __( 'Your %s license has been deactivated.', 'wordpress-seo' ), $this->product->get_item_name() );
			} else {
				$success = false;
				$message = sprintf( __( 'Failed to deactivate your %s license.', 'wordpress-seo' ), $this->product->get_item_name() );
			}

			$message .= $this->get_custom_message( $result );

			// Append custom HTML message to default message.
			if ( $this->show_license_notice() ) {
				$this->set_notice( $message, $success );
			}

			$this->set_license_status( $result->license );
		}

		return ( $this->get_license_status() === 'deactivated' );
	}

	/**
	 * Returns the home url with the following modifications:
	 *
	 * In case of a multisite setup we return the network_home_url.
	 * In case of no multisite setup we return the home_url while overriding the WPML filter.
	 */
	public function get_url() {
		// Add a new filter to undo WPML's changing of home url.
		add_filter( 'wpml_get_home_url', array( $this, 'wpml_get_home_url' ), 10, 2 );

		// If the plugin is network activated, use the network home URL.
		if ( $this->is_network_activated ) {
			$url = network_home_url();
		}

		// Otherwise use the home URL for this specific site.
		if ( ! $this->is_network_activated ) {
			$url = home_url();
		}

		remove_filter( 'wpml_get_home_url', array( $this, 'wpml_get_home_url' ), 10 );

		return $url;
	}

	/**
	 * Returns the original URL instead of the language-enriched URL.
	 * This method gets automatically triggered by the wpml_get_home_url filter.
	 *
	 * @param string $home_url The url altered by WPML. Unused.
	 * @param string $url      The url that isn't altered by WPML.
	 *
	 * @return string The original url.
	 */
	public function wpml_get_home_url( $home_url, $url ) {
		return $url;
	}

	/**
	 * Call the MyYoast License API.
	 *
	 * @param string $action Activate or deactivate the license
	 *
	 * @return mixed
	 */
	protected function call_license_api( $action ) {

		// data to send in our API request
		$api_params = array(
			'body' => wp_json_encode( array(
				'edd_action' => $action . '_license',
				'license'    => 'yoast-dummy-license',
				'item_name'  => urlencode( trim( $this->product->get_item_name() ) ),
				'url'        => $this->get_url(),
				// grab the URL straight from the option to prevent filters from breaking it.
			) ),
		);

		// create api request url
		$request = new MyYoast_API_Request( $api_params );

		if ( $request->is_valid() !== true ) {
			$this->set_notice( sprintf( __( 'Request error: "%s" (%scommon license notices%s)', 'wordpress-seo' ), $request->get_error_message(), '<a href="http://kb.yoast.com/article/13-license-activation-notices">', '</a>' ), false );
		}

		// get response
		return $request->get_response();
	}

	/**
	 * Set the license status
	 *
	 * @param string $license_status
	 */
	public function set_license_status( $license_status ) {
		$this->set_option( 'status', $license_status );
	}

	/**
	 * Get the license status
	 *
	 * @return string $license_status;
	 */
	public function get_license_status() {
		$license_status = $this->get_option( 'status' );

		return trim( $license_status );
	}

	/**
	 * Gets the license expiry date
	 *
	 * @return string
	 */
	public function get_license_expiry_date() {
		return $this->get_option( 'expiry_date' );
	}

	/**
	 * Stores the license expiry date
	 */
	public function set_license_expiry_date( $expiry_date ) {
		$this->set_option( 'expiry_date', $expiry_date );
	}

	/**
	 * Checks whether the license status is active
	 *
	 * @return boolean True if license is active
	 */
	public function license_is_valid() {
		return ( $this->get_license_status() === 'valid' );
	}

	/**
	 * Get all license related options
	 *
	 * @return array Array of license options
	 */
	protected function get_options() {
		// Set up our array of defaults.
		$defaults = array(
			'key'         => '',
			'status'      => '',
			'expiry_date' => '',
		);

		// Merge our options with the defaults.
		$this->options = wp_parse_args( $this->get_options_from_db(), $defaults );

		return $this->options;
	}

	/**
	 * Retrieves the options from the DB based on whether we're multisite or not.
	 *
	 * @return mixed
	 */
	private function get_options_from_db() {
		$option_name = $this->prefix . 'license';

		if ( $this->is_network_activated ) {
			return get_site_option( $option_name, array() );
		}

		return get_option( $option_name, array() );
	}

	/**
	 * Set license related options
	 *
	 * @param array $options Array of new license options
	 */
	protected function set_options( array $options ) {
		// create option name
		$option_name = $this->prefix . 'license';

		// update db
		if ( $this->is_network_activated ) {
			update_site_option( $option_name, $options );

			return;
		}

		update_option( $option_name, $options );
	}

	/**
	 * Gets a license related option
	 *
	 * @param string $name The option name
	 *
	 * @return mixed The option value
	 */
	protected function get_option( $name ) {
		$options = $this->get_options();

		return $options[ $name ];
	}

	/**
	 * Set a license related option
	 *
	 * @param string $name  The option name
	 * @param mixed  $value The option value
	 */
	protected function set_option( $name, $value ) {
		// get options
		$options = $this->get_options();

		// update option
		$options[ $name ] = $value;

		// save options
		$this->set_options( $options );
	}

	/**
	 * Get the API availability information
	 *
	 * @return array
	 */
	protected function get_api_availability() {
		return array(
			'url'          => $this->product->get_api_url(),
			'availability' => $this->check_api_host_availability(),
			'curl_version' => $this->get_curl_version(),
		);
	}

	/**
	 * Check if the API host address is available from this server
	 *
	 * @return bool
	 */
	private function check_api_host_availability() {
		$wp_http = new WP_Http();
		if ( $wp_http->block_request( $this->product->get_api_url() ) === false ) {
			return true;
		}

		return false;
	}

	/**
	 * Get the current curl version, or false
	 *
	 * @return mixed
	 */
	protected function get_curl_version() {
		if ( function_exists( 'curl_version' ) ) {
			$curl_version = curl_version();

			if ( isset( $curl_version['version'] ) ) {
				return $curl_version['version'];
			}
		}

		return false;
	}

	/**
	 * Determine what message should be shown for a successful license activation
	 *
	 * @param Object $result Result of a request.
	 *
	 * @return string
	 */
	protected function get_successful_activation_message( $result ) {
		// Get expiry date.
		$expiry_date = false;
		if ( isset( $result->expires ) ) {
			$this->set_license_expiry_date( $result->expires );
			$expiry_date = strtotime( $result->expires );
		}

		// Always show that it was successful.
		$message = sprintf( __( 'Your %s license has been activated. ', 'wordpress-seo' ), $this->product->get_item_name() );

		// Show a custom notice it is an unlimited license.
		$message .= sprintf( _n( 'You have used %d/%d activation. ', 'You have used %d/%d activations. ', $result->license_limit, 'wordpress-seo' ), $result->site_count, $result->license_limit );
		if ( $result->license_limit == 0 ) {
			$message .= __( 'You have an unlimited license. ', 'wordpress-seo' );
		}

		// add upgrade notice if user has less than 3 activations left
		if ( $result->license_limit > 0 && ( $result->license_limit - $result->site_count ) <= 3 ) {
			$message .= sprintf( __( '<a href="%s">Did you know you can upgrade your license?</a> ', 'wordpress-seo' ), $this->product->get_extension_url( 'license-nearing-limit-notice' ) );
		}

		if ( $expiry_date !== false && $expiry_date < strtotime( '+1 month' ) ) {
			// Add extend notice if license is expiring in less than 1 month.
			$days_left = round( ( $expiry_date - time() ) / 86400 );
			$message   .= sprintf( _n( '<a href="%s">Your license is expiring in %d day, would you like to extend it?</a> ', '<a href="%s">Your license is expiring in %d days, would you like to extend it?</a> ', $days_left, 'wordpress-seo' ), $this->product->get_extension_url( 'license-expiring-notice' ), $days_left );
		}

		return $message;
	}

	/**
	 * Determine what message should be shown for an unsuccessful activation
	 *
	 * @param Object $result Result of a request.
	 *
	 * @return string
	 */
	protected function get_unsuccessful_activation_message( $result ) {
		// Default message if we cannot detect anything more specific.
		$message = __( 'Failed to activate your license, your license key seems to be invalid.', 'wordpress-seo' );

		if ( ! empty( $result->error ) ) {
			switch ( $result->error ) {
				// Show notice if user is at their activation limit.
				case 'no_activations_left':
					$message = sprintf( __( 'You\'ve reached your activation limit. You must <a href="%s">upgrade your license</a> to use it on this site.', 'wordpress-seo' ), $this->product->get_extension_url( 'license-at-limit-notice' ) );
					break;

				// Show notice if the license is expired.
				case 'expired':
					$message = sprintf( __( 'Your license has expired. You must <a href="%s">extend your license</a> in order to use it again.', 'wordpress-seo' ), $this->product->get_extension_url( 'license-expired-notice' ) );
					break;
			}
		}

		return $message;
	}

	/**
	 * Get the locale for the current user
	 *
	 * @return string
	 */
	protected function get_user_locale() {
		if ( function_exists( 'get_user_locale' ) ) {
			return get_user_locale();
		}

		return get_locale();
	}

	/**
	 * Parse custom HTML message from response
	 *
	 * @param Object $result Result of the request.
	 *
	 * @return string
	 */
	protected function get_custom_message( $result ) {
		$message = '';

		// Allow for translated messages to be used.
		$localized_description = 'custom_message_' . $this->get_user_locale();
		if ( ! empty( $result->{$localized_description} ) ) {
			$message = $result->{$localized_description};
		}

		// Fall back to non-localized custom message if no locale has been provided.
		if ( empty( $message ) && ! empty( $result->custom_message ) ) {
			$message = $result->custom_message;
		}

		// Make sure we limit the type of HTML elements to be displayed.
		if ( ! empty( $message ) ) {
			$allowed_html = array(
				'a'  => array(
					'href'   => array(),
					'target' => array(),
					'title'  => array(),
				),
				'br' => array(),
			);
			$message      = wp_kses( $message, $allowed_html );

			// Make sure we are on a new line.
			$message = '<br />' . $message;
		}

		return $message;
	}

	/** DEPRECATED */

	/**
	 * Allows settings the license constant.
	 *
	 * @deprecated 9.4.0
	 */
	public function set_license_constant_name() {
		_deprecated_function( __METHOD__, '9.4.0' );
	}
}

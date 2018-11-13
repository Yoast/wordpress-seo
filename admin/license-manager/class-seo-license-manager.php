<?php

/**
 * Class WPSEO_License_Manager
 */
abstract class WPSEO_License_Manager {
	/**
	 * @const VERSION The version number of the License_Manager class
	 */
	const VERSION = 1;
	/**
	 * @var Yoast_License The license
	 */
	protected $product;
	/**
	 * @var string
	 */
	private $license_constant_name = '';
	/**
	 * @var boolean True if license is defined with a constant
	 */
	private $license_constant_is_defined = false;
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

		// Set the license
		$this->product = $product;

		// set prefix
		$this->prefix = sanitize_title_with_dashes( $this->product->get_item_name() . '_', null, 'save' );

		// maybe set license key from constant
		$this->maybe_set_license_key_from_constant();
	}

	/**
	 * Setup hooks
	 *
	 */
	public function setup_hooks() {

		// show admin notice if license is not active
		add_action( 'admin_notices', array( $this, 'display_admin_notices' ) );

		// catch POST requests from license form
		add_action( 'admin_init', array( $this, 'catch_post_request' ) );

		// Adds the plugin to the active extensions.
		add_filter( 'yoast-active-extensions', array( $this, 'set_active_extension' ) );

		// setup item type (plugin|theme) specific hooks
		$this->specific_hooks();

		// setup the auto updater
		$this->setup_auto_updater();
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
			$this->set_license_key( 'yoast-dummy-license' );
			$this->activate_license();
		}

		if ( $this->license_is_valid() ) {
			$extensions[] = $this->product->get_slug();
		}

		return $extensions;
	}

	/**
	 * Display license specific admin notices, namely:
	 *
	 * - License for the product isn't activated
	 * - External requests are blocked through WP_HTTP_BLOCK_EXTERNAL
	 */
	public function display_admin_notices() {

		if ( ! current_user_can( 'manage_options' ) ) {
			return;
		}

		// show notice if license is invalid
		if ( $this->show_license_notice() && ! $this->license_is_valid() ) {
			if ( $this->get_license_key() === '' ) {
				$message = __( '<b>Warning!</b> You didn\'t set your %s license key yet, which means you\'re missing out on updates and support! <a href="%s">Enter your license key</a> or <a href="%s" target="_blank">get a license here</a>.' );
			} else {
				$message = __( '<b>Warning!</b> Your %s license is inactive which means you\'re missing out on updates and support! <a href="%s">Activate your license</a> or <a href="%s" target="_blank">get a license here</a>.' );
			}
			?>
			<div class="notice notice-error yoast-notice-error">
				<p><?php printf( __( $message, $this->product->get_text_domain() ), $this->product->get_item_name(), $this->product->get_license_page_url(), $this->product->get_tracking_url( 'activate-license-notice' ) ); ?></p>
			</div>
			<?php
		}

		// show notice if external requests are blocked through the WP_HTTP_BLOCK_EXTERNAL constant
		if ( defined( 'WP_HTTP_BLOCK_EXTERNAL' ) && WP_HTTP_BLOCK_EXTERNAL === true ) {

			// check if our API endpoint is in the allowed hosts
			$host = wp_parse_url( $this->product->get_api_url(), PHP_URL_HOST );

			if ( ! defined( 'WP_ACCESSIBLE_HOSTS' ) || stristr( WP_ACCESSIBLE_HOSTS, $host ) === false ) {
				?>
				<div class="notice notice-error yoast-notice-error">
					<p><?php printf( __( '<b>Warning!</b> You\'re blocking external requests which means you won\'t be able to get %s updates. Please add %s to %s.', $this->product->get_text_domain() ), $this->product->get_item_name(), '<strong>' . $host . '</strong>', '<code>WP_ACCESSIBLE_HOSTS</code>' ); ?></p>
				</div>
				<?php
			}
		}
	}

	/**
	 * Set a notice to display in the admin area
	 *
	 * @param string $type    error|updated
	 * @param string $message The message to display
	 */
	protected function set_notice( $message, $success = true ) {
		$css_class = ( $success ) ? 'notice-success yoast-notice-success' : 'notice-error yoast-notice-error';
		add_settings_error( $this->prefix . 'license', 'license-notice', $message, $css_class );
	}

	/**
	 * Remotely activate License
	 * @return boolean True if the license is now activated, false if not
	 */
	public function activate_license() {

		$result = $this->call_license_api( 'activate' );

		if ( $result ) {

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
				$message = sprintf( __( 'Your %s license has been deactivated.', $this->product->get_text_domain() ), $this->product->get_item_name() );
			} else {
				$success = false;
				$message = sprintf( __( 'Failed to deactivate your %s license.', $this->product->get_text_domain() ), $this->product->get_item_name() );
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
	 * @param string $action activate|deactivate
	 *
	 * @return mixed
	 */
	protected function call_license_api( $action ) {

		// don't make a request if license key is empty
		if ( $this->get_license_key() === '' ) {
			return false;
		}

		// data to send in our API request
		$api_params = array(
			'edd_action' => $action . '_license',
			'license'    => $this->get_license_key(),
			'item_name'  => urlencode( trim( $this->product->get_item_name() ) ),
			'url'        => $this->get_url(),
			// grab the URL straight from the option to prevent filters from breaking it.
		);

		// create api request url
		$url = add_query_arg( $api_params, $this->product->get_api_url() );

		$request = new MyYoast_API_Request( $url );

		if ( $request->is_valid() !== true ) {
			$this->set_notice( sprintf( __( 'Request error: "%s" (%scommon license notices%s)', $this->product->get_text_domain() ), $request->get_error_message(), '<a href="http://kb.yoast.com/article/13-license-activation-notices">', '</a>' ), false );
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
	 * Set the license key
	 *
	 * @param string $license_key
	 */
	public function set_license_key( $license_key ) {
		$this->set_option( 'key', $license_key );
	}

	/**
	 * Gets the license key from constant or option
	 *
	 * @return string $license_key
	 */
	public function get_license_key() {
		$license_key = $this->get_option( 'key' );

		return trim( $license_key );
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

		// create option name
		$option_name = $this->prefix . 'license';

		// get array of options from db
		if ( $this->is_network_activated ) {
			$options = get_site_option( $option_name, array() );
		} else {
			$options = get_option( $option_name, array() );
		}

		// setup array of defaults
		$defaults = array(
			'key'         => '',
			'status'      => '',
			'expiry_date' => '',
		);

		// merge options with defaults
		$this->options = wp_parse_args( $options, $defaults );

		return $this->options;
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
		} else {
			update_option( $option_name, $options );
		}
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

	public function show_license_form_heading() {
		?>
		<h3>
			<?php printf( __( '%s: License Settings', $this->product->get_text_domain() ), $this->product->get_item_name() ); ?>
			&nbsp; &nbsp;
		</h3>
		<?php
	}

	/**
	 * Show a form where users can enter their license key
	 *
	 * @param boolean $embedded Boolean indicating whether this form is embedded in another form?
	 */
	public function show_license_form( $embedded = true ) {
		$key_name    = $this->prefix . 'license_key';
		$nonce_name  = $this->prefix . 'license_nonce';
		$action_name = $this->prefix . 'license_action';

		$api_host_available = $this->get_api_availability();

		$visible_license_key = $this->get_license_key();

		// obfuscate license key
		$obfuscate = ( strlen( $this->get_license_key() ) > 5 && ( $this->license_is_valid() || ! $this->remote_license_activation_failed ) );

		if ( $obfuscate ) {
			$visible_license_key = str_repeat( '*', ( strlen( $this->get_license_key() ) - 4 ) ) . substr( $this->get_license_key(), - 4 );
		}

		// make license key readonly when license key is valid or license is defined with a constant
		$readonly = ( $this->license_is_valid() || $this->license_constant_is_defined );

		require dirname( __FILE__ ) . '/views/form.php';

		// enqueue script in the footer
		add_action( 'admin_footer', array( $this, 'output_script' ), 99 );
	}

	/**
	 * Check if the license form has been submitted
	 */
	public function catch_post_request() {

		$name = $this->prefix . 'license_key';

		// check if license key was posted and not empty
		if ( ! isset( $_POST[ $name ] ) ) {
			return;
		}

		// run a quick security check
		$nonce_name = $this->prefix . 'license_nonce';

		if ( ! check_admin_referer( $nonce_name, $nonce_name ) ) {
			return;
		}

		// @TODO: check for user cap?

		// get key from posted value
		$license_key = $_POST[ $name ];

		// check if license key doesn't accidentally contain asterisks
		if ( strstr( $license_key, '*' ) === false ) {

			// sanitize key
			$license_key = trim( sanitize_key( $_POST[ $name ] ) );

			// save license key
			$this->set_license_key( $license_key );
		}

		// does user have an activated valid license
		if ( ! $this->license_is_valid() ) {

			// try to auto-activate license
			return $this->activate_license();
		}

		$action_name = $this->prefix . 'license_action';

		// was one of the action buttons clicked?
		if ( isset( $_POST[ $action_name ] ) ) {

			$action = trim( $_POST[ $action_name ] );

			switch ( $action ) {
				case 'activate':
					return $this->activate_license();

				case 'deactivate':
					return $this->deactivate_license();
			}
		}
	}

	/**
	 * Set the constant used to define the license
	 *
	 * @param string $license_constant_name The license constant name
	 */
	public function set_license_constant_name( $license_constant_name ) {
		$this->license_constant_name = trim( $license_constant_name );
		$this->maybe_set_license_key_from_constant();
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
	 * Maybe set license key from a defined constant
	 */
	private function maybe_set_license_key_from_constant() {

		if ( empty( $this->license_constant_name ) ) {
			// generate license constant name
			$constant_name = sanitize_key( $this->product->get_item_name() );
			$constant_name = str_replace( array( ' ', '-' ), '', $constant_name );
			$constant_name = strtoupper( $constant_name );
			$constant_name .= '_LICENSE';

			$this->set_license_constant_name( $constant_name );
		}

		// set license key from constant
		if ( defined( $this->license_constant_name ) ) {

			$license_constant_value = constant( $this->license_constant_name );

			// update license key value with value of constant
			if ( $this->get_license_key() !== $license_constant_value ) {
				$this->set_license_key( $license_constant_value );
			}

			$this->license_constant_is_defined = true;
		}
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
		if ( isset( $result->expires ) ) {
			$this->set_license_expiry_date( $result->expires );
			$expiry_date = strtotime( $result->expires );
		} else {
			$expiry_date = false;
		}

		// Always show that it was successful.
		$message = sprintf( __( 'Your %s license has been activated. ', $this->product->get_text_domain() ), $this->product->get_item_name() );

		// Show a custom notice it is an unlimited license.
		if ( $result->license_limit == 0 ) {
			$message .= __( 'You have an unlimited license. ', $this->product->get_text_domain() );
		} else {
			$message .= sprintf( _n( 'You have used %d/%d activation. ', 'You have used %d/%d activations. ', $result->license_limit, $this->product->get_text_domain() ), $result->site_count, $result->license_limit );
		}

		// add upgrade notice if user has less than 3 activations left
		if ( $result->license_limit > 0 && ( $result->license_limit - $result->site_count ) <= 3 ) {
			$message .= sprintf( __( '<a href="%s">Did you know you can upgrade your license?</a> ', $this->product->get_text_domain() ), $this->product->get_extension_url( 'license-nearing-limit-notice' ) );
		}

		if ( $expiry_date !== false && $expiry_date < strtotime( '+1 month' ) ) {
			// Add extend notice if license is expiring in less than 1 month.
			$days_left = round( ( $expiry_date - time() ) / 86400 );
			$message   .= sprintf( _n( '<a href="%s">Your license is expiring in %d day, would you like to extend it?</a> ', '<a href="%s">Your license is expiring in %d days, would you like to extend it?</a> ', $days_left, $this->product->get_text_domain() ), $this->product->get_extension_url( 'license-expiring-notice' ), $days_left );
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
		$message = __( 'Failed to activate your license, your license key seems to be invalid.', $this->product->get_text_domain() );

		if ( ! empty( $result->error ) ) {
			switch ( $result->error ) {
				// Show notice if user is at their activation limit.
				case 'no_activations_left':
					$message = sprintf( __( 'You\'ve reached your activation limit. You must <a href="%s">upgrade your license</a> to use it on this site.', $this->product->get_text_domain() ), $this->product->get_extension_url( 'license-at-limit-notice' ) );
					break;

				// Show notice if the license is expired.
				case 'expired':
					$message = sprintf( __( 'Your license has expired. You must <a href="%s">extend your license</a> in order to use it again.', $this->product->get_text_domain() ), $this->product->get_extension_url( 'license-expired-notice' ) );
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

	/**
	 * Returns true when a license notice should be shown.
	 *
	 * @return bool
	 */
	protected function show_license_notice() {
		/**
		 * Filter: 'yoast-show-license-notice' - Show the license notice.
		 *
		 * @api bool $show True if notices should be shown.
		 */
		return (bool) apply_filters( 'yoast-show-license-notice', true );
	}
}


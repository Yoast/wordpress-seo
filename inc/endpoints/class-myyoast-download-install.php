<?php
/**
 * WPSEO plugin file.
 *
 * @package WPSEO\Endpoint
 */

/**
 * Represents the endpoint for downloading and installing a zip-file from MyYoast.
 */
class WPSEO_Endpoint_MyYoast_Download_Install implements WPSEO_Endpoint {
	/**
	 * The namespace to use.
	 *
	 * @var string
	 */
	const REST_NAMESPACE = 'yoast/v1/myyoast/download';

	/**
	 * Registers the routes for the endpoints.
	 *
	 * @codeCoverageIgnore Only contains a WordPress function.
	 *
	 * @return void
	 */
	public function register() {
		register_rest_route(
			self::REST_NAMESPACE,
			'install',
			array(
				'methods'             => 'GET',
				'callback'            => array( $this, 'handle_request' ),
				'permission_callback' => array( $this, 'can_retrieve_data' ),
			)
		);
	}

	/**
	 * Determines whether or not data can be retrieved for the registered endpoints.
	 *
	 * @codeCoverageIgnore Only contains a WordPress function.
	 *
	 * @return bool Whether or not data can be retrieved.
	 */
	public function can_retrieve_data() {
		return current_user_can( 'install_plugins' );
	}

	/**
	 * Handles the request by extracting the download url.
	 *
	 * @param WP_REST_Request $request The request to handle.
	 *
	 * @return WP_REST_Response The handled request as response.
	 */
	public function handle_request( WP_REST_Request $request ) {
		$this->require_dependencies();

		try {
			$plugin_slug    = $request->get_param( 'slug' );
			$install_result = $this->install_plugin( $plugin_slug );

			return new WP_REST_Response( $install_result );
		}
		catch ( WPSEO_REST_Request_Exception $exception ) {
			return new WP_REST_Response(
				$exception->getMessage(),
				403
			);
		}
	}

	/**
	 * Installs the plugin based on the given slug.
	 *
	 * @param string $plugin_slug The plugin slug to install.
	 *
	 * @return bool True when install is successful.
	 *
	 * @throws WPSEO_REST_Request_Exception When an error occurred.
	 */
	protected function install_plugin( $plugin_slug ) {
		if ( $this->is_installed( $plugin_slug ) ) {
			return true;
		}

		$plugin_download = $this->find_plugin_download( $plugin_slug );
		$install_result  = $this->run_installation( $plugin_download );
		if ( is_wp_error( $install_result ) ) {
			throw new WPSEO_REST_Request_Exception( $install_result->get_error_message() );
		}

		return $install_result;
	}

	/**
	 * Checks if the given plugin is installed.
	 *
	 * @param string $plugin_slug The plugin slug to check installation status for.
	 *
	 * @return bool True when plugin for plugin slug is installed.
	 */
	protected function is_installed( $plugin_slug ) {
		return WPSEO_Addon_Manager::is_installed( $plugin_slug );
	}

	/**
	 * Formats the response.
	 *
	 * @param string $plugin_slug The plugin slug to get download url for.
	 *
	 * @return array|string Array when a list is requested, string when a plugin is request.
	 *
	 * @throws WPSEO_REST_Request_Exception When no subscription isn't found for given plugin.
	 */
	protected function find_plugin_download( $plugin_slug ) {
		$download_urls = $this->get_plugin_downloads();

		if ( empty( $download_urls[ $plugin_slug ] ) ) {
			throw new WPSEO_REST_Request_Exception(
				sprintf(
				/* translators: %1$s expands to the plugin slug  */
					esc_html__( 'No subscription found for %s', 'wordpress-seo' ),
					$plugin_slug
				)
			);
		}

		return $download_urls[ $plugin_slug ];
	}

	/**
	 * Extracts the download urls from the given subscriptions.
	 *
	 * @return array Array with the download urls.
	 */
	protected function get_plugin_downloads() {
		$subscriptions = $this->request_current_subscriptions();
		$download_urls = array();

		foreach ( $subscriptions as $subscription ) {
			$download_urls[ $subscription->product->slug ] = $subscription->product->download;
		}

		return $download_urls;
	}

	/**
	 * Retrieves the current subscriptions for the current website.
	 *
	 * @codeCoverageIgnore Contains external logic.
	 *
	 * @return array Subscriptions when set.
	 */
	protected function request_current_subscriptions() {
		$request = new WPSEO_MyYoast_Api_Request( 'sites/current' );
		if ( $request->fire() ) {
			$response = $request->get_response();

			if ( ! property_exists( $response, 'subscriptions' ) || empty( $response->subscriptions ) ) {
				return array();
			}

			return (array) $response->subscriptions;
		}

		return array();
	}

	/**
	 * Requires the files needed from WordPress itself.
	 *
	 * @codeCoverageIgnore
	 *
	 * @return void
	 */
	protected function require_dependencies() {
		if ( ! class_exists( 'WP_Upgrader' ) ) {
			require_once( ABSPATH . 'wp-admin/includes/class-wp-upgrader.php' );
		}

		if ( ! class_exists( 'Plugin_Upgrader' ) ) {
			require_once( ABSPATH . 'wp-admin/includes/class-plugin-upgrader.php' );
		}

		if ( ! class_exists( 'WP_Upgrader_Skin' ) ) {
			require_once( ABSPATH . 'wp-admin/includes/class-wp-upgrader-skin.php' );
		}

		if ( ! function_exists( 'get_plugin_data' ) ) {
			require_once( ABSPATH . 'wp-admin/includes/plugin.php' );
		}

		if ( ! function_exists( 'request_filesystem_credentials' ) ) {
			require_once( ABSPATH . 'wp-admin/includes/file.php' );
		}
	}

	/**
	 * Runs the installation by using the WordPress installation routine.
	 *
	 * @param string $plugin_download The url to the download.
	 *
	 * @codeCoverageIgnore Contains WordPress specific logic.
	 *
	 * @return bool|WP_Error True when success, WP_Error when something went wrong.
	 */
	protected function run_installation( $plugin_download ) {
		$plugin_upgrader = new Plugin_Upgrader( new WPSEO_MyYoast_Plugin_Installer_Skin() );

		return $plugin_upgrader->install( $plugin_download );
	}
}

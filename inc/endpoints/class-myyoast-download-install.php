<?php
/**
 * WPSEO plugin file.
 *
 * @package WPSEO\Endpoint
 */

/**
 * Represents an implementation of the WPSEO_Endpoint interface to register one or multiple endpoints.
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
			$plugin_slug     = $request->get_param( 'slug' );
			$plugin_download = $this->find_plugin_download( $plugin_slug );

			return new WP_REST_Response( $this->install_plugin( $plugin_download ) );
		}
		catch( WPSEO_REST_Request_Exception $exception ) {
			return new WP_REST_Response(
				$exception->getMessage(),
				403
			);
		}
	}

	/**
	 * Installs the plugin based on the given download.
	 *
	 * @param string $plugin_download The url to the download.
	 *
	 * @return bool True when install is successful.
	 *
	 * @throws WPSEO_REST_Request_Exception When an WP_Error occurred.
	 */
	protected function install_plugin( $plugin_download ) {
		$upgrader = new Plugin_Upgrader( new WPSEO_MyYoast_Plugin_Installer_Skin() );
		$result   = $upgrader->install( $plugin_download );
		if ( is_wp_error( $result ) ) {
			throw new WPSEO_REST_Request_Exception( $result->get_error_message() );
		}

		return $result;
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

		if ( ! $download_urls[ $plugin_slug ] ) {
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
		$subscriptions = $this->get_subscriptions();
		$download_urls = array();
		foreach ( $subscriptions as $subscription ) {
			$download_urls[ $subscription->product->slug ] = $subscription->product->download;
		}

		return $download_urls;
	}

	/**
	 * Retrieves the current subscriptions for the current website.
	 *
	 * @return array Subscriptions when set.
	 */
	protected function get_subscriptions() {
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
	 * @return void
	 */
	private function require_dependencies() {
		if ( ! class_exists( 'WP_Upgrader' ) ) {
			require_once( ABSPATH . 'wp-admin/includes/class-wp-upgrader.php' );
		}

		if( ! class_exists( 'Plugin_Upgrader' ) ) {
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
}

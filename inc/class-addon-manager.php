<?php
/**
 * WPSEO plugin file.
 *
 * @package WPSEO\Inc
 */

/**
 * Represents the addon manager.
 */
class WPSEO_Addon_Manager {

	/**
	 * The expected addon data.
	 *
	 * @var array
	 */
	protected static $addons = array(
		'wordpress-seo-premium' => 'WPSEO_FILE',
		'wpseo-news'            => 'WPSEO_NEWS',
		'wpseo-video'           => '',
		'wpseo-woocommerce'     => '',
		'wpseo-local'           => '',
	);

	/**
	 * Hooks into WordPress
	 *
	 * @codeCoverageIgnore
	 *
	 * @return void
	 */
	public function register_hooks() {
		add_filter( 'plugins_api', array( $this, 'plugins_api_filter' ), 10, 3 );
	}

	/**
	 * Retrieves the site information.
	 *
	 * @return stdClass The site information.
	 */
	public function get_site_information() {
		$site_information = $this->get_site_information_transient();

		if ( $site_information ) {
			return $site_information;
		}

		$site_information = $this->request_current_sites();
		if ( $site_information ) {
			return $site_information;
		}

		// Otherwise return the defaults.
		return (object) array(
			'url'           => WPSEO_Utils::get_home_url(),
			'subscriptions' => array(),
		);
	}

	/**
	 * Gets the subscriptions for current site.
	 *
	 * @return array The subscriptions.
	 */
	public function get_subscriptions() {
		return $this->get_site_information()->subscriptions;
	}

	/**
	 * Retrieves the subscription for the given slug.
	 *
	 * @param string $slug The plugin slug to retrieve.
	 *
	 * @return stdClass Subscription data when found, empty object when not found.
	 */
	public function get_subscription( $slug ) {
		foreach ( $this->get_subscriptions() as $subscription ) {
			if ( $subscription->product->slug === $slug ) {
				return $subscription;
			}
		}

		return new stdClass();
	}

	public function plugins_api_filter( $data, $action, $args ) {

		if ( $action !== 'plugin_information' ) {
			return $data;
		}

		if ( ! isset( $args->slug ) ) {
			return $data;
		}

		$addon = $this->find_addon_for_slug( $args->slug );
		if ( ! $addon ) {
			return $data;
		}

		// only do something if we're checking for our plugin
		if ( $action !== 'plugin_information' || ! isset( $args->slug ) || $args->slug !== $this->product->get_slug() ) {
			return $data;
		}
	}

	public function set_updates_available_data( $data ) {

		//constant()
	}

	/**
	 * Retrieves the current sites from the API.
	 *
	 * @codeCoverageIgnore
	 *
	 * @return bool|stdClass Object when request is successful. False if not.
	 */
	protected function request_current_sites() {
		$api_request = new WPSEO_MyYoast_Api_Request( 'sites/current' );
		if ( $api_request->fire() ) {
			$response = $api_request->get_response();

			set_transient( 'wpseo_site_information', $response, DAY_IN_SECONDS );

			return $response;
		}

		return false;
	}

	/**
	 * @codeCoverageIgnore
	 *
	 * @return mixed
	 */
	protected function get_site_information_transient() {
		return get_transient( 'wpseo_site_information' );
	}

	/**
	 * Converts a subscription to plugin based format.
	 *
	 * @param stdClass $subscription The subscription to convert.
	 *
	 * @return object
	 */
	protected function convert_subscription_to_plugin( $subscription ) {
		return (object) array(
			'new_version'   => $subscription->product->version,
			'name'          => '', // $subscription->product->name,
			'slug'          => $subscription->product->slug,
			'url'           => $subscription->product->version,
			'last_update'   => $subscription->product->lastUpdated,
			'homepage'      => $subscription->product->storeUrl,
			'download_link' => $subscription->product->download,
			'sections'      => serialize(
				array(
					'changelog' => $subscription->product->changelog,
				)
			),
		);
	}

	protected function find_addon_for_slug( $slug ) {
		foreach( self::$addons as $addon => $constant ) {
			if ( defined( $constant ) && $constant === $slug ) {
				return $this->get_subscription( $addon );
			}
		}

		return false;
	}
}

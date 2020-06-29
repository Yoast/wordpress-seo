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
	 * Holds the name of the transient.
	 *
	 * @var string
	 */
	const SITE_INFORMATION_TRANSIENT = 'wpseo_site_information';

	/**
	 * Holds the name of the transient.
	 *
	 * @var string
	 */
	const SITE_INFORMATION_TRANSIENT_QUICK = 'wpseo_site_information_quick';

	/**
	 * Holds the slug for YoastSEO free.
	 *
	 * @var string
	 */
	const FREE_SLUG = 'yoast-seo-wordpress';

	/**
	 * Holds the slug for YoastSEO Premium.
	 *
	 * @var string
	 */
	const PREMIUM_SLUG = 'yoast-seo-wordpress-premium';

	/**
	 * Holds the slug for Yoast News.
	 *
	 * @var string
	 */
	const NEWS_SLUG = 'yoast-seo-news';

	/**
	 * Holds the slug for Video.
	 *
	 * @var string
	 */
	const VIDEO_SLUG = 'yoast-seo-video';

	/**
	 * Holds the slug for WooCommerce.
	 *
	 * @var string
	 */
	const WOOCOMMERCE_SLUG = 'yoast-seo-woocommerce';

	/**
	 * Holds the slug for Local.
	 *
	 * @var string
	 */
	const LOCAL_SLUG = 'yoast-seo-local';

	/**
	 * The expected addon data.
	 *
	 * @var array
	 */
	protected static $addons = [
		'wp-seo-premium.php'    => self::PREMIUM_SLUG,
		'wpseo-news.php'        => self::NEWS_SLUG,
		'video-seo.php'         => self::VIDEO_SLUG,
		'wpseo-woocommerce.php' => self::WOOCOMMERCE_SLUG,
		'local-seo.php'         => self::LOCAL_SLUG,
	];

	/**
	 * Holds the site information data.
	 *
	 * @var object
	 */
	private $site_information;

	/**
	 * Hooks into WordPress.
	 *
	 * @codeCoverageIgnore
	 *
	 * @return void
	 */
	public function register_hooks() {
		add_filter( 'pre_set_site_transient_update_plugins', [ $this, 'check_for_updates' ] );
		add_filter( 'plugins_api', [ $this, 'get_plugin_information' ], 10, 3 );
	}

	/**
	 * Gets the subscriptions for current site.
	 *
	 * @return stdClass The subscriptions.
	 */
	public function get_subscriptions() {
		return $this->get_site_information()->subscriptions;
	}

	/**
	 * Retrieves the subscription for the given slug.
	 *
	 * @param string $slug The plugin slug to retrieve.
	 *
	 * @return stdClass|false Subscription data when found, false when not found.
	 */
	public function get_subscription( $slug ) {
		foreach ( $this->get_subscriptions() as $subscription ) {
			if ( $subscription->product->slug === $slug ) {
				return $subscription;
			}
		}

		return false;
	}

	/**
	 * Retrieves a list of (subscription) slugs by the active addons.
	 *
	 * @return array The slugs.
	 */
	public function get_subscriptions_for_active_addons() {
		$active_addons      = array_keys( $this->get_active_addons() );
		$subscription_slugs = array_map( [ $this, 'get_slug_by_plugin_file' ], $active_addons );
		$subscriptions      = [];
		foreach ( $subscription_slugs as $subscription_slug ) {
			$subscriptions[ $subscription_slug ] = $this->get_subscription( $subscription_slug );
		}

		return $subscriptions;
	}

	/**
	 * Retrieves a list of versions for each addon.
	 *
	 * @return array The addon versions.
	 */
	public function get_installed_addons_versions() {
		$addon_versions = [];
		foreach ( $this->get_installed_addons() as $plugin_file => $installed_addon ) {
			$addon_versions[ $this->get_slug_by_plugin_file( $plugin_file ) ] = $installed_addon['Version'];
		}

		return $addon_versions;
	}

	/**
	 * Retrieves the plugin information from the subscriptions.
	 *
	 * @param stdClass|false $data   The result object. Default false.
	 * @param string         $action The type of information being requested from the Plugin Installation API.
	 * @param stdClass       $args   Plugin API arguments.
	 *
	 * @return object Extended plugin data.
	 */
	public function get_plugin_information( $data, $action, $args ) {
		if ( $action !== 'plugin_information' ) {
			return $data;
		}

		if ( ! isset( $args->slug ) ) {
			return $data;
		}

		$subscription = $this->get_subscription( $args->slug );
		if ( ! $subscription || $this->has_subscription_expired( $subscription ) ) {
			return $data;
		}

		return $this->convert_subscription_to_plugin( $subscription );
	}

	/**
	 * Checks if the subscription for the given slug is valid.
	 *
	 * @param string $slug The plugin slug to retrieve.
	 *
	 * @return bool True when the subscription is valid.
	 */
	public function has_valid_subscription( $slug ) {
		$subscription = $this->get_subscription( $slug );

		// An non-existing subscription is never valid.
		if ( $subscription === false ) {
			return false;
		}

		return ! $this->has_subscription_expired( $subscription );
	}

	/**
	 * Checks if there are addon updates.
	 *
	 * @param stdClass|mixed $data The current data for update_plugins.
	 *
	 * @return stdClass Extended data for update_plugins.
	 */
	public function check_for_updates( $data ) {
		if ( empty( $data ) ) {
			return $data;
		}

		foreach ( $this->get_installed_addons() as $plugin_file => $installed_plugin ) {
			$subscription_slug = $this->get_slug_by_plugin_file( $plugin_file );
			$subscription      = $this->get_subscription( $subscription_slug );

			if ( ! $subscription || $this->has_subscription_expired( $subscription ) ) {
				continue;
			}

			if ( version_compare( $installed_plugin['Version'], $subscription->product->version, '<' ) ) {
				$data->response[ $plugin_file ] = $this->convert_subscription_to_plugin( $subscription );
			}
		}

		return $data;
	}

	/**
	 * Checks if there are any installed addons.
	 *
	 * @return bool True when there are installed Yoast addons.
	 */
	public function has_installed_addons() {
		$installed_addons = $this->get_installed_addons();

		return ! empty( $installed_addons );
	}

	/**
	 * Checks whether a plugin expiry date has been passed.
	 *
	 * @param stdClass $subscription Plugin subscription.
	 *
	 * @return bool Has the plugin expired.
	 */
	protected function has_subscription_expired( $subscription ) {
		return ( strtotime( $subscription->expiry_date ) - time() ) < 0;
	}

	/**
	 * Converts a subscription to plugin based format.
	 *
	 * @param stdClass $subscription The subscription to convert.
	 *
	 * @return stdClass The converted subscription.
	 */
	protected function convert_subscription_to_plugin( $subscription ) {
		return (object) [
			'new_version'   => $subscription->product->version,
			'name'          => $subscription->product->name,
			'slug'          => $subscription->product->slug,
			'url'           => $subscription->product->store_url,
			'last_update'   => $subscription->product->last_updated,
			'homepage'      => $subscription->product->store_url,
			'download_link' => $subscription->product->download,
			'package'       => $subscription->product->download,
			'sections'      => [
				'changelog' => $subscription->product->changelog,
			],
		];
	}

	/**
	 * Checks if the given plugin_file belongs to a Yoast addon.
	 *
	 * @param string $plugin_file Path to the plugin.
	 *
	 * @return bool True when plugin file is for a Yoast addon.
	 */
	protected function is_yoast_addon( $plugin_file ) {
		return $this->get_slug_by_plugin_file( $plugin_file ) !== '';
	}

	/**
	 * Retrieves the addon slug by given plugin file path.
	 *
	 * @param string $plugin_file The file path to the plugin.
	 *
	 * @return string The slug when found or empty string when not.
	 */
	protected function get_slug_by_plugin_file( $plugin_file ) {
		$addons = self::$addons;

		// Yoast SEO Free isn't an addon, but we needed it in Premium to fetch translations.
		if ( WPSEO_Utils::is_yoast_seo_premium() ) {
			$addons['wp-seo.php'] = self::FREE_SLUG;
		}

		foreach ( $addons as $addon => $addon_slug ) {
			if ( strpos( $plugin_file, $addon ) !== false ) {
				return $addon_slug;
			}
		}

		return '';
	}

	/**
	 * Retrieves the installed Yoast addons.
	 *
	 * @return array The installed plugins.
	 */
	protected function get_installed_addons() {
		return array_filter( $this->get_plugins(), [ $this, 'is_yoast_addon' ], ARRAY_FILTER_USE_KEY );
	}

	/**
	 * Retrieves a list of active addons.
	 *
	 * @return array The active addons.
	 */
	protected function get_active_addons() {
		return array_filter( $this->get_installed_addons(), [ $this, 'is_plugin_active' ], ARRAY_FILTER_USE_KEY );
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
			return $api_request->get_response();
		}

		return $this->get_site_information_default();
	}

	/**
	 * Retrieves the transient value with the site information.
	 *
	 * @codeCoverageIgnore
	 *
	 * @return stdClass|false The transient value.
	 */
	protected function get_site_information_transient() {
		global $pagenow;

		// Force re-check on license & dashboard pages.
		$current_page = $this->get_current_page();

		// Check whether the licenses are valid or whether we need to show notifications.
		$quick = ( $current_page === 'wpseo_licenses' || $current_page === 'wpseo_dashboard' );

		// Also do a fresh request on Plugins & Core Update pages.
		$quick = $quick || $pagenow === 'plugins.php';
		$quick = $quick || $pagenow === 'update-core.php';

		if ( $quick ) {
			return get_transient( self::SITE_INFORMATION_TRANSIENT_QUICK );
		}

		return get_transient( self::SITE_INFORMATION_TRANSIENT );
	}

	/**
	 * Returns the current page.
	 *
	 * @codeCoverageIgnore
	 *
	 * @return string The current page.
	 */
	protected function get_current_page() {
		return filter_input( INPUT_GET, 'page' );
	}

	/**
	 * Sets the site information transient.
	 *
	 * @codeCoverageIgnore
	 *
	 * @param stdClass $site_information The site information to save.
	 *
	 * @return void
	 */
	protected function set_site_information_transient( $site_information ) {
		set_transient( self::SITE_INFORMATION_TRANSIENT, $site_information, DAY_IN_SECONDS );
		set_transient( self::SITE_INFORMATION_TRANSIENT_QUICK, $site_information, 60 );
	}

	/**
	 * Retrieves all installed WordPress plugins.
	 *
	 * @codeCoverageIgnore
	 *
	 * @return array The plugins.
	 */
	protected function get_plugins() {
		if ( ! function_exists( 'get_plugins' ) ) {
			require_once ABSPATH . 'wp-admin/includes/plugin.php';
		}
		return get_plugins();
	}

	/**
	 * Checks if the given plugin file belongs to an active plugin.
	 *
	 * @codeCoverageIgnore
	 *
	 * @param string $plugin_file The file path to the plugin.
	 *
	 * @return bool True when plugin is active.
	 */
	protected function is_plugin_active( $plugin_file ) {
		return is_plugin_active( $plugin_file );
	}

	/**
	 * Returns an object with no subscriptions.
	 *
	 * @codeCoverageIgnore
	 *
	 * @return stdClass Site information.
	 */
	protected function get_site_information_default() {
		return (object) [
			'url'           => WPSEO_Utils::get_home_url(),
			'subscriptions' => [],
		];
	}

	/**
	 * Maps the plugin API response.
	 *
	 * @param object $site_information Site information as received from the API.
	 *
	 * @return object Mapped site information.
	 */
	protected function map_site_information( $site_information ) {
		return (object) [
			'url'           => $site_information->url,
			'subscriptions' => array_map( [ $this, 'map_subscription' ], $site_information->subscriptions ),
		];
	}

	/**
	 * Maps a plugin subscription.
	 *
	 * @param object $subscription Subscription information as received from the API.
	 *
	 * @return object Mapped subscription.
	 */
	protected function map_subscription( $subscription ) {
		// @codingStandardsIgnoreStart
		return (object) array(
			'renewal_url' => $subscription->renewalUrl,
			'expiry_date' => $subscription->expiryDate,
			'product'     => (object) array(
				'version'      => $subscription->product->version,
				'name'         => $subscription->product->name,
				'slug'         => $subscription->product->slug,
				'last_updated' => $subscription->product->lastUpdated,
				'store_url'    => $subscription->product->storeUrl,
				// Ternary operator is necessary because download can be undefined.
				'download'     => isset( $subscription->product->download ) ? $subscription->product->download : null,
				'changelog'    => $subscription->product->changelog,
			),
		);
		// @codingStandardsIgnoreStop
	}

	/**
	 * Retrieves the site information.
	 *
	 * @return stdClass The site information.
	 */
	private function get_site_information() {
		if ( ! $this->has_installed_addons() ) {
			return $this->get_site_information_default();
		}

		if ( $this->site_information === null ) {
			$this->site_information = $this->get_site_information_transient();
		}

		if ( $this->site_information ) {
			return $this->site_information;
		}

		$this->site_information = $this->request_current_sites();
		if ( $this->site_information ) {
			$this->site_information = $this->map_site_information( $this->site_information );

			$this->set_site_information_transient( $this->site_information );

			return $this->site_information;
		}

		return $this->get_site_information_default();
	}
}

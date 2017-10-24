<?php
/**
 * @package WPSEO\Plugin_Availability
 */

/**
 * Class WPSEO_Plugin_Availability
 */
class WPSEO_Plugin_Availability {

	/**
	 * @var array
	 */
	protected $plugins = array();

	/**
	 * WPSEO_Plugin_Availability constructor.
	 */
	public function __construct() {
		$this->register_yoast_plugins();
		$this->register_yoast_plugins_status();
	}

	/**
	 * Registers all the available Yoast SEO plugins.
	 */
	protected function register_yoast_plugins() {
		$this->plugins = array(
			'yoast-seo-premium' => array(
				'url'          => 'https://yoast.com/wordpress/plugins/seo-premium/',
				'title'        => 'Yoast SEO Premium',
				'description'  => sprintf(
					/* translators: %1$s expands to Yoast SEO */
					__( 'The premium version of %1$s with more features & support.', 'wordpress-seo' ),
					'Yoast SEO'
				),
				'installed'    => false,
				'slug'         => 'wordpress-seo-premium/wp-seo-premium.php',
				'version_sync' => true,
			),

			'video-seo-for-wordpress-seo-by-yoast' => array(
				'url'          => 'https://yoast.com/wordpress/plugins/video-seo/',
				'title'        => 'Video SEO',
				'description'  => __( 'Optimize your videos to show them off in search results and get more clicks!', 'wordpress-seo' ),
				'installed'    => false,
				'slug'         => 'wpseo-video/video-seo.php',
				'version_sync' => true,
			),

			'yoast-news-seo' => array(
				'url'          => 'https://yoast.com/wordpress/plugins/news-seo/',
				'title'        => 'News SEO',
				'description'  => __( 'Are you in Google News? Increase your traffic from Google News by optimizing for it!', 'wordpress-seo' ),
				'installed'    => false,
				'slug'         => 'wpseo-news/wpseo-news.php',
				'version_sync' => true,
			),

			'local-seo-for-yoast-seo' => array(
				'url'          => 'https://yoast.com/wordpress/plugins/local-seo/',
				'title'        => 'Local SEO',
				'description'  => __( 'Rank better locally and in Google Maps, without breaking a sweat!', 'wordpress-seo' ),
				'installed'    => false,
				'slug'         => 'wordpress-seo-local/local-seo.php',
				'version_sync' => true,
			),

			'yoast-woocommerce-seo' => array(
				'url'          => 'https://yoast.com/wordpress/plugins/yoast-woocommerce-seo/',
				'title'        => 'Yoast WooCommerce SEO',
				'description'  => sprintf(
					/* translators: %1$s expands to Yoast SEO */
					__( 'Seamlessly integrate WooCommerce with %1$s and get extra features!', 'wordpress-seo' ),
					'Yoast SEO'
				),
				'installed'    => false,
				'slug'         => 'wpseo-woocommerce/wpseo-woocommerce.php',
				'version_sync' => true,
			),

			'yoast-acf-analysis' => array(
				'url'           => 'https://wordpress.org/plugins/acf-content-analysis-for-yoast-seo/',
				'title'         => 'ACF Content Analysis for Yoast SEO',
				'description'   => sprintf(
					/* translators: %1$s expands to Yoast SEO, %2$s expands to Advanced Custom Fields */
					__( 'Seamlessly integrate %2$s with %1$s for the content analysis!', 'wordpress-seo' ),
					'Yoast SEO',
					'Advanced Custom Fields'
				),
				'installed'     => false,
				'slug'          => 'acf-content-analysis-for-yoast-seo/yoast-acf-analysis.php',
				'_dependencies' => array(
					'Advanced Custom Fields' => array(
						'slug' => 'advanced-custom-fields/acf.php',
					),
				),
				'version_sync'  => false,
			),

			'yoastseo-amp' => array(
				'url'           => 'https://wordpress.org/plugins/glue-for-yoast-seo-amp/',
				'title'         => 'Yoast SEO AMP Glue',
				'description'   => sprintf(
					/* translators: %1$s expands to Yoast SEO */
					__( 'Seamlessly integrate %1$s into your AMP pages!', 'wordpress-seo' ),
					'Yoast SEO'
				),
				'installed'     => false,
				'slug'          => 'glue-for-yoast-seo-amp/yoastseo-amp.php',
				'_dependencies' => array(
					'AMP' => array(
						'slug' => 'amp/amp.php',
					),
				),
				'version_sync'  => false,
			),
		);
	}

	/**
	 * Sets certain plugin properties based on WordPress' status.
	 */
	protected function register_yoast_plugins_status() {

		foreach ( $this->plugins as $name => $plugin ) {

			$plugin_slug = $plugin['slug'];
			$plugin_path = WP_PLUGIN_DIR . '/' . $plugin_slug;

			if ( file_exists( $plugin_path ) ) {
				$plugin_data                         = get_plugin_data( $plugin_path, false, false );
				$this->plugins[ $name ]['installed'] = true;
				$this->plugins[ $name ]['version']   = $plugin_data['Version'];
				$this->plugins[ $name ]['active']    = is_plugin_active( $plugin_slug );
			}
		}
	}

	/**
	 * Checks whether or not a plugin is known within the Yoast SEO collection.
	 *
	 * @param {string} $plugin The plugin to search for.
	 *
	 * @return bool Whether or not the plugin is exists.
	 */
	protected function plugin_exists( $plugin ) {
		return isset( $this->plugins[ $plugin ] );
	}

	/**
	 * Gets all the possibly available plugins.
	 *
	 * @return array Array containing the information about the plugins.
	 */
	public function get_plugins() {
		return $this->plugins;
	}

	/**
	 * Gets a specific plugin. Returns an empty array if it cannot be found.
	 *
	 * @param {string} $plugin The plugin to search for.
	 *
	 * @return array The plugin properties.
	 */
	public function get_plugin( $plugin ) {
		if ( ! $this->plugin_exists( $plugin ) ) {
			return array();
		}

		return $this->plugins[ $plugin ];
	}

	/**
	 * Gets the version of the plugin.
	 *
	 * @param {string} $plugin The plugin to search for.
	 *
	 * @return string The version associated with the plugin.
	 */
	public function get_version( $plugin ) {
		if ( ! isset( $plugin['version'] ) ) {
			return '';
		}

		return $plugin['version'];
	}

	/**
	 * Checks if there are dependencies available for the plugin.
	 *
	 * @param {string} $plugin The plugin to search for.
	 *
	 * @return bool Whether or not there is a dependency present.
	 */
	public function has_dependencies( $plugin ) {
		return ( isset( $plugin['_dependencies'] ) && ! empty( $plugin['_dependencies'] ) );
	}

	/**
	 * Gets the dependencies for the plugin.
	 *
	 * @param {string} $plugin The plugin to search for.
	 *
	 * @return array Array containing all the dependencies associated with the plugin.
	 */
	public function get_dependencies( $plugin ) {
		if ( ! $this->has_dependencies( $plugin ) ) {
			return array();
		}

		return $plugin['_dependencies'];
	}

	/**
	 * Checks if all dependencies are satisfied.
	 *
	 * @param {string} $plugin The plugin to search for.
	 *
	 * @return bool Whether or not the dependencies are satisfied.
	 */
	public function dependencies_are_satisfied( $plugin ) {
		if ( ! $this->has_dependencies( $plugin ) ) {
			return true;
		}

		$dependencies = $this->get_dependencies( $plugin );
		$installed_dependencies = array_filter( $dependencies, array( $this, 'is_dependency_available' ) );

		return count( $installed_dependencies ) === count( $dependencies );
	}

	/**
	 * Checks whether or not one of the plugins is properly installed and usable.
	 *
	 * @param {string} $plugin The plugin to search for.
	 *
	 * @return bool Whether or not the plugin is properly installed.
	 */
	public function is_installed( $plugin ) {
		if ( empty( $plugin ) ) {
			return false;
		}

		$dependencies_are_satisfied = $this->dependencies_are_satisfied( $plugin );

		return $dependencies_are_satisfied && $this->is_available( $plugin );
	}

	/**
	 * Gets all installed plugins.
	 *
	 * @return array The installed plugins.
	 */
	public function get_installed_plugins() {
		$installed = array();

		foreach ( $this->plugins as $plugin_key => $plugin ) {
			if ( $this->is_installed( $plugin ) ) {
				$installed[ $plugin_key ] = $plugin;
			}
		}

		return $installed;
	}

	/**
	 * Checks for the availability of the plugin.
	 *
	 * @param {string} $plugin The plugin to search for.
	 *
	 * @return bool Whether or not the plugin is available.
	 */
	public function is_available( $plugin ) {
		return isset( $plugin['installed'] ) && $plugin['installed'] === true;
	}

	/**
	 * Checks whether a dependency is available.
	 *
	 * @param {string} $dependency The dependency to look for.
	 *
	 * @return bool Whether or not the dependency is available.
	 */
	public function is_dependency_available( $dependency ) {
		return in_array( $dependency['slug'], array_keys( get_plugins() ), true );
	}

	/**
	 * Gets the names of the dependencies.
	 *
	 * @param array $plugin The plugin to get the dependency names from.
	 *
	 * @return array Array containing the names of the associated dependencies.
	 */
	public function get_dependency_names( $plugin ) {
		if ( ! $this->has_dependencies( $plugin ) ) {
			return array();
		}

		return array_keys( $plugin['_dependencies'] );
	}

	/**
	 * Gets an array of plugins that have defined dependencies.
	 *
	 * @return array Array of the plugins that have dependencies.
	 */
	public function get_plugins_with_dependencies() {
		return array_filter( $this->plugins, array( $this, 'has_dependencies' ) );
	}
}

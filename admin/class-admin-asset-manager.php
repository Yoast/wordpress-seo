<?php
/**
 * WPSEO plugin file.
 *
 * @package WPSEO\Admin
 */

/**
 * This class registers all the necessary styles and scripts. Also has methods for the enqueing of scripts and styles. It automatically adds a prefix to the handle.
 */
class WPSEO_Admin_Asset_Manager {

	/**
	 * @var WPSEO_Admin_Asset_Location
	 */
	protected $asset_location;

	/**
	 * Prefix for naming the assets.
	 *
	 * @var string
	 */
	const PREFIX = 'yoast-seo-';

	/**
	 * Prefix for naming the assets.
	 *
	 * @var string
	 */
	private $prefix;

	/**
	 * Constructs a manager of assets. Needs a location to know where to register assets at.
	 *
	 * @param WPSEO_Admin_Asset_Location $asset_location The provider of the asset location.
	 * @param string                     $prefix         The prefix for naming assets.
	 */
	public function __construct( WPSEO_Admin_Asset_Location $asset_location = null, $prefix = self::PREFIX ) {
		if ( $asset_location === null ) {
			$asset_location = self::create_default_location();
		}

		$this->asset_location = $asset_location;
		$this->prefix         = $prefix;
	}

	/**
	 * Enqueues scripts.
	 *
	 * @param string $script The name of the script to enqueue.
	 */
	public function enqueue_script( $script ) {
		wp_enqueue_script( $this->prefix . $script );
	}

	/**
	 * Enqueues styles.
	 *
	 * @param string $style The name of the style to enqueue.
	 */
	public function enqueue_style( $style ) {
		wp_enqueue_style( $this->prefix . $style );
	}

	/**
	 * Registers scripts based on it's parameters.
	 *
	 * @param WPSEO_Admin_Asset $script The script to register.
	 */
	public function register_script( WPSEO_Admin_Asset $script ) {
		wp_register_script(
			$this->prefix . $script->get_name(),
			$this->get_url( $script, WPSEO_Admin_Asset::TYPE_JS ),
			$script->get_deps(),
			$script->get_version(),
			$script->is_in_footer()
		);
	}

	/**
	 * Registers styles based on it's parameters.
	 *
	 * @param WPSEO_Admin_Asset $style The style to register.
	 */
	public function register_style( WPSEO_Admin_Asset $style ) {
		wp_register_style(
			$this->prefix . $style->get_name(),
			$this->get_url( $style, WPSEO_Admin_Asset::TYPE_CSS ),
			$style->get_deps(),
			$style->get_version(),
			$style->get_media()
		);
	}

	/**
	 * Calls the functions that register scripts and styles with the scripts and styles to be registered as arguments.
	 */
	public function register_assets() {
		$this->register_scripts( $this->scripts_to_be_registered() );
		$this->register_styles( $this->styles_to_be_registered() );
	}

	/**
	 * Registers all the scripts passed to it.
	 *
	 * @param array $scripts The scripts passed to it.
	 */
	public function register_scripts( $scripts ) {
		foreach ( $scripts as $script ) {
			$script = new WPSEO_Admin_Asset( $script );
			$this->register_script( $script );
		}
	}

	/**
	 * Registers all the styles it receives.
	 *
	 * @param array $styles Styles that need to be registered.
	 */
	public function register_styles( $styles ) {
		foreach ( $styles as $style ) {
			$style = new WPSEO_Admin_Asset( $style );
			$this->register_style( $style );
		}
	}

	/**
	 * A list of styles that shouldn't be registered but are needed in other locations in the plugin.
	 *
	 * @return array
	 */
	public function special_styles() {
		$flat_version = $this->flatten_version( WPSEO_VERSION );
		$asset_args   = array(
			'name' => 'inside-editor',
			'src'  => 'inside-editor-' . $flat_version,
		);

		return array( 'inside-editor' => new WPSEO_Admin_Asset( $asset_args ) );
	}

	/**
	 * Flattens a version number for use in a filename
	 *
	 * @param string $version The original version number.
	 *
	 * @return string The flattened version number.
	 */
	public function flatten_version( $version ) {
		$parts = explode( '.', $version );

		if ( count( $parts ) === 2 && preg_match( '/^\d+$/', $parts[1] ) === 1 ) {
			$parts[] = '0';
		}

		return implode( '', $parts );
	}

	/**
	 * Creates a default location object for use in the admin asset manager.
	 *
	 * @return WPSEO_Admin_Asset_Location The location to use in the asset manager.
	 */
	public static function create_default_location() {
		if ( defined( 'YOAST_SEO_DEV_SERVER' ) && YOAST_SEO_DEV_SERVER ) {
			$url = defined( 'YOAST_SEO_DEV_SERVER_URL' ) ? YOAST_SEO_DEV_SERVER_URL : WPSEO_Admin_Asset_Dev_Server_Location::DEFAULT_URL;

			return new WPSEO_Admin_Asset_Dev_Server_Location( $url );
		}

		return new WPSEO_Admin_Asset_SEO_Location( WPSEO_FILE );
	}

	/**
	 * Registers the WordPress dependencies that exist in 5.0 in case they are not present.
	 *
	 * This function can be removed when WordPress 5.1 has been released, because from 5.0 wp-elements will be
	 * registered earlier, which means we don't have to reregister things.
	 *
	 * @return void
	 */
	public function register_wp_assets() {

		global $wp_scripts;

		$script = $wp_scripts->query( 'react' );

		// IE11 needs wp-polyfill to be registered before react.
		if ( $script && ! in_array( 'wp-polyfill', $script->deps, true ) ) {
			$script->deps[] = 'wp-polyfill';
		}

		$flat_version = $this->flatten_version( WPSEO_VERSION );

		wp_register_script(
			'react',
			plugins_url( 'js/vendor/react.min.js', WPSEO_FILE ),
			array(),
			'v16.6.1',
			true
		);

		wp_register_script(
			'react-dom',
			plugins_url( 'js/vendor/react-dom.min.js', WPSEO_FILE ),
			array( 'react' ),
			'v16.6.1',
			true
		);

		wp_register_script(
			'lodash-base',
			plugins_url( 'js/vendor/lodash.min.js', WPSEO_FILE ),
			array(),
			'4.17.5',
			true
		);

		wp_register_script(
			'lodash',
			plugins_url( 'js/vendor/lodash-noconflict.js', WPSEO_FILE ),
			array( 'lodash-base' ),
			WPSEO_VERSION,
			true
		);

		wp_register_script(
			'wp-polyfill',
			plugins_url( 'js/dist/babel-polyfill-' . $flat_version . '.min.js', WPSEO_FILE ),
			array(),
			WPSEO_VERSION,
			true
		);

		wp_register_script(
			'wp-element',
			plugins_url( 'js/dist/wp-element-' . $flat_version . '.min.js', WPSEO_FILE ),
			array( 'lodash', 'wp-polyfill', 'react', 'react-dom' ),
			WPSEO_VERSION,
			true
		);

		wp_register_script(
			'wp-api-fetch',
			plugins_url( 'js/dist/wp-apiFetch-' . $flat_version . '.min.js', WPSEO_FILE ),
			array( 'wp-i18n', 'wp-polyfill' ),
			WPSEO_VERSION,
			true
		);

		wp_register_script(
			'wp-components',
			plugins_url( 'js/dist/wp-components-' . $flat_version . '.min.js', WPSEO_FILE ),
			array( 'lodash', 'wp-api-fetch', 'wp-i18n', 'wp-polyfill', 'wp-compose' ),
			WPSEO_VERSION,
			true
		);

		wp_register_script(
			'wp-data',
			plugins_url( 'js/dist/wp-data-' . $flat_version . '.min.js', WPSEO_FILE ),
			array( 'lodash', 'wp-element', 'wp-polyfill', 'wp-compose' ),
			WPSEO_VERSION,
			true
		);

		wp_register_script(
			'wp-i18n',
			plugins_url( 'js/dist/wp-i18n-' . $flat_version . '.min.js', WPSEO_FILE ),
			array( 'wp-polyfill' ),
			WPSEO_VERSION,
			true
		);

		wp_register_script(
			'wp-rich-text',
			plugins_url( 'js/dist/wp-rich-text-' . $flat_version . '.min.js', WPSEO_FILE ),
			array( 'lodash', 'wp-polyfill', 'wp-data' ),
			WPSEO_VERSION,
			true
		);

		wp_register_script(
			'wp-compose',
			plugins_url( 'js/dist/wp-compose-' . $flat_version . '.min.js', WPSEO_FILE ),
			array( 'lodash', 'wp-polyfill' ),
			WPSEO_VERSION,
			true
		);

		/*
		 * wp-annotations only exists from Gutenberg 4.3 and onwards, so we register a no-op in earlier versions.
		 * The no-op achieves that our scripts that depend on this are actually loaded. Because WordPress doesn't
		 * load a script if any of the dependencies are missing.
		 *
		 * @phpcs:disable WordPress.WP.EnqueuedResourceParameters -- The no-op does not require these settings.
		 */
		wp_register_script(
			'wp-annotations',
			null
		);
		// phpcs:enable -- End of disable.
	}

	/**
	 * Returns the scripts that need to be registered.
	 *
	 * @todo Data format is not self-documenting. Needs explanation inline. R.
	 *
	 * @return array The scripts that need to be registered.
	 */
	protected function scripts_to_be_registered() {
		$select2_language = 'en';
		$user_locale      = WPSEO_Language_Utils::get_user_locale();
		$language         = WPSEO_Language_Utils::get_language( $user_locale );

		if ( file_exists( WPSEO_PATH . "js/dist/select2/i18n/{$user_locale}.js" ) ) {
			$select2_language = $user_locale; // Chinese and some others use full locale.
		}
		elseif ( file_exists( WPSEO_PATH . "js/dist/select2/i18n/{$language}.js" ) ) {
			$select2_language = $language;
		}

		$flat_version = $this->flatten_version( WPSEO_VERSION );

		return array(
			array(
				'name' => 'commons',
				// Load webpack-commons for bundle support.
				'src'  => 'commons-' . $flat_version,
				'deps' => array(
					'wp-polyfill',
				),
			),
			array(
				'name' => 'search-appearance',
				'src'  => 'search-appearance-' . $flat_version,
				'deps' => array(
					'wp-api',
					self::PREFIX . 'components',
					self::PREFIX . 'commons',
				),
			),
			array(
				'name' => 'yoast-modal',
				'src'  => 'wp-seo-modal-' . $flat_version,
				'deps' => array(
					'jquery',
					'wp-element',
					'wp-i18n',
					self::PREFIX . 'components',
					self::PREFIX . 'commons',
				),
			),
			array(
				'name' => 'help-center',
				'src'  => 'wp-seo-help-center-' . $flat_version,
				'deps' => array(
					'jquery',
					'wp-element',
					'wp-i18n',
					self::PREFIX . 'components',
					self::PREFIX . 'commons',
				),
			),
			array(
				'name' => 'admin-script',
				'src'  => 'wp-seo-admin-' . $flat_version,
				'deps' => array(
					'jquery',
					'jquery-ui-core',
					'jquery-ui-progressbar',
					self::PREFIX . 'select2',
					self::PREFIX . 'select2-translations',
					self::PREFIX . 'commons',
				),
			),
			array(
				'name' => 'admin-media',
				'src'  => 'wp-seo-admin-media-' . $flat_version,
				'deps' => array(
					'jquery',
					'jquery-ui-core',
					self::PREFIX . 'commons',
				),
			),
			array(
				'name' => 'network-admin-script',
				'src'  => 'wp-seo-network-admin-' . $flat_version,
				'deps' => array(
					'jquery',
					self::PREFIX . 'commons',
				),
			),
			array(
				'name' => 'bulk-editor',
				'src'  => 'wp-seo-bulk-editor-' . $flat_version,
				'deps' => array(
					'jquery',
					self::PREFIX . 'commons',
				),
			),
			array(
				'name' => 'admin-global-script',
				'src'  => 'wp-seo-admin-global-' . $flat_version,
				'deps' => array(
					'jquery',
					self::PREFIX . 'commons',
				),
			),
			array(
				'name'      => 'metabox',
				'src'       => 'wp-seo-metabox-' . $flat_version,
				'deps'      => array(
					'jquery',
					'wp-element',
					'wp-i18n',
					'wp-data',
					'wp-components',
					self::PREFIX . 'select2',
					self::PREFIX . 'select2-translations',
					self::PREFIX . 'commons',
				),
				'in_footer' => false,
			),
			array(
				'name' => 'featured-image',
				'src'  => 'wp-seo-featured-image-' . $flat_version,
				'deps' => array(
					'jquery',
					self::PREFIX . 'commons',
				),
			),
			array(
				'name'      => 'admin-gsc',
				'src'       => 'wp-seo-admin-gsc-' . $flat_version,
				'deps'      => array(
					'wp-element',
					'wp-i18n',
					self::PREFIX . 'styled-components',
					self::PREFIX . 'components',
					self::PREFIX . 'commons',
				),
				'in_footer' => false,
			),
			array(
				'name' => 'post-scraper',
				'src'  => 'wp-seo-post-scraper-' . $flat_version,
				'deps' => array(
					'wp-util',
					'wp-api',
					'wp-element',
					'wp-i18n',
					'wp-data',
					'wp-api-fetch',
					'wp-annotations',
					'wp-compose',
					self::PREFIX . 'replacevar-plugin',
					self::PREFIX . 'shortcode-plugin',
					self::PREFIX . 'analysis',
					self::PREFIX . 'components',
					self::PREFIX . 'commons',
				),
			),
			array(
				'name' => 'term-scraper',
				'src'  => 'wp-seo-term-scraper-' . $flat_version,
				'deps' => array(
					'wp-element',
					'wp-i18n',
					'wp-data',
					'wp-api-fetch',
					'wp-compose',
					self::PREFIX . 'replacevar-plugin',
					self::PREFIX . 'analysis',
					self::PREFIX . 'components',
					self::PREFIX . 'commons',
				),
			),
			array(
				'name' => 'replacevar-plugin',
				'src'  => 'wp-seo-replacevar-plugin-' . $flat_version,
				'deps' => array(
					self::PREFIX . 'analysis',
					self::PREFIX . 'components',
					self::PREFIX . 'commons',
				),
			),
			array(
				'name' => 'shortcode-plugin',
				'src'  => 'wp-seo-shortcode-plugin-' . $flat_version,
				'deps' => array(
					self::PREFIX . 'analysis',
					self::PREFIX . 'commons',
				),
			),
			array(
				'name' => 'recalculate',
				'src'  => 'wp-seo-recalculate-' . $flat_version,
				'deps' => array(
					'jquery',
					'jquery-ui-core',
					'jquery-ui-progressbar',
					self::PREFIX . 'analysis',
					self::PREFIX . 'commons',
				),
			),
			array(
				'name' => 'primary-category',
				'src'  => 'wp-seo-metabox-category-' . $flat_version,
				'deps' => array(
					'jquery',
					'wp-util',
					'wp-element',
					'wp-i18n',
					'wp-components',
					'wp-data',
					self::PREFIX . 'commons',
				),
			),
			array(
				'name'    => 'select2',
				'src'     => 'select2/select2.full',
				'suffix'  => '.min',
				'deps'    => array(
					'jquery',
				),
				'version' => '4.0.3',
			),
			array(
				'name'    => 'select2-translations',
				'src'     => 'select2/i18n/' . $select2_language,
				'deps'    => array(
					'jquery',
					self::PREFIX . 'select2',
				),
				'version' => '4.0.3',
				'suffix'  => '',
			),
			array(
				'name' => 'configuration-wizard',
				'src'  => 'configuration-wizard-' . $flat_version,
				'deps' => array(
					'jquery',
					'wp-element',
					'wp-i18n',
					'wp-api',
					self::PREFIX . 'components',
					self::PREFIX . 'commons',
				),
			),
			array(
				'name' => 'reindex-links',
				'src'  => 'wp-seo-reindex-links-' . $flat_version,
				'deps' => array(
					'jquery',
					'jquery-ui-core',
					'jquery-ui-progressbar',
					self::PREFIX . 'commons',
				),
			),
			array(
				'name' => 'edit-page-script',
				'src'  => 'wp-seo-edit-page-' . $flat_version,
				'deps' => array(
					'jquery',
					self::PREFIX . 'commons',
				),
			),
			array(
				'name'      => 'quick-edit-handler',
				'src'       => 'wp-seo-quick-edit-handler-' . $flat_version,
				'deps'      => array(
					'jquery',
					self::PREFIX . 'commons',
				),
				'in_footer' => true,
			),
			array(
				'name' => 'api',
				'src'  => 'wp-seo-api-' . $flat_version,
				'deps' => array(
					'wp-api',
					'jquery',
					self::PREFIX . 'commons',
				),
			),
			array(
				'name' => 'dashboard-widget',
				'src'  => 'wp-seo-dashboard-widget-' . $flat_version,
				'deps' => array(
					self::PREFIX . 'api',
					'jquery',
					'wp-element',
					'wp-i18n',
					self::PREFIX . 'components',
					self::PREFIX . 'commons',
				),
			),
			array(
				'name' => 'filter-explanation',
				'src'  => 'wp-seo-filter-explanation-' . $flat_version,
				'deps' => array(
					'jquery',
					self::PREFIX . 'commons',
				),
			),
			array(
				'name' => 'analysis',
				'src'  => 'analysis-' . $flat_version,
				'deps' => array(
					'lodash',
					self::PREFIX . 'commons',
				),
			),
			array(
				'name' => 'components',
				'src'  => 'components-' . $flat_version,
				'deps' => array(
					self::PREFIX . 'analysis',
					self::PREFIX . 'styled-components',
					self::PREFIX . 'commons',
				),
			),
			array(
				'name' => 'structured-data-blocks',
				'src'  => 'wp-seo-structured-data-blocks-' . $flat_version,
				'deps' => array(
					'wp-blocks',
					'wp-i18n',
					'wp-element',
					self::PREFIX . 'styled-components',
					self::PREFIX . 'commons',
				),
			),
			array(
				'name' => 'styled-components',
				'src'  => 'styled-components-' . $flat_version,
				'deps' => array(
					'wp-element',
				),
			),
			array(
				'name' => 'courses-overview',
				'src'  => 'wp-seo-courses-overview-' . $flat_version,
				'deps' => array(
					'wp-element',
					'wp-i18n',
					self::PREFIX . 'styled-components',
					self::PREFIX . 'components',
				),
			),
		);
	}

	/**
	 * Returns the styles that need to be registered.
	 *
	 * @todo Data format is not self-documenting. Needs explanation inline. R.
	 *
	 * @return array styles that need to be registered.
	 */
	protected function styles_to_be_registered() {
		$flat_version = $this->flatten_version( WPSEO_VERSION );

		return array(
			array(
				'name' => 'admin-css',
				'src'  => 'yst_plugin_tools-' . $flat_version,
				'deps' => array( self::PREFIX . 'toggle-switch' ),
			),
			array(
				'name' => 'toggle-switch',
				'src'  => 'toggle-switch-' . $flat_version,
			),
			array(
				'name' => 'dismissible',
				'src'  => 'wpseo-dismissible-' . $flat_version,
			),
			array(
				'name' => 'alerts',
				'src'  => 'alerts-' . $flat_version,
			),
			array(
				'name' => 'edit-page',
				'src'  => 'edit-page-' . $flat_version,
			),
			array(
				'name' => 'featured-image',
				'src'  => 'featured-image-' . $flat_version,
			),
			array(
				'name' => 'metabox-css',
				'src'  => 'metabox-' . $flat_version,
				'deps' => array(
					self::PREFIX . 'select2',
				),
			),
			array(
				'name' => 'wp-dashboard',
				'src'  => 'dashboard-' . $flat_version,
			),
			array(
				'name' => 'scoring',
				'src'  => 'yst_seo_score-' . $flat_version,
			),
			array(
				'name' => 'adminbar',
				'src'  => 'adminbar-' . $flat_version,
			),
			array(
				'name' => 'primary-category',
				'src'  => 'metabox-primary-category-' . $flat_version,
			),
			array(
				'name'    => 'select2',
				'src'     => 'select2/select2',
				'suffix'  => '.min',
				'version' => '4.0.1',
				'rtl'     => false,
			),
			array(
				'name' => 'admin-global',
				'src'  => 'admin-global-' . $flat_version,
			),
			array(
				'name' => 'yoast-components',
				'src'  => 'yoast-components-' . $flat_version,
			),
			array(
				'name' => 'extensions',
				'src'  => 'yoast-extensions-' . $flat_version,
			),
			array(
				'name' => 'filter-explanation',
				'src'  => 'filter-explanation-' . $flat_version,
			),
			array(
				'name' => 'search-appearance',
				'src'  => 'search-appearance-' . $flat_version,
			),
			array(
				'name' => 'structured-data-blocks',
				'src'  => 'structured-data-blocks-' . $flat_version,
				'deps' => array( 'wp-edit-blocks' ),
			),
		);
	}

	/**
	 * Determines the URL of the asset.
	 *
	 * @param WPSEO_Admin_Asset $asset The asset to determine the URL for.
	 * @param string            $type  The type of asset. Usually JS or CSS.
	 *
	 * @return string The URL of the asset.
	 */
	protected function get_url( WPSEO_Admin_Asset $asset, $type ) {
		$scheme = wp_parse_url( $asset->get_src(), PHP_URL_SCHEME );
		if ( in_array( $scheme, array( 'http', 'https' ), true ) ) {
			return $asset->get_src();
		}

		return $this->asset_location->get_url( $asset, $type );
	}
}

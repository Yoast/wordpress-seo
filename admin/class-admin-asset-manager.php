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
	 * @var array The backport dependencies.
	 */
	protected static $backport_dependencies;

	/**
	 *  Prefix for naming the assets.
	 */
	const PREFIX = 'yoast-seo-';

	/**
	 * @var string prefix for naming the assets.
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
			$this->asset_location->get_url( $script, WPSEO_Admin_Asset::TYPE_JS ),
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
			$this->asset_location->get_url( $style, WPSEO_Admin_Asset::TYPE_CSS ),
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
	 * Registers all the styles it recieves.
	 *
	 * @param array $styles Styles that need to be registerd.
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
	 * Reregisters the globals backport asset with the correct dependencies.
	 *
	 * This function can be removed when WordPress 5.1 has been released, because from 5.0 wp-elements will be
	 * registered earlier, which means we don't have to reregister things.
	 *
	 * @return void
	 */
	public function register_wp_assets() {
		// The dependencies that are registered on 'admin_init'.
		$previous_deps = self::$backport_dependencies;

		// The dependencies that are present on 'admin_init'.
		$current_deps = $this->get_backport_dependencies();

		/*
		 * This is false when Gutenberg is active, because in that case Gutenberg's scripts are not registered yet
		 * on 'admin_init', but they are on 'admin_enqueue_scripts'.
		 */
		if ( $current_deps === $previous_deps ) {
			return;
		}

		wp_deregister_script( self::PREFIX . 'wp-globals-backport' );

		$flat_version = $this->flatten_version( WPSEO_VERSION );
		$args = array(
			'name' => 'wp-globals-backport',
			'src'  => 'wp-seo-wp-globals-backport-' . $flat_version,
			'deps' => $current_deps,
		);

		$script = new WPSEO_Admin_Asset( $args );
		$this->register_script( $script );
	}

	/**
	 * Gets the correct dependencies for the global backport.
	 *
	 * @return array The dependencies for the global backport.
	 */
	protected function get_backport_dependencies() {
		$backport_wp_dependencies = array( self::PREFIX . 'react-dependencies' );

		// If Gutenberg is present we can borrow their globals for our own.
		if ( $this->should_load_gutenberg_assets() ) {
			$backport_wp_dependencies[] = 'wp-element';
			$backport_wp_dependencies[] = 'wp-data';
			$backport_wp_dependencies[] = 'wp-components';

			/*
			 * The version of TinyMCE that Gutenberg uses is incompatible with
			 * the one core uses. So we need to make sure that the core version
			 * is used in the classic editor.
			 *
			 * $_GET is used here because as far as I am aware you cannot use
			 * filter_input to check for the existence of a query variable.
			 */
			if ( wp_script_is( 'tinymce-latest', 'registered' ) && isset( $_GET['classic-editor'] ) ) {
				wp_deregister_script( 'tinymce-latest' );
				wp_register_script( 'tinymce-latest', includes_url( 'js/tinymce/' ) . 'wp-tinymce.php', array( 'jquery' ), false, true );
			}
		}
		else {
			if ( wp_script_is( 'lodash', 'registered' ) ) {
				$backport_wp_dependencies[] = 'lodash';
			}
			else {
				if ( ! wp_script_is( self::PREFIX . 'lodash', 'registered' ) ) {
					wp_register_script( self::PREFIX . 'lodash-base', plugins_url( 'js/vendor/lodash.min.js', WPSEO_FILE ), array(), false, true );
					wp_register_script( self::PREFIX . 'lodash', plugins_url( 'js/vendor/lodash-noconflict.js', WPSEO_FILE ), array( self::PREFIX . 'lodash-base' ), false, true );
				}
				$backport_wp_dependencies[] = self::PREFIX . 'lodash';
			}
		}

		// Save the $backport_dependencies to use in register_wp_assets.
		self::$backport_dependencies = $backport_wp_dependencies;

		return $backport_wp_dependencies;
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
		$user_locale      = WPSEO_Utils::get_user_locale();
		$language         = WPSEO_Utils::get_language( $user_locale );

		if ( file_exists( WPSEO_PATH . "js/dist/select2/i18n/{$user_locale}.js" ) ) {
			$select2_language = $user_locale; // Chinese and some others use full locale.
		}
		elseif ( file_exists( WPSEO_PATH . "js/dist/select2/i18n/{$language}.js" ) ) {
			$select2_language = $language;
		}

		$flat_version = $this->flatten_version( WPSEO_VERSION );

		$backport_wp_dependencies = $this->get_backport_dependencies();

		// If Gutenberg's babel polyfill is not present, use our own.
		$babel_polyfill = 'wp-polyfill-ecmascript';
		if ( ! wp_script_is( 'wp-polyfill-ecmascript', 'registered' ) ) {
			$babel_polyfill = self::PREFIX . 'babel-polyfill';
		}

		return array(
			array(
				'name' => 'react-dependencies',
				// Load webpack-commons for bundle support.
				'src'  => 'commons-' . $flat_version,
				'deps' => array( $babel_polyfill ),
			),
			array(
				'name' => 'search-appearance',
				'src'  => 'search-appearance-' . $flat_version,
				'deps' => array(
					self::PREFIX . 'react-dependencies',
					self::PREFIX . 'components',
				),
			),
			array(
				'name' => 'wp-globals-backport',
				'src'  => 'wp-seo-wp-globals-backport-' . $flat_version,
				'deps' => $backport_wp_dependencies,
			),
			array(
				'name' => 'yoast-modal',
				'src'  => 'wp-seo-modal-' . $flat_version,
				'deps' => array(
					'jquery',
					self::PREFIX . 'wp-globals-backport',
					self::PREFIX . 'components',
				),
			),
			array(
				'name' => 'help-center',
				'src'  => 'wp-seo-help-center-' . $flat_version,
				'deps' => array(
					'jquery',
					self::PREFIX . 'wp-globals-backport',
					self::PREFIX . 'components',
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
					self::PREFIX . 'react-dependencies',
				),
			),
			array(
				'name' => 'admin-media',
				'src'  => 'wp-seo-admin-media-' . $flat_version,
				'deps' => array(
					'jquery',
					'jquery-ui-core',
					self::PREFIX . 'react-dependencies',
				),
			),
			array(
				'name' => 'network-admin-script',
				'src'  => 'wp-seo-network-admin-' . $flat_version,
				'deps' => array( 'jquery' ),
			),
			array(
				'name' => 'bulk-editor',
				'src'  => 'wp-seo-bulk-editor-' . $flat_version,
				'deps' => array(
					'jquery',
					self::PREFIX . 'react-dependencies',
				),
			),
			array(
				'name' => 'admin-global-script',
				'src'  => 'wp-seo-admin-global-' . $flat_version,
				'deps' => array(
					'jquery',
					self::PREFIX . 'react-dependencies',
				),
			),
			array(
				'name'      => 'metabox',
				'src'       => 'wp-seo-metabox-' . $flat_version,
				'deps'      => array(
					'jquery',
					self::PREFIX . 'select2',
					self::PREFIX . 'select2-translations',
					self::PREFIX . 'wp-globals-backport',
				),
				'in_footer' => false,
			),
			array(
				'name' => 'featured-image',
				'src'  => 'wp-seo-featured-image-' . $flat_version,
				'deps' => array(
					'jquery',
					self::PREFIX . 'react-dependencies',
				),
			),
			array(
				'name'      => 'admin-gsc',
				'src'       => 'wp-seo-admin-gsc-' . $flat_version,
				'deps'      => array(
					self::PREFIX . 'react-dependencies',
				),
				'in_footer' => false,
			),
			array(
				'name' => 'post-scraper',
				'src'  => 'wp-seo-post-scraper-' . $flat_version,
				'deps' => array(
					self::PREFIX . 'replacevar-plugin',
					self::PREFIX . 'shortcode-plugin',
					'wp-util',
					'wp-api',
					self::PREFIX . 'wp-globals-backport',
					self::PREFIX . 'analysis',
					self::PREFIX . 'react-dependencies',
					self::PREFIX . 'components',
				),
			),
			array(
				'name' => 'term-scraper',
				'src'  => 'wp-seo-term-scraper-' . $flat_version,
				'deps' => array(
					self::PREFIX . 'replacevar-plugin',
					self::PREFIX . 'wp-globals-backport',
					self::PREFIX . 'analysis',
					self::PREFIX . 'components',
				),
			),
			array(
				'name' => 'replacevar-plugin',
				'src'  => 'wp-seo-replacevar-plugin-' . $flat_version,
				'deps' => array(
					self::PREFIX . 'react-dependencies',
					self::PREFIX . 'analysis',
					self::PREFIX . 'components',
				),
			),
			array(
				'name' => 'shortcode-plugin',
				'src'  => 'wp-seo-shortcode-plugin-' . $flat_version,
				'deps' => array(
					self::PREFIX . 'react-dependencies',
					self::PREFIX . 'analysis',
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
					self::PREFIX . 'react-dependencies',
				),
			),
			array(
				'name' => 'primary-category',
				'src'  => 'wp-seo-metabox-category-' . $flat_version,
				'deps' => array(
					'jquery',
					'wp-util',
					self::PREFIX . 'react-dependencies',
					self::PREFIX . 'wp-globals-backport',
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
					self::PREFIX . 'wp-globals-backport',
					self::PREFIX . 'components',
				),
			),
			array(
				'name' => 'reindex-links',
				'src'  => 'wp-seo-reindex-links-' . $flat_version,
				'deps' => array(
					'jquery',
					'jquery-ui-core',
					'jquery-ui-progressbar',
					self::PREFIX . 'react-dependencies',
				),
			),
			array(
				'name' => 'edit-page-script',
				'src'  => 'wp-seo-edit-page-' . $flat_version,
				'deps' => array(
					'jquery',
					self::PREFIX . 'react-dependencies',
				),
			),
			array(
				'name'      => 'quick-edit-handler',
				'src'       => 'wp-seo-quick-edit-handler-' . $flat_version,
				'deps'      => array(
					'jquery',
					self::PREFIX . 'react-dependencies',
				),
				'in_footer' => true,
			),
			array(
				'name' => 'api',
				'src'  => 'wp-seo-api-' . $flat_version,
				'deps' => array(
					'wp-api',
					'jquery',
					self::PREFIX . 'react-dependencies',
				),
			),
			array(
				'name' => 'dashboard-widget',
				'src'  => 'wp-seo-dashboard-widget-' . $flat_version,
				'deps' => array(
					self::PREFIX . 'api',
					'jquery',
					self::PREFIX . 'wp-globals-backport',
					self::PREFIX . 'components',
				),
			),
			array(
				'name' => 'filter-explanation',
				'src'  => 'wp-seo-filter-explanation-' . $flat_version,
				'deps' => array(
					'jquery',
					self::PREFIX . 'react-dependencies',
				),
			),
			array(
				'name' => 'analysis',
				'src'  => 'analysis-' . $flat_version,
			),
			array(
				'name' => 'components',
				'src'  => 'components-' . $flat_version,
				'deps' => array( self::PREFIX . 'analysis' ),
			),
			array(
				'name' => 'structured-data-blocks',
				'src'  => 'wp-seo-structured-data-blocks-' . $flat_version,
				'deps' => array( 'wp-blocks', 'wp-i18n', 'wp-element' ),
			),
			array(
				'name' => 'babel-polyfill',
				'src'  => 'babel-polyfill-' . $flat_version,
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
	 * Checks if the Gutenberg assets must be loaded.
	 *
	 * @return bool True when the Gutenberg assets must be loaded.
	 */
	protected function should_load_gutenberg_assets() {

		// When working in the classic editor shipped with Gutenberg, the assets shouldn't be loaded. Fixes IE11 bug.
		if ( isset( $_GET['classic-editor'] ) ) {
			return false;
		}

		return wp_script_is( 'wp-element', 'registered' );
	}
}

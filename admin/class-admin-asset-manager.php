<?php
/**
 * WPSEO plugin file.
 *
 * @package WPSEO\Admin
 */

/**
 * This class registers all the necessary styles and scripts.
 *
 * Also has methods for the enqueing of scripts and styles.
 * It automatically adds a prefix to the handle.
 */
class WPSEO_Admin_Asset_Manager {

	/**
	 * Prefix for naming the assets.
	 *
	 * @var string
	 */
	const PREFIX = 'yoast-seo-';

	/**
	 * Class that manages the assets' location.
	 *
	 * @var WPSEO_Admin_Asset_Location
	 */
	protected $asset_location;

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
		$url = $script->get_src() ? $this->get_url( $script, WPSEO_Admin_Asset::TYPE_JS ) : false;

		wp_register_script(
			$this->prefix . $script->get_name(),
			$url,
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
	 * Localizes the script.
	 *
	 * @param string $handle      The script handle.
	 * @param string $object_name The object name.
	 * @param array  $data        The l10n data.
	 */
	public function localize_script( $handle, $object_name, $data ) {
		\wp_localize_script( $this->prefix . $handle, $object_name, $data );
	}

	/**
	 * A list of styles that shouldn't be registered but are needed in other locations in the plugin.
	 *
	 * @return array
	 */
	public function special_styles() {
		$flat_version = $this->flatten_version( WPSEO_VERSION );
		$asset_args   = [
			'name' => 'inside-editor',
			'src'  => 'inside-editor-' . $flat_version,
		];

		return [ 'inside-editor' => new WPSEO_Admin_Asset( $asset_args ) ];
	}

	/**
	 * Flattens a version number for use in a filename.
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
	 * Checks if the given script is enqueued.
	 *
	 * @param string $script The script to check.
	 *
	 * @return bool True when the script is enqueued.
	 */
	public function is_script_enqueued( $script ) {
		return \wp_script_is( $this->prefix . $script );
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
		$user_locale      = \get_user_locale();
		$language         = WPSEO_Language_Utils::get_language( $user_locale );

		if ( file_exists( WPSEO_PATH . "js/dist/select2/i18n/{$user_locale}.js" ) ) {
			$select2_language = $user_locale; // Chinese and some others use full locale.
		}
		elseif ( file_exists( WPSEO_PATH . "js/dist/select2/i18n/{$language}.js" ) ) {
			$select2_language = $language;
		}

		$flat_version = $this->flatten_version( WPSEO_VERSION );

		return [
			[
				'name'      => 'commons',
				// Load webpack-commons for bundle support.
				'src'       => 'commons-' . $flat_version,
				'in_footer' => false,
				'deps'      => [
					'lodash',
					'wp-polyfill',
				],
			],
			[
				'name' => 'schema-blocks',
				'src'  => 'schema-blocks-' . $flat_version,
				'deps' => [
					self::PREFIX . 'schema-blocks-package',
				],
			],
			[
				'name' => 'yoast-modal',
				'src'  => 'modal-' . $flat_version,
				'deps' => [
					'jquery',
					'wp-element',
					'wp-i18n',
					self::PREFIX . 'yoast-components',
					self::PREFIX . 'commons',
				],
			],
			[
				'name' => 'settings',
				'src'  => 'settings-' . $flat_version,
				'deps' => [
					'lodash',
					'jquery',
					'jquery-ui-core',
					'jquery-ui-progressbar',
					'wp-api',
					self::PREFIX . 'yoast-components',
					self::PREFIX . 'helpers',
					self::PREFIX . 'replacement-variable-editor',
					self::PREFIX . 'redux',
					self::PREFIX . 'select2',
					self::PREFIX . 'select2-translations',
					self::PREFIX . 'commons',
				],
			],
			[
				'name' => 'network-admin-script',
				'src'  => 'network-admin-' . $flat_version,
				'deps' => [
					'jquery',
					'wp-element',
					'wp-i18n',
					self::PREFIX . 'commons',
				],
			],
			[
				'name' => 'bulk-editor',
				'src'  => 'bulk-editor-' . $flat_version,
				'deps' => [
					'jquery',
					self::PREFIX . 'commons',
				],
			],
			[
				'name'      => 'admin-global-script',
				'src'       => 'admin-global-' . $flat_version,
				'deps'      => [
					'jquery',
					self::PREFIX . 'commons',
				],
				'in_footer' => false,
			],
			[
				'name'      => 'block-editor',
				'src'       => 'block-editor-' . $flat_version,
				'deps'      => [
					'lodash',
					'wp-annotations',
					'wp-blocks',
					'wp-components',
					'wp-compose',
					'wp-data',
					'wp-edit-post',
					'wp-element',
					'wp-i18n',
					'wp-plugins',
					'wp-rich-text',
					self::PREFIX . 'yoast-components',
					self::PREFIX . 'legacy-components',
					self::PREFIX . 'search-metadata-previews',
					self::PREFIX . 'social-metadata-forms',
					self::PREFIX . 'analysis',
				],
				'in_footer' => false,
			],
			[
				'name'      => 'classic-editor',
				'src'       => 'classic-editor-' . $flat_version,
				'deps'      => [
					'lodash',
					'wp-api-fetch',
					'wp-components',
					'wp-compose',
					'wp-element',
					self::PREFIX . 'redux',
					self::PREFIX . 'yoast-components',
					self::PREFIX . 'legacy-components',
					self::PREFIX . 'search-metadata-previews',
					self::PREFIX . 'social-metadata-forms',
					self::PREFIX . 'analysis',
					self::PREFIX . 'helpers',
				],
				'in_footer' => false,
			],
			[
				'name'      => 'post-edit',
				'src'       => 'post-edit-' . $flat_version,
				'deps'      => [
					'jquery',
					'lodash',
					'wp-api',
					'wp-api-fetch',
					'wp-data',
					'wp-i18n',
					'wp-is-shallow-equal',
					'wp-sanitize',
					'wp-url',
					'wp-util',
					self::PREFIX . 'analysis',
					self::PREFIX . 'block-editor',
					self::PREFIX . 'commons',
					self::PREFIX . 'redux',
					self::PREFIX . 'draft-js',
					self::PREFIX . 'jed',
					self::PREFIX . 'style-guide',
					self::PREFIX . 'feature-flag',
					self::PREFIX . 'replacement-variable-editor',
					self::PREFIX . 'search-metadata-previews',
					self::PREFIX . 'select2',
					self::PREFIX . 'select2-translations',
				],
				'in_footer' => false,
			],
			[
				'name'      => 'post-edit-classic',
				'src'       => 'post-edit-' . $flat_version,
				'deps'      => [
					'jquery',
					'lodash',
					'wp-api',
					'wp-api-fetch',
					'wp-data',
					'wp-i18n',
					'wp-is-shallow-equal',
					'wp-sanitize',
					'wp-url',
					'wp-util',
					self::PREFIX . 'analysis',
					self::PREFIX . 'classic-editor',
					self::PREFIX . 'commons',
					self::PREFIX . 'draft-js',
					self::PREFIX . 'jed',
					self::PREFIX . 'style-guide',
					self::PREFIX . 'replacement-variable-editor',
					self::PREFIX . 'search-metadata-previews',
					self::PREFIX . 'redux',
					self::PREFIX . 'select2',
					self::PREFIX . 'select2-translations',
				],
				'in_footer' => false,
			],
			[
				'name' => 'term-edit',
				'src'  => 'term-edit-' . $flat_version,
				'deps' => [
					'jquery',
					'lodash',
					'wp-sanitize',
					'wp-element',
					'wp-i18n',
					'wp-data',
					'wp-api-fetch',
					'wp-components',
					'wp-compose',
					'wp-is-shallow-equal',
					self::PREFIX . 'redux',
					self::PREFIX . 'draft-js',
					self::PREFIX . 'jed',
					self::PREFIX . 'style-guide',
					self::PREFIX . 'feature-flag',
					self::PREFIX . 'analysis',
					self::PREFIX . 'classic-editor',
					self::PREFIX . 'commons',
					self::PREFIX . 'yoast-components',
					self::PREFIX . 'legacy-components',
					self::PREFIX . 'replacement-variable-editor',
					self::PREFIX . 'search-metadata-previews',
					self::PREFIX . 'social-metadata-forms',
					self::PREFIX . 'select2',
					self::PREFIX . 'select2-translations',
				],
			],
			[
				'name'    => 'select2',
				'src'     => 'select2/select2.full',
				'suffix'  => '.min',
				'deps'    => [
					'jquery',
				],
				'version' => '4.0.3',
			],
			[
				'name'    => 'select2-translations',
				'src'     => 'select2/i18n/' . $select2_language,
				'deps'    => [
					'jquery',
					self::PREFIX . 'select2',
				],
				'version' => '4.0.3',
			],
			[
				'name' => 'configuration-wizard',
				'src'  => 'configuration-wizard-' . $flat_version,
				'deps' => [
					'jquery',
					'wp-element',
					'wp-i18n',
					'wp-api',
					self::PREFIX . 'helpers',
					self::PREFIX . 'legacy-components',
					self::PREFIX . 'commons',
					self::PREFIX . 'configuration-wizard-package',
				],
			],
			[
				'name' => 'configuration-wizard-package',
				'src'  => 'yoast/configuration-wizard-' . $flat_version,
				'deps' => [
					'jquery',
					'lodash',
					'wp-element',
					'wp-i18n',
					'wp-api',
					self::PREFIX . 'helpers',
					self::PREFIX . 'style-guide',
					self::PREFIX . 'yoast-components',
					self::PREFIX . 'commons',
				],
			],
			[
				'name' => 'schema-blocks-package',
				'src'  => 'yoast/schema-blocks-' . $flat_version,
				'deps' => [
					'lodash',
					'moment',
					'wp-element',
					'wp-blocks',
					'wp-block-editor',
					'wp-data',
					'wp-hooks',
					'wp-components',
					'wp-i18n',
					'wp-editor',
				],
			],
			[
				'name' => 'reindex-links',
				'src'  => 'reindex-links-' . $flat_version,
				'deps' => [
					'jquery',
					'jquery-ui-core',
					'jquery-ui-progressbar',
					self::PREFIX . 'commons',
				],
			],
			[
				'name' => 'indexation',
				'src'  => 'indexation-' . $flat_version,
				'deps' => [
					'jquery',
					'jquery-ui-core',
					'jquery-ui-progressbar',
					self::PREFIX . 'admin-global-script',
					self::PREFIX . 'commons',
					self::PREFIX . 'style-guide',
					self::PREFIX . 'yoast-components',
				],
			],
			[
				'name' => 'edit-page-script',
				'src'  => 'edit-page-' . $flat_version,
				'deps' => [
					'jquery',
					self::PREFIX . 'commons',
				],
			],
			[
				'name'      => 'quick-edit-handler',
				'src'       => 'quick-edit-handler-' . $flat_version,
				'deps'      => [
					'jquery',
					self::PREFIX . 'commons',
				],
				'in_footer' => true,
			],
			[
				'name' => 'api',
				'src'  => 'api-client-' . $flat_version,
				'deps' => [
					'wp-api',
					'jquery',
					self::PREFIX . 'commons',
				],
			],
			[
				'name' => 'dashboard-widget',
				'src'  => 'dashboard-widget-' . $flat_version,
				'deps' => [
					self::PREFIX . 'api',
					'jquery',
					'wp-element',
					'wp-i18n',
					self::PREFIX . 'helpers',
					self::PREFIX . 'yoast-components',
					self::PREFIX . 'style-guide',
					self::PREFIX . 'analysis-report',
					self::PREFIX . 'commons',
				],
			],
			[
				'name' => 'filter-explanation',
				'src'  => 'filter-explanation-' . $flat_version,
				'deps' => [
					'jquery',
					self::PREFIX . 'commons',
				],
			],
			[
				'name' => 'analysis',
				'src'  => 'analysis-' . $flat_version,
				'deps' => [
					'lodash',
					'wp-autop',
					self::PREFIX . 'feature-flag',
					self::PREFIX . 'jed',
					self::PREFIX . 'commons',
				],
			],
			[
				/**
				 * Asset for backwards-compatibility, to make sure
				 * the addons don't break when we change dependencies.
				 */
				'name' => 'components',
				'src'  => false,
				'deps' => [
					self::PREFIX . 'feature-flag',
					self::PREFIX . 'helpers',
					self::PREFIX . 'style-guide',
					self::PREFIX . 'configuration-wizard-package',
					self::PREFIX . 'analysis-report',
					self::PREFIX . 'yoast-components',
					self::PREFIX . 'replacement-variable-editor',
					self::PREFIX . 'search-metadata-previews',
					self::PREFIX . 'social-metadata-forms',
					self::PREFIX . 'legacy-components',
				],
			],
			[
				/**
				 * Asset exposing Yoast editor modules which are used in Yoast add-ons.
				 */
				'name' => 'editor-modules',
				'src'  => 'editor-modules-' . $flat_version,
				'deps' => [
					'lodash',
					'wp-compose',
					'wp-data',
					'wp-element',
					'wp-i18n',
					self::PREFIX . 'analysis',
					self::PREFIX . 'analysis-report',
					self::PREFIX . 'helpers',
					self::PREFIX . 'legacy-components',
					self::PREFIX . 'style-guide',
					self::PREFIX . 'styled-components',
					self::PREFIX . 'yoast-components',
				],
			],
			[
				/**
				 * Yoast dynamic blocks
				 */
				'name' => 'dynamic-blocks',
				'src'  => 'dynamic-blocks-' . $flat_version,
				'deps' => [
					'wp-blocks',
					'wp-i18n',
					'wp-server-side-render',
				],
			],
			[
				// The `@yoast/components` package.
				'name' => 'yoast-components',
				'src'  => 'yoast/components-' . $flat_version,
				'deps' => [
					'lodash',
					'wp-a11y',
					'wp-i18n',
					self::PREFIX . 'helpers',
					self::PREFIX . 'style-guide',
					self::PREFIX . 'styled-components',
					self::PREFIX . 'commons',
				],
			],
			[
				// The `yoast-components` package.
				'name' => 'legacy-components',
				'src'  => 'yoast/yoast-components-' . $flat_version,
				'deps' => [
					'lodash',
					'wp-a11y',
					'wp-i18n',
					'wp-dom-ready',
					self::PREFIX . 'style-guide',
					self::PREFIX . 'helpers',
					self::PREFIX . 'yoast-components',
					self::PREFIX . 'analysis-report',
					self::PREFIX . 'search-metadata-previews',
					self::PREFIX . 'replacement-variable-editor',
					self::PREFIX . 'jed',
					self::PREFIX . 'redux',
					self::PREFIX . 'styled-components',
					self::PREFIX . 'draft-js',
					self::PREFIX . 'commons',
				],
			],
			[
				'name' => 'structured-data-blocks',
				'src'  => 'structured-data-blocks-' . $flat_version,
				'deps' => [
					'wp-blocks',
					'wp-i18n',
					'wp-element',
					'wp-is-shallow-equal',
					self::PREFIX . 'styled-components',
					self::PREFIX . 'commons',
				],
			],
			[
				'name' => 'helpers',
				'src'  => 'yoast/helpers-' . $flat_version,
				'deps' => [
					self::PREFIX . 'styled-components',
					self::PREFIX . 'commons',
				],
			],
			[
				'name' => 'feature-flag',
				'src'  => 'yoast/feature-flag-' . $flat_version,
				'deps' => [
					self::PREFIX . 'commons',
				],
			],
			[
				'name' => 'analysis-report',
				'src'  => 'yoast/analysis-report-' . $flat_version,
				'deps' => [
					'wp-i18n',
					'react',
					'react-dom',
					'lodash',
					self::PREFIX . 'styled-components',
					self::PREFIX . 'helpers',
					self::PREFIX . 'style-guide',
					self::PREFIX . 'yoast-components',
					self::PREFIX . 'commons',
				],
			],
			[
				'name' => 'style-guide',
				'src'  => 'yoast/style-guide-' . $flat_version,
				'deps' => [
					self::PREFIX . 'helpers',
					self::PREFIX . 'styled-components',
					self::PREFIX . 'commons',
				],
			],
			[
				'name' => 'replacement-variable-editor',
				'src'  => 'yoast/replacement-variable-editor-' . $flat_version,
				'deps' => [
					'lodash',
					'wp-a11y',
					'wp-i18n',
					self::PREFIX . 'helpers',
					self::PREFIX . 'yoast-components',
					self::PREFIX . 'style-guide',
					self::PREFIX . 'styled-components',
					self::PREFIX . 'draft-js',
					self::PREFIX . 'commons',
				],
			],
			[
				'name' => 'search-metadata-previews',
				'src'  => 'yoast/search-metadata-previews-' . $flat_version,
				'deps' => [
					'lodash',
					'wp-a11y',
					'wp-i18n',
					self::PREFIX . 'helpers',
					self::PREFIX . 'style-guide',
					self::PREFIX . 'yoast-components',
					self::PREFIX . 'analysis',
					self::PREFIX . 'replacement-variable-editor',
					self::PREFIX . 'draft-js',
					self::PREFIX . 'commons',
				],
			],
			[
				'name' => 'social-metadata-forms',
				'src'  => 'yoast/social-metadata-forms-' . $flat_version,
				'deps' => [
					'lodash',
					'wp-i18n',
					self::PREFIX . 'redux',
					self::PREFIX . 'yoast-components',
					self::PREFIX . 'replacement-variable-editor',
					self::PREFIX . 'style-guide',
					self::PREFIX . 'styled-components',
					self::PREFIX . 'commons',
				],
			],
			[
				'name' => 'styled-components',
				'src'  => 'styled-components-' . $flat_version,
				'deps' => [
					'wp-element',
				],
			],
			[
				'name' => 'redux',
				'src'  => 'redux-' . $flat_version,
			],
			[
				'name' => 'jed',
				'src'  => 'jed-' . $flat_version,
			],
			[
				'name'      => 'help-scout-beacon',
				'src'       => 'help-scout-beacon-' . $flat_version,
				'in_footer' => false,
				'deps'      => [
					self::PREFIX . 'styled-components',
					'wp-element',
					'wp-i18n',
				],
			],
			[
				'name' => 'draft-js',
				'src'  => 'draft-js-' . $flat_version,
			],
			[
				'name'   => 'elementor',
				'src'    => 'elementor-' . $flat_version,
				'deps'   => [
					'jquery',
					'lodash',
					'wp-data',
					'wp-element',
					'wp-components',
					'wp-compose',
					'wp-i18n',
					'wp-sanitize',
					'wp-api-fetch',
					'wp-hooks',
					self::PREFIX . 'components',
					self::PREFIX . 'analysis',
					self::PREFIX . 'commons',
					self::PREFIX . 'redux',
					self::PREFIX . 'select2',
					self::PREFIX . 'select2-translations',
				],
				'footer' => true,
			],
		];
	}

	/**
	 * Returns the styles that need to be registered.
	 *
	 * @todo Data format is not self-documenting. Needs explanation inline. R.
	 *
	 * @return array Styles that need to be registered.
	 */
	protected function styles_to_be_registered() {
		$flat_version = $this->flatten_version( WPSEO_VERSION );

		return [
			[
				'name' => 'admin-css',
				'src'  => 'yst_plugin_tools-' . $flat_version,
				'deps' => [ self::PREFIX . 'toggle-switch' ],
			],
			[
				'name' => 'toggle-switch',
				'src'  => 'toggle-switch-' . $flat_version,
			],
			[
				'name' => 'dismissible',
				'src'  => 'wpseo-dismissible-' . $flat_version,
			],
			[
				'name' => 'notifications',
				'src'  => 'notifications-' . $flat_version,
			],
			[
				'name' => 'alert',
				'src'  => 'alerts-' . $flat_version,
			],
			[
				'name' => 'edit-page',
				'src'  => 'edit-page-' . $flat_version,
			],
			[
				'name' => 'featured-image',
				'src'  => 'featured-image-' . $flat_version,
			],
			[
				'name' => 'metabox-css',
				'src'  => 'metabox-' . $flat_version,
				'deps' => [
					self::PREFIX . 'select2',
					self::PREFIX . 'admin-css',
					'wp-components',
				],
			],
			[
				'name' => 'wp-dashboard',
				'src'  => 'dashboard-' . $flat_version,
			],
			[
				'name' => 'scoring',
				'src'  => 'yst_seo_score-' . $flat_version,
			],
			[
				'name' => 'adminbar',
				'src'  => 'adminbar-' . $flat_version,
				'deps' => [
					'admin-bar',
				],
			],
			[
				'name' => 'primary-category',
				'src'  => 'metabox-primary-category-' . $flat_version,
			],
			[
				'name'    => 'select2',
				'src'     => 'select2/select2',
				'suffix'  => '.min',
				'version' => '4.0.1',
				'rtl'     => false,
			],
			[
				'name' => 'admin-global',
				'src'  => 'admin-global-' . $flat_version,
			],
			[
				'name' => 'yoast-components',
				'src'  => 'yoast-components-' . $flat_version,
			],
			[
				'name' => 'extensions',
				'src'  => 'yoast-extensions-' . $flat_version,
			],
			[
				'name' => 'filter-explanation',
				'src'  => 'filter-explanation-' . $flat_version,
			],
			[
				'name' => 'search-appearance',
				'src'  => 'search-appearance-' . $flat_version,
				'deps' => [
					self::PREFIX . 'monorepo',
				],
			],
			[
				'name' => 'monorepo',
				'src'  => 'monorepo-' . $flat_version,
			],
			[
				'name' => 'structured-data-blocks',
				'src'  => 'structured-data-blocks-' . $flat_version,
				'deps' => [ 'wp-edit-blocks' ],
			],
			[
				'name' => 'schema-blocks',
				'src'  => 'schema-blocks-' . $flat_version,
			],
			[
				'name' => 'elementor',
				'src'  => 'elementor-' . $flat_version,
			],
		];
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
		if ( in_array( $scheme, [ 'http', 'https' ], true ) ) {
			return $asset->get_src();
		}

		return $this->asset_location->get_url( $asset, $type );
	}

	/* ********************* DEPRECATED METHODS ********************* */

	/**
	 * This function is needed for backwards compatibility with Local SEO 12.5.
	 *
	 * @deprecated 12.8
	 * @codeCoverageIgnore
	 *
	 * @return void
	 */
	public function register_wp_assets() {
	}
}

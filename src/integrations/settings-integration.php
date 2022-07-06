<?php

namespace Yoast\WP\SEO\Integrations;

use WPSEO_Admin_Asset_Manager;
use WPSEO_Option_Titles;
use WPSEO_Options;
use Yoast\WP\SEO\Conditionals\Settings_Conditional;
use Yoast\WP\SEO\Helpers\Options_Helper;

/**
 * Class Settings_Integration.
 */
class Settings_Integration implements Integration_Interface {

	/**
	 * Holds the included WordPress options.
	 *
	 * @var string[]
	 */
	const WP_OPTIONS = [ 'blogname', 'blogdescription' ];

	/**
	 * Holds the WPSEO_Admin_Asset_Manager.
	 *
	 * @var WPSEO_Admin_Asset_Manager
	 */
	protected $asset_manager;

	/**
	 * Constructs Settings_Integration.
	 *
	 * @param WPSEO_Admin_Asset_Manager $asset_manager The WPSEO_Admin_Asset_Manager.
	 */
	public function __construct( WPSEO_Admin_Asset_Manager $asset_manager, Options_Helper $options_helper ) {
		$this->asset_manager = $asset_manager;
	}

	/**
	 * Returns the conditionals based on which this loadable should be active.
	 *
	 * @return array
	 */
	public static function get_conditionals() {
		return [ Settings_Conditional::class ];
	}

	/**
	 * Initializes the integration.
	 *
	 * This is the place to register hooks and filters.
	 *
	 * @return void
	 */
	public function register_hooks() {
		\add_filter( 'wpseo_submenu_pages', [ $this, 'add_page' ] );
		\add_action( 'admin_enqueue_scripts', [ $this, 'enqueue_assets' ] );
		\add_action( 'admin_init', [ $this, 'register_setting' ] );
	}

	/**
	 * Registers the different options under the setting.
	 *
	 * @return void
	 */
	public function register_setting() {
		foreach ( WPSEO_Options::$options as $name => $instance ) {
			\register_setting( 'wpseo_settings', $name );
		}
		foreach ( self::WP_OPTIONS as $name ) {
			\register_setting( 'wpseo_settings', $name );
		}
	}

	/**
	 * Adds the page.
	 *
	 * @param array $pages The pages.
	 *
	 * @return array The pages.
	 */
	public function add_page( $pages ) {
		\array_unshift(
			$pages,
			[
				'wpseo_dashboard',
				'',
				sprintf(
				// translators: %1$s expands to the opening span tag (styling). %2$s expands to the closing span tag.
					__( 'Settings %1$sBeta%2$s', 'wordpress-seo' ),
					'<span class="yoast-badge yoast-beta-badge">',
					'</span>'
				),
				'wpseo_manage_options',
				'wpseo_settings',
				[ $this, 'display_page' ],
			]
		);

		return $pages;
	}

	/**
	 * Displays the page.
	 */
	public function display_page() {
		echo '<div id="yoast-seo-settings" class="yst--ml-2.5 md:yst--ml-5"></div>';
	}

	/**
	 * Enqueues the assets.
	 *
	 * @return void
	 */
	public function enqueue_assets() {
		wp_enqueue_media();
		$this->asset_manager->enqueue_script( 'new-settings' );
		$this->asset_manager->enqueue_style( 'new-settings' );
		$this->asset_manager->localize_script( 'new-settings', 'wpseoScriptData', $this->get_script_data() );
	}

	/**
	 * Creates the script data.
	 *
	 * @return array The script data.
	 */
	protected function get_script_data() {
		$data = [
			'settings'   => [],
			'endpoint'   => \admin_url( 'options.php' ),
			'nonce'      => \wp_create_nonce( 'wpseo_settings-options' ),
			'separators' => WPSEO_Option_Titles::get_instance()->get_separator_options_for_display(),
		];

		foreach ( WPSEO_Options::$options as $name => $instance ) {
			$data['settings'][ $name ] = WPSEO_Options::get_option( $name );
		}
		foreach ( self::WP_OPTIONS as $name ) {
			$data['settings'][ $name ] = \get_option( $name );
		}

		return $data;
	}
}

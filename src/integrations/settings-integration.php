<?php

namespace Yoast\WP\SEO\Integrations;

use WP_Post_Type;
use WPSEO_Admin_Asset_Manager;
use WPSEO_Admin_Editor_Specific_Replace_Vars;
use WPSEO_Admin_Recommended_Replace_Vars;
use WPSEO_Option_Titles;
use WPSEO_Options;
use WPSEO_Post_Type;
use WPSEO_Replace_Vars;
use Yoast\WP\SEO\Conditionals\Settings_Conditional;
use Yoast\WP\SEO\Config\Schema_Types;
use Yoast\WP\SEO\Helpers\Current_Page_Helper;
use Yoast\WP\SEO\Helpers\Post_Type_Helper;
use Yoast\WP\SEO\Helpers\Product_Helper;

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
	 * Holds the allowed option groups.
	 *
	 * @var array
	 */
	const ALLOWED_OPTION_GROUPS = [ 'wpseo', 'wpseo_titles', 'wpseo_social' ];

	/**
	 * Holds the WPSEO_Admin_Asset_Manager.
	 *
	 * @var WPSEO_Admin_Asset_Manager
	 */
	protected $asset_manager;

	/**
	 * Holds the WPSEO_Replace_Vars.
	 *
	 * @var WPSEO_Replace_Vars
	 */
	protected $replace_vars;

	/**
	 * Holds the Schema_Types.
	 *
	 * @var Schema_Types
	 */
	protected $schema_types;

	/**
	 * Holds the Current_Page_Helper.
	 *
	 * @var Current_Page_Helper
	 */
	protected $current_page_helper;

	/**
	 * Holds the Post_Type_Helper.
	 *
	 * @var Post_Type_Helper
	 */
	protected $post_type_helper;

	/**
	 * Holds the Product_Helper.
	 *
	 * @var Product_Helper
	 */
	protected $product_helper;

	/**
	 * Constructs Settings_Integration.
	 *
	 * @param WPSEO_Admin_Asset_Manager $asset_manager       The WPSEO_Admin_Asset_Manager.
	 * @param Current_Page_Helper       $current_page_helper The Current_Page_Helper.
	 */
	public function __construct(
		WPSEO_Admin_Asset_Manager $asset_manager,
		WPSEO_Replace_Vars $replace_vars,
		Schema_Types $schema_types,
		Current_Page_Helper $current_page_helper,
		Post_Type_Helper $post_type_helper,
		Product_Helper $product_helper
	) {
		$this->asset_manager       = $asset_manager;
		$this->replace_vars        = $replace_vars;
		$this->schema_types        = $schema_types;
		$this->current_page_helper = $current_page_helper;
		$this->post_type_helper    = $post_type_helper;
		$this->product_helper      = $product_helper;
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

		// Check we are either saving the settings or on the settings page before registering.
		$is_saving_settings = false;
		if ( $this->current_page_helper->get_current_admin_page() === 'options.php' ) {
			$post_action = \filter_input( \INPUT_POST, 'action', \FILTER_SANITIZE_STRING );
			$option_page = \filter_input( \INPUT_POST, 'option_page', \FILTER_SANITIZE_STRING );

			$is_saving_settings = $post_action === 'update' && $option_page === 'wpseo_settings';
		}
		if ( $is_saving_settings || $this->current_page_helper->get_current_yoast_seo_page() === 'wpseo_settings' ) {
			\add_action( 'admin_enqueue_scripts', [ $this, 'enqueue_assets' ] );
			\add_action( 'admin_init', [ $this, 'register_setting' ] );
		}
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
				\sprintf(
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
		\wp_enqueue_media();
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
		$settings = $this->get_settings();

		return [
			'settings'             => $settings,
			'disabledSettings'     => $this->get_disabled_settings( $settings ),
			'endpoint'             => \admin_url( 'options.php' ),
			'nonce'                => \wp_create_nonce( 'wpseo_settings-options' ),
			'users'                => \get_users( [ 'fields' => [ 'ID', 'display_name' ] ] ),
			'userEditUrl'          => \admin_url( 'user-edit.php' ),
			'separators'           => WPSEO_Option_Titles::get_instance()->get_separator_options_for_display(),
			'replacementVariables' => $this->get_replacement_variables(),
			'schema'               => [
				'pageTypeOptions'    => $this->schema_types->get_page_type_options(),
				'articleTypeOptions' => $this->schema_types->get_article_type_options(),
			],
			'preferences'          => [
				'isPremium'      => $this->product_helper->is_premium(),
				'isNetworkAdmin' => \is_network_admin(),
				'isMainSite'     => \is_main_site(),
			],
			'postTypes'            => $this->get_post_types(),
		];
	}

	/**
	 * Retrieves the settings and their values.
	 *
	 * @return array The settings.
	 */
	protected function get_settings() {
		$settings = [];

		// Add Yoast settings.
		foreach ( WPSEO_Options::$options as $option_name => $instance ) {
			if ( \in_array( $option_name, self::ALLOWED_OPTION_GROUPS ) ) {
				$settings[ $option_name ] = WPSEO_Options::get_option( $option_name );
			}
		}
		// Add WP settings.
		foreach ( self::WP_OPTIONS as $option_name ) {
			$settings[ $option_name ] = \get_option( $option_name );
		}

		return $settings;
	}

	/**
	 * Retrieves the settings and their values.
	 *
	 * @return array The settings.
	 */
	protected function get_disabled_settings( $settings ) {
		$disabled_settings = [];

		foreach ( WPSEO_Options::$options as $option_name => $instance ) {
			if ( ! \in_array( $option_name, self::ALLOWED_OPTION_GROUPS ) ) {
				continue;
			}

			$disabled_settings[ $option_name ] = [];
			$option_instance                   = WPSEO_Options::get_option_instance( $option_name );
			if ( $option_instance === false ) {
				continue;
			}
			foreach ( $settings[ $option_name ] as $setting_name => $setting_value ) {
				if ( $option_instance->is_disabled( $setting_name ) ) {
					$disabled_settings[ $option_name ][ $setting_name ] = true;
				}
			}
		}

		return $disabled_settings;
	}

	/**
	 * Retrieves the replacement variables.
	 *
	 * @return array The replacement variables.
	 */
	protected function get_replacement_variables() {
		$recommended_replace_vars = new WPSEO_Admin_Recommended_Replace_Vars();
		$specific_replace_vars    = new WPSEO_Admin_Editor_Specific_Replace_Vars();
		$replacement_variables    = $this->replace_vars->get_replacement_variables_with_labels();

		return [
			'variables'   => $replacement_variables,
			'recommended' => $recommended_replace_vars->get_recommended_replacevars(),
			'specific'    => $specific_replace_vars->get(),
			'shared'      => $specific_replace_vars->get_generic( $replacement_variables ),
		];
	}

	/**
	 * Creates the post types to represent.
	 *
	 * @return array The post types.
	 */
	protected function get_post_types() {
		$post_types = $this->post_type_helper->get_public_post_types( 'objects' );
		$post_types = WPSEO_Post_Type::filter_attachment_post_type( $post_types );

		return \array_map(
			static function ( WP_Post_Type $post_type ) {
				$route = $post_type->name;
				if ( $post_type->rewrite ) {
					$route = $post_type->rewrite['slug'];
				}
				if ( $post_type->rest_base ) {
					$route = $post_type->rest_base;
				}

				return [
					'name'          => $post_type->name,
					'route'         => $route,
					'label'         => $post_type->label,
					'singularLabel' => $post_type->labels->singular_name,
				];
			},
			$post_types
		);
	}
}

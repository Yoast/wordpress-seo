<?php

namespace Yoast\WP\SEO\General\User_Interface;

use WPSEO_Addon_Manager;
use WPSEO_Admin_Asset_Manager;
use Yoast\WP\SEO\Conditionals\Admin\Non_Network_Admin_Conditional;
use Yoast\WP\SEO\Conditionals\Admin_Conditional;
use Yoast\WP\SEO\Helpers\Current_Page_Helper;
use Yoast\WP\SEO\Helpers\Product_Helper;
use Yoast\WP\SEO\Helpers\Short_Link_Helper;
use Yoast\WP\SEO\Integrations\Integration_Interface;

/**
 * Adds the plans page to the Yoast admin menu.
 */
class Plans_Page_Integration implements Integration_Interface {

	/**
	 * The page name.
	 */
	public const PAGE = 'wpseo_plans';

	/**
	 * The assets name.
	 */
	public const ASSETS_NAME = 'plans';

	/**
	 * Holds the WPSEO_Admin_Asset_Manager.
	 *
	 * @var WPSEO_Admin_Asset_Manager
	 */
	private $asset_manager;

	/**
	 * Holds the Current_Page_Helper.
	 *
	 * @var Current_Page_Helper
	 */
	private $current_page_helper;

	/**
	 * Holds the Short_Link_Helper.
	 *
	 * @var Short_Link_Helper
	 */
	private $short_link_helper;

	/**
	 * Holds the WPSEO_Addon_Manager.
	 *
	 * @var WPSEO_Addon_Manager
	 */
	private $addon_manager;

	/**
	 * Holds the Product_Helper.
	 *
	 * @var Product_Helper
	 */
	private $product_helper;

	/**
	 * Constructs the instance.
	 *
	 * @param WPSEO_Admin_Asset_Manager $asset_manager       The WPSEO_Admin_Asset_Manager.
	 * @param Current_Page_Helper       $current_page_helper The Current_Page_Helper.
	 * @param Short_Link_Helper         $short_link_helper   The Short_Link_Helper.
	 * @param Product_Helper            $product_helper      The Product_Helper.
	 */
	public function __construct(
		WPSEO_Admin_Asset_Manager $asset_manager,
		Current_Page_Helper $current_page_helper,
		Short_Link_Helper $short_link_helper,
		WPSEO_Addon_Manager $addon_manager,
		Product_Helper $product_helper
	) {
		$this->asset_manager       = $asset_manager;
		$this->current_page_helper = $current_page_helper;
		$this->short_link_helper   = $short_link_helper;
		$this->addon_manager       = $addon_manager;
		$this->product_helper      = $product_helper;
	}

	/**
	 * Returns the conditionals based on which this loadable should be active.
	 *
	 * @return array<string>
	 */
	public static function get_conditionals() {
		return [ Admin_Conditional::class, Non_Network_Admin_Conditional::class ];
	}

	/**
	 * Initializes the integration.
	 *
	 * This is the place to register hooks and filters.
	 *
	 * @return void
	 */
	public function register_hooks() {
		// Add page with priority 7 to add it above the workouts.
		\add_filter( 'wpseo_submenu_pages', [ $this, 'add_page' ], 7 );

		// Are we on our page?
		if ( $this->current_page_helper->get_current_yoast_seo_page() === self::PAGE ) {
			\add_action( 'admin_enqueue_scripts', [ $this, 'enqueue_assets' ] );
			\add_action( 'in_admin_header', [ $this, 'remove_notices' ], \PHP_INT_MAX );
		}
	}

	/**
	 * Adds the page to the (currently) last position in the array.
	 *
	 * @param array<string, array<string, array>> $pages The pages.
	 *
	 * @return array<string, array<string, array>> The pages.
	 */
	public function add_page( $pages ) {
		$pages[] = [
			self::PAGE,
			'',
			\__( 'Plans', 'wordpress-seo' ),
			'wpseo_manage_options',
			self::PAGE,
			[ $this, 'display_page' ],
		];

		return $pages;
	}

	/**
	 * Displays the page.
	 *
	 * @return void
	 */
	public function display_page() {
		echo '<div id="yoast-seo-plans"></div>';
	}

	/**
	 * Enqueues the assets.
	 *
	 * @return void
	 */
	public function enqueue_assets() {
		// Remove the emoji script as it is incompatible with both React and any contenteditable fields.
		\remove_action( 'admin_print_scripts', 'print_emoji_detection_script' );
		$this->asset_manager->enqueue_script( self::ASSETS_NAME );
		$this->asset_manager->enqueue_style( self::ASSETS_NAME );
		$this->asset_manager->localize_script( self::ASSETS_NAME, 'wpseoScriptData', $this->get_script_data() );
	}

	/**
	 * Creates the script data.
	 *
	 * @return array The script data.
	 */
	private function get_script_data(): array {
		return [
			'addOns'      => [
				'premium' => [
					'id'           => 'premium',
					'isActive'     => $this->addon_manager->is_installed( WPSEO_Addon_Manager::PREMIUM_SLUG ),
					'hasLicense'   => $this->addon_manager->has_valid_subscription( WPSEO_Addon_Manager::PREMIUM_SLUG ),
					'upsellConfig' => [
						'action' => 'load-nfd-ctb',
						'ctbId'  => 'f6a84663-465f-4cb5-8ba5-f7a6d72224b2',
					],
				],
				'woo'     => [
					'id'           => 'woo',
					'isActive'     => $this->addon_manager->is_installed( WPSEO_Addon_Manager::WOOCOMMERCE_SLUG ),
					'hasLicense'   => $this->addon_manager->has_valid_subscription( WPSEO_Addon_Manager::WOOCOMMERCE_SLUG ),
					'upsellConfig' => [
						'action' => 'load-nfd-woo-ctb',
						'ctbId'  => '5b32250e-e6f0-44ae-ad74-3cefc8e427f9',
					],
				],
			],
			'linkParams'  => $this->short_link_helper->get_query_params(),
			'preferences' => [
				'isRtl' => \is_rtl(),
			],
		];
	}

	/**
	 * Removes all current WP notices.
	 *
	 * @return void
	 */
	public function remove_notices() {
		\remove_all_actions( 'admin_notices' );
		\remove_all_actions( 'user_admin_notices' );
		\remove_all_actions( 'network_admin_notices' );
		\remove_all_actions( 'all_admin_notices' );
	}
}

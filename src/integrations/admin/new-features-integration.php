<?php

namespace Yoast\WP\SEO\Integrations\Admin;

use WPSEO_Admin_Asset_Manager;
use Yoast\WP\SEO\Conditionals\Yoast_Admin_Conditional;
use Yoast\WP\SEO\Helpers\Current_Page_Helper;
use Yoast\WP\SEO\Helpers\Product_Helper;
use Yoast\WP\SEO\Helpers\Short_Link_Helper;
use Yoast\WP\SEO\Integrations\Integration_Interface;

/**
 * This integration can show a modal that highlights the new features.
 */
class New_Features_Integration implements Integration_Interface {
	const SCRIPT_HANDLE = 'new-features';

	/**
	 * Holds the Short_Link_Helper.
	 *
	 * @var Short_Link_Helper
	 */
	private $short_link_helper;

	/**
	 * The admin asset manager.
	 *
	 * @var WPSEO_Admin_Asset_Manager
	 */
	private $admin_asset_manager;

	/**
	 * The product helper.
	 *
	 * @var Product_Helper
	 */
	private $product_helper;

	/**
	 * Holds the current page helper.
	 *
	 * @var Current_Page_Helper
	 */
	private $current_page_helper;

	/**
	 * Returns the conditionals based in which this loadable should be active.
	 *
	 * In this case: when on an admin page.
	 */
	public static function get_conditionals() {
		return [ Yoast_Admin_Conditional::class ];
	}

	/**
	 * New_Features_Modal_Integration constructor.
	 *
	 * @param WPSEO_Admin_Asset_Manager $admin_asset_manager The admin asset manager.
	 * @param Product_Helper            $product_helper      The product helper.
	 * @param Short_Link_Helper         $short_link_helper   The short link helper.
	 * @param Current_Page_Helper       $current_page_helper The current page helper.
	 */
	public function __construct(
		WPSEO_Admin_Asset_Manager $admin_asset_manager,
		Product_Helper $product_helper,
		Short_Link_Helper $short_link_helper,
		Current_Page_Helper $current_page_helper
	) {
		$this->admin_asset_manager = $admin_asset_manager;
		$this->product_helper      = $product_helper;
		$this->short_link_helper   = $short_link_helper;
		$this->current_page_helper = $current_page_helper;
	}

	/**
	 * Registers the action to enqueue the needed script(s).
	 *
	 * @return void
	 */
	public function register_hooks() {
		if (
			\in_array(
				$this->current_page_helper->get_current_yoast_seo_page(),
				[
					'wpseo_installation_successful',
					'wpseo_installation_successful_free',
				],
				true
			)
		) {
			// Bail when on the installation page.
			return;
		}
		\add_action( 'admin_enqueue_scripts', [ $this, 'enqueue_assets' ] );
	}

	/**
	 * Enqueue the workouts app.
	 */
	public function enqueue_assets() {
		$should_show_modal = \get_user_meta( \get_current_user_id(), 'yoast_should_show_new_features_modal', true );

		if ( intval( $should_show_modal ) === 0 ) {
			return;
		}

		// If Premium is installed, we manage the modal state there.
		if ( ! $this->product_helper->is_premium() ) {
			// Set the option to false here to avoid creating a new route.
			\update_user_meta( \get_current_user_id(), 'yoast_should_show_new_features_modal', 0 );
		}

		$this->admin_asset_manager->enqueue_script( self::SCRIPT_HANDLE );
		$this->admin_asset_manager->localize_script(
			self::SCRIPT_HANDLE,
			'wpseoNewFeatures',
			[
				'isPremium'  => $this->product_helper->is_premium(),
				'isRtl'      => \is_rtl(),
				'linkParams' => $this->short_link_helper->get_query_params(),
				'pluginUrl'  => \plugins_url( '', \WPSEO_FILE ),
			]
		);
		$this->admin_asset_manager->enqueue_style( 'ai-generator' );
	}
}

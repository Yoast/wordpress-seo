<?php

namespace Yoast\WP\SEO\Integrations\Admin;

use WPSEO_Admin_Asset_Manager;
use Yoast\WP\SEO\Conditionals\Yoast_Admin_Conditional;
use Yoast\WP\SEO\Helpers\Current_Page_Helper;
use Yoast\WP\SEO\Helpers\Product_Helper;
use Yoast\WP\SEO\Helpers\Short_Link_Helper;
use Yoast\WP\SEO\Integrations\Integration_Interface;
use Yoast\WP\SEO\Introductions\Application\Introductions_Collector;

/**
 * Loads introduction modal scripts.
 *
 * When:
 * - on a Yoast admin page (except the installation pages)
 * - there is at least one new introduction
 * - the user did not see the new introduction
 */
class Introductions_Integration implements Integration_Interface {
	const SCRIPT_HANDLE = 'introductions';

	/**
	 * Holds the admin asset manager.
	 *
	 * @var WPSEO_Admin_Asset_Manager
	 */
	private $admin_asset_manager;

	/**
	 * Holds the introduction collector.
	 *
	 * @var Introductions_Collector
	 */
	private $introductions_collector;

	/**
	 * Holds the product helper.
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
	 * Holds the short link helper.
	 *
	 * @var Short_Link_Helper
	 */
	private $short_link_helper;

	/**
	 * Returns the conditionals based in which this loadable should be active.
	 *
	 * In this case: when on an admin page.
	 */
	public static function get_conditionals() {
		return [ Yoast_Admin_Conditional::class ];
	}

	/**
	 * Constructs the integration.
	 *
	 * @param WPSEO_Admin_Asset_Manager $admin_asset_manager     The admin asset manager.
	 * @param Introductions_Collector   $introductions_collector The introductions' collector.
	 * @param Product_Helper            $product_helper          The product helper.
	 * @param Current_Page_Helper       $current_page_helper     The current page helper.
	 * @param Short_Link_Helper         $short_link_helper       The short link helper.
	 */
	public function __construct(
		WPSEO_Admin_Asset_Manager $admin_asset_manager,
		Introductions_Collector $introductions_collector,
		Product_Helper $product_helper,
		Current_Page_Helper $current_page_helper,
		Short_Link_Helper $short_link_helper
	) {
		$this->admin_asset_manager     = $admin_asset_manager;
		$this->introductions_collector = $introductions_collector;
		$this->product_helper          = $product_helper;
		$this->current_page_helper     = $current_page_helper;
		$this->short_link_helper       = $short_link_helper;
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
			// Bail when on an installation page.
			return;
		}
		\add_action( 'admin_enqueue_scripts', [ $this, 'enqueue_assets' ] );
	}

	/**
	 * Enqueue the new features assets.
	 */
	public function enqueue_assets() {
		$user          = \wp_get_current_user();
		$introductions = $this->introductions_collector->get_for( $user );
		if ( ! $introductions ) {
			// Bail when there are no introductions to show.
			return;
		}

		// Update user meta to have "seen" these introductions.
		$metadata = \get_user_meta( $user->ID, '_yoast_wpseo_introductions', true );
		if ( ! \is_array( $metadata ) ) {
			$metadata = [];
		}
		foreach ( $introductions as $introduction ) {
			$metadata[ $introduction['name'] ] = true;
		}
		\update_user_meta( $user->ID, '_yoast_wpseo_introductions', $metadata );

		$this->admin_asset_manager->enqueue_script( self::SCRIPT_HANDLE );
		$this->admin_asset_manager->localize_script(
			self::SCRIPT_HANDLE,
			'wpseoIntroductions',
			[
				'introductions' => $introductions,
				'isPremium'     => $this->product_helper->is_premium(),
				'isRtl'         => \is_rtl(),
				'linkParams'    => $this->short_link_helper->get_query_params(),
				'pluginUrl'     => \plugins_url( '', \WPSEO_FILE ),
			]
		);
		$this->admin_asset_manager->enqueue_style( 'ai-generator' );
	}
}

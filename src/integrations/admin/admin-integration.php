<?php

namespace Yoast\WP\SEO\Integrations\Admin;

use WPSEO_Admin_Asset_Manager;
use WPSEO_Utils;
use Yoast\WP\SEO\Conditionals\Admin_Conditional;
use Yoast\WP\SEO\Helpers\Current_Page_Helper;
use Yoast\WP\SEO\Helpers\Product_Helper;
use Yoast\WP\SEO\Integrations\Integration_Interface;
use Yoast_Notification_Center;

/**
 * Adds the Yoast admin.
 *
 * Adds a menu item in the Yoast menu.
 * Which renders the base for the UI.
 */
class Admin_Integration implements Integration_Interface {

	const PAGE = 'wpseo_admin';

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
	 * Holds the Product_Helper.
	 *
	 * @var Product_Helper
	 */
	private $product_helper;

	/**
	 * Constructs Settings_Integration.
	 *
	 * @param WPSEO_Admin_Asset_Manager $asset_manager       The WPSEO_Admin_Asset_Manager.
	 * @param Current_Page_Helper       $current_page_helper The Current_Page_Helper.
	 * @param Product_Helper            $product_helper      The Product_Helper.
	 */
	public function __construct(
		WPSEO_Admin_Asset_Manager $asset_manager,
		Current_Page_Helper $current_page_helper,
		Product_Helper $product_helper
	) {
		$this->asset_manager       = $asset_manager;
		$this->current_page_helper = $current_page_helper;
		$this->product_helper      = $product_helper;
	}

	/**
	 * Returns the conditionals based on which this loadable should be active.
	 *
	 * @return array
	 */
	public static function get_conditionals(): array {
		return [ Admin_Conditional::class ];
	}

	/**
	 * Initializes the integration.
	 *
	 * This is the place to register hooks and filters.
	 *
	 * @return void
	 */
	public function register_hooks() {
		// Add our page in the Yoast menu.
		\add_filter( 'wpseo_submenu_pages', [ $this, 'add_page' ], \PHP_INT_MAX );

		// Are we on our page?
		if ( $this->current_page_helper->get_current_yoast_seo_page() === self::PAGE ) {
			\add_action( 'admin_enqueue_scripts', [ $this, 'enqueue_assets' ] );
			\add_action( 'in_admin_header', [ $this, 'remove_notices' ], \PHP_INT_MAX );

			// Remove the post types and taxonomies made public notifications (if any).
			$this->remove_post_types_made_public_notification();
			$this->remove_taxonomies_made_public_notification();
		}
	}

	/**
	 * Adds the page to the Yoast menu.
	 *
	 * @param array $pages The pages.
	 *
	 * @return array The pages.
	 */
	public function add_page( array $pages ): array {
		\array_splice(
			$pages,
			1,
			0,
			[
				[
					'wpseo_dashboard',
					'',
					\__( 'Admin', 'wordpress-seo' ),
					'wpseo_manage_options',
					self::PAGE,
					[ $this, 'display_page' ],
				],
			]
		);

		return $pages;
	}

	/**
	 * Displays the page.
	 */
	public function display_page() {
		echo '<div id="yoast-seo-admin"></div>';
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

	/**
	 * Enqueues the assets.
	 *
	 * @return void
	 */
	public function enqueue_assets() {
		// Remove the emoji script as it is incompatible with both React and any contenteditable fields.
		\remove_action( 'admin_print_scripts', 'print_emoji_detection_script' );

		\wp_enqueue_media();
		$this->asset_manager->enqueue_script( 'admin' );
		$this->asset_manager->enqueue_style( 'new-settings' );
		$this->asset_manager->add_inline_script(
			'admin',
			\sprintf( 'wpseoScriptData = %s', WPSEO_Utils::format_json_encode( $this->get_script_data() ) ),
			'before'
		);
	}

	/**
	 * Creates the script data.
	 *
	 * @return array[] The script data.
	 */
	private function get_script_data(): array {
		return [
			'shared' => [
				'isPremium' => $this->product_helper->is_premium(),
				'isRtl'     => \is_rtl(),
			],
		];
	}

	/**
	 * Removes the notification related to the post types which have been made public.
	 *
	 * @return void
	 */
	private function remove_post_types_made_public_notification() {
		$notification_center = Yoast_Notification_Center::get();
		$notification_center->remove_notification_by_id( 'post-types-made-public' );
	}

	/**
	 * Removes the notification related to the taxonomies which have been made public.
	 *
	 * @return void
	 */
	private function remove_taxonomies_made_public_notification() {
		$notification_center = Yoast_Notification_Center::get();
		$notification_center->remove_notification_by_id( 'taxonomies-made-public' );
	}
}

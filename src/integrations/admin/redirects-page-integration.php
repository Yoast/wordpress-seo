<?php

namespace Yoast\WP\SEO\Integrations\Admin;

use WPSEO_Admin_Asset_Manager;
use Yoast\WP\SEO\Conditionals\Admin_Conditional;
use Yoast\WP\SEO\Conditionals\Premium_Inactive_Conditional;
use Yoast\WP\SEO\Helpers\Current_Page_Helper;
use Yoast\WP\SEO\Integrations\Integration_Interface;

/**
 * Redirects_Page_Integration class.
 */
class Redirects_Page_Integration implements Integration_Interface {

	/**
	 * The page identifier.
	 */
	public const PAGE = 'wpseo_redirects';

	/**
	 * The current page helper.
	 *
	 * @var Current_Page_Helper
	 */
	private $current_page_helper;

	/**
	 * Constructor.
	 *
	 * @param Current_Page_Helper $current_page_helper The current page helper.
	 */
	public function __construct( Current_Page_Helper $current_page_helper ) {
		$this->current_page_helper = $current_page_helper;
	}

	/**
	 * Sets up the hooks.
	 *
	 * @return void
	 */
	public function register_hooks() {
		\add_filter( 'wpseo_submenu_pages', [ $this, 'add_submenu_page' ], 9 );
		if ( $this->current_page_helper->get_current_yoast_seo_page() === self::PAGE ) {
			\add_action( 'admin_enqueue_scripts', [ $this, 'enqueue_assets' ] );
			\add_action( 'in_admin_header', [ $this, 'remove_notices' ], \PHP_INT_MAX );
		}
	}

	/**
	 * Returns the conditionals based on which this loadable should be active.
	 *
	 * In this case: only when on an admin page and Premium is not active.
	 *
	 * @return array The conditionals.
	 */
	public static function get_conditionals() {
		return [
			Admin_Conditional::class,
			Premium_Inactive_Conditional::class,
		];
	}

	/**
	 * Adds the redirects submenu page.
	 *
	 * @param array $submenu_pages The Yoast SEO submenu pages.
	 *
	 * @return array The filtered submenu pages.
	 */
	public function add_submenu_page( $submenu_pages ) {
		$submenu_pages[] = [
			'wpseo_dashboard',
			'',
			\__( 'Redirects', 'wordpress-seo' ) . ' <span class="yoast-badge yoast-premium-badge"></span>',
			'edit_others_posts',
			self::PAGE,
			[ $this, 'display' ],
		];

		return $submenu_pages;
	}

	/**
	 * Enqueue assets on the redirects page.
	 *
	 * @return void
	 */
	public function enqueue_assets() {
		$asset_manager = new WPSEO_Admin_Asset_Manager();
		$asset_manager->enqueue_script( 'redirects' );
		$asset_manager->enqueue_style( 'redirects' );

		$asset_manager->localize_script(
			'redirects',
			'wpseoScriptData',
			[
				'preferences' => [
					'isRtl'     => \is_rtl(),
				],
				'linkParams'  => \YoastSEO()->helpers->short_link->get_query_params(),
			]
		);
	}

	/**
	 * Displays the redirects page.
	 *
	 * @return void
	 */
	public function display() {
		require \WPSEO_PATH . 'admin/pages/redirects.php';
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

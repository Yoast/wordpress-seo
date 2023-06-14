<?php

namespace Yoast\WP\SEO\Integrations\Admin;

use WPSEO_Admin_Asset_Manager;
use Yoast\WP\SEO\Conditionals\Admin_Conditional;
use Yoast\WP\SEO\Helpers\Capability_Helper;
use Yoast\WP\SEO\Helpers\Current_Page_Helper;
use Yoast\WP\SEO\Helpers\Options_Helper;
use Yoast\WP\SEO\Helpers\Product_Helper;
use Yoast\WP\SEO\Integrations\Integration_Interface;

/**
 * Old_Premium_Integration class
 *
 * @deprecated 20.10
 * @codeCoverageIgnore
 */
class Old_Premium_Integration implements Integration_Interface {

	/**
	 * The options' helper.
	 *
	 * @var Options_Helper
	 */
	private $options_helper;

	/**
	 * The product helper.
	 *
	 * @var Product_Helper
	 */
	private $product_helper;

	/**
	 * The capability helper.
	 *
	 * @var Capability_Helper
	 */
	private $capability_helper;

	/**
	 * The admin asset manager.
	 *
	 * @var WPSEO_Admin_Asset_Manager
	 */
	private $admin_asset_manager;

	/**
	 * The Current_Page_Helper.
	 *
	 * @var Current_Page_Helper
	 */
	private $current_page_helper;

	/**
	 * {@inheritDoc}
	 */
	public static function get_conditionals() {
		return [ Admin_Conditional::class ];
	}

	/**
	 * Old_Premium_Integration constructor.
	 *
	 * @deprecated 20.10
	 * @codeCoverageIgnore
	 *
	 * @param Options_Helper            $options_helper      The options helper.
	 * @param Product_Helper            $product_helper      The product helper.
	 * @param Capability_Helper         $capability_helper   The capability helper.
	 * @param WPSEO_Admin_Asset_Manager $admin_asset_manager The admin asset manager.
	 * @param Current_Page_Helper       $current_page_helper The Current_Page_Helper.
	 */
	public function __construct(
		Options_Helper $options_helper,
		Product_Helper $product_helper,
		Capability_Helper $capability_helper,
		WPSEO_Admin_Asset_Manager $admin_asset_manager,
		Current_Page_Helper $current_page_helper
	) {
		$this->options_helper      = $options_helper;
		$this->product_helper      = $product_helper;
		$this->capability_helper   = $capability_helper;
		$this->admin_asset_manager = $admin_asset_manager;
		$this->current_page_helper = $current_page_helper;
	}

	/**
	 * {@inheritDoc}
	 *
	 * @deprecated 20.10
	 * @codeCoverageIgnore
	 */
	public function register_hooks() {
		\_deprecated_function( __METHOD__, 'Yoast SEO 20.7' );
	}

	/**
	 * Shows a notice if Premium is older than 20.0-RC1 so Settings might be missing from the UI.
	 *
	 * @deprecated 20.10
	 * @codeCoverageIgnore
	 *
	 * @return void
	 */
	public function old_premium_notice() {
		\_deprecated_function( __METHOD__, 'Yoast SEO 20.7' );
	}

	/**
	 * Dismisses the old premium notice.
	 *
	 * @deprecated 20.10
	 * @codeCoverageIgnore
	 *
	 * @return bool
	 */
	public function dismiss_old_premium_notice() {
		\_deprecated_function( __METHOD__, 'Yoast SEO 20.7' );

		return false;
	}
}

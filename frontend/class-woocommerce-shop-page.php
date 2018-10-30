<?php
/**
 * WPSEO plugin file.
 *
 * @package WPSEO\Frontend
 */

/**
 * Represents the logic to determine if the current page is a WooCommerce shop page.
 */
class WPSEO_WooCommerce_Shop_Page implements WPSEO_WordPress_Integration {

	/**
	 * @var bool Holds the flag if shop page is set.
	 */
	protected $shop_page_exists = false;

	/**
	 * Class constructor
	 */
	public function __construct() {
		if ( $this->is_woo_activated() ) {
			$this->shop_page_exists = $this->get_shop_page_id() > 0;
		}
	}

	/**
	 * Registers the hooks
	 *
	 * @return void
	 */
	public function register_hooks() {
		if ( ! $this->shop_page_exists ) {
			return;
		}

		add_filter( 'wpseo_frontend_page_type_simple_page_id', array( $this, 'get_page_id' ) );
	}

	/**
	 * Check whether woocommerce plugin is active.
	 *
	 * @return bool
	 */
	private function is_woo_activated() {
		return class_exists( 'WooCommerce', false );
	}

	/**
	 * Returns the ID of the WooCommerce shop page when the currently opened page is the shop page.
	 *
	 * @param int $page_id The page id.
	 *
	 * @return int The Page ID of the shop.
	 */
	public function get_page_id( $page_id ) {
		if ( ! $this->is_shop_page() ) {
			return $page_id;
		}

		return $this->get_shop_page_id();
	}

	/**
	 * Checks if the current page is the shop page.
	 *
	 * @return bool Whether the current page is the WooCommerce shop page.
	 */
	public function is_shop_page() {
		static $is_shop_page;

		if ( isset( $is_shop_page ) ) {
			return $is_shop_page;
		}

		$is_shop_page = false;
		if ( $this->shop_page_exists ) {
			$is_shop_page = is_shop() && ! is_search();
		}

		return $is_shop_page;
	}

	/**
	 * Returns the id of the set WooCommerce shop page.
	 *
	 * @return int The ID of the set page.
	 */
	public function get_shop_page_id() {
		static $shop_page_id;

		if ( ! $shop_page_id ) {
			$shop_page_id = function_exists( 'wc_get_page_id' ) ? wc_get_page_id( 'shop' ) : ( -1 );
		}

		return $shop_page_id;
	}
}

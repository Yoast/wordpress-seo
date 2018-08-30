<?php
/**
 * WPSEO plugin test file.
 *
 * @package WPSEO\Tests\Doubles
 */

/**
 * Test Helper Class.
 */
class WPSEO_Frontend_Double extends WPSEO_Frontend {

	protected $is_premium = false;

	/**
	 * Exposes the constructor to the public.
	 */
	public function __construct() {
		parent::__construct();
	}

	/**
	 * Get the singleton instance of this class
	 *
	 * This needs to be overrwritten to make sure it returns the Double version of this class.
	 *
	 * @return WPSEO_Frontend_Double
	 */
	public static function get_instance() {
		if ( ! ( self::$instance instanceof self ) ) {
			self::$instance = new self();
		}

		return self::$instance;
	}

	/**
	 * @param WPSEO_WooCommerce_Shop_Page $woocommerce_shop_page
	 */
	public function set_woocommerce_shop_page( WPSEO_WooCommerce_Shop_Page $woocommerce_shop_page ) {
		$this->woocommerce_shop_page = $woocommerce_shop_page;
	}

	/**
	 * Short-circuit redirecting.
	 *
	 * @param string $location The path to redirect to.
	 * @param int    $status   Status code to use.
	 */
	public function redirect( $location, $status = 302 ) {
		// Intentionally left empty to remove actual redirection code to be able to test it.
	}

	/**
	 * @inheritdoc
	 */
	public function do_attachment_redirect( $attachment_url ) {
		// Intentionally left empty to remove actual redirection code to be able to test it.
	}

	/**
	 * @inheritdoc
	 */
	public function get_queried_post_type() {
		return parent::get_queried_post_type();
	}

	/**
	 * @inheritdoc
	 */
	public function get_post_type_archive_title( $separator, $separator_location ) {
		return parent::get_post_type_archive_title( $separator, $separator_location );
	}

	public function set_is_premium( $premium ) {
		$this->is_premium = (bool) $premium;
	}

	public function is_premium() {
		return $this->is_premium;
	}
}

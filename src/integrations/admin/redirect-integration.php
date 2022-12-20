<?php

namespace Yoast\WP\SEO\Integrations\Admin;

use Yoast\WP\SEO\Conditionals\Admin_Conditional;
use Yoast\WP\SEO\Helpers\Current_Page_Helper;
use Yoast\WP\SEO\Helpers\Redirect_Helper;
use Yoast\WP\SEO\Helpers\Url_Helper;
use Yoast\WP\SEO\Integrations\Integration_Interface;

/**
 * Class Redirect_Integration.
 */
class Redirect_Integration implements Integration_Interface {

	/**
	 * The meta helper.
	 *
	 * @var Meta_Helper
	 */
	protected $meta;

	/**
	 * The current page helper.
	 *
	 * @var Current_Page_Helper
	 */
	protected $current_page;

	/**
	 * The redirect helper.
	 *
	 * @var Redirect_Helper
	 */
	private $redirect;

	/**
	 * The URL helper.
	 *
	 * @var Url_Helper
	 */
	private $url;

	/**
	 * Sets the helpers.
	 *
	 * @codeCoverageIgnore
	 *
	 * @param Current_Page_Helper $current_page The current page helper.
	 * @param Redirect_Helper     $redirect     The redirect helper.
	 * @param Url_Helper          $url          The URL helper.
	 */
	public function __construct( Current_Page_Helper $current_page, Redirect_Helper $redirect, Url_Helper $url ) {
		$this->current_page = $current_page;
		$this->redirect     = $redirect;
		$this->url          = $url;
	}

	/**
	 * Returns the conditionals based in which this loadable should be active.
	 *
	 * @return array
	 */
	public static function get_conditionals() {
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
		\add_action( 'admin_init', [ $this, 'old_settings_redirect' ] );
	}

	/**
	 * Redirect to new settings URLs.
	 *
	 * @return void
	 */
	public function old_settings_redirect() {
		$current_page = $this->current_page->get_current_yoast_seo_page();

		switch ( $current_page ) {
			case 'wpseo_titles':
				$this->redirect->do_safe_redirect( \admin_url( 'admin.php?page=wpseo_page_settings#/site-representation' ), 301 );
				exit;
			default:
				return;
		}
	}
}

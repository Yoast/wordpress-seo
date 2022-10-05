<?php

namespace Yoast\WP\SEO\Integrations\Redirects;

use Yoast\WP\SEO\Helpers\Redirect_Helper;
use Yoast\WP\SEO\Helpers\Url_Helper;
use Yoast\WP\SEO\Conditionals\No_Conditionals;
use Yoast\WP\SEO\Integrations\Integration_Interface;

/**
 * Class Global_Redirects.
 */
class Global_Redirects implements Integration_Interface {

	use No_Conditionals;

	/**
	 *
	 * /**
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
	 * @param Redirect_Helper $redirect The redirect helper.
	 * @param Url_Helper      $url      The URL helper.
	 */
	public function __construct( Redirect_Helper $redirect, Url_Helper $url ) {
		$this->redirect = $redirect;
		$this->url      = $url;
	}

	/**
	 * Initializes the integration.
	 *
	 * This is the place to register hooks and filters.
	 *
	 * @return void
	 */
	public function register_hooks() {
		\add_action( 'wp', [ $this, 'category_redirect' ] );
	}

	/**
	 * Strips `cat=-1` from the URL and redirects to the resulting URL.
	 */
	public function category_redirect() {
		// phpcs:ignore WordPress.Security.NonceVerification.Recommended -- Data is not processed or saved.
		if ( isset( $_GET['cat'] ) && $_GET['cat'] === '-1' ) {
			// phpcs:ignore WordPress.Security.NonceVerification.Recommended -- Data is not processed or saved.
			unset( $_GET['cat'] );
			if ( isset( $_SERVER['REQUEST_URI'] ) ) {
				// phpcs:ignore WordPress.Security.ValidatedSanitizedInput -- This is just a replace and the data is never saved.
				$_SERVER['REQUEST_URI'] = \str_replace( 'cat=-1', '', \wp_unslash( $_SERVER['REQUEST_URI'] ) );
			}
			$this->redirect->do_safe_redirect( $this->url->recreate_current_url(), 301, 'Stripping cat=-1 from the URL' );
		}
	}
}

<?php
/**
 * WPSEO plugin file.
 *
 * @package Yoast\WP\Free\Integrations\Front_End
 */

namespace Yoast\WP\Free\Integrations\Front_End;

use Yoast\WP\Free\Conditionals\Front_End_Conditional;
use Yoast\WP\Free\Helpers\Current_Page_Helper;
use Yoast\WP\Free\Helpers\Meta_Helper;
use Yoast\WP\Free\Helpers\Options_Helper;
use Yoast\WP\Free\Integrations\Integration_Interface;

/**
 * Class Redirects
 */
class Redirects implements Integration_Interface {

	/**
	 * @var Options_Helper
	 */
	protected $options;

	/**
	 * @var Meta_Helper
	 */
	protected $meta;

	/**
	 * @var Current_Page_Helper
	 */
	protected $current_page;

	/**
	 * Sets the helpers.
	 *
	 * @codeCoverageIgnore
	 *
	 * @param Options_Helper      $options      Options helper.
	 * @param Meta_Helper         $meta         Meta helper.
	 * @param Current_Page_Helper $current_page The current page helper.
	 */
	public function __construct( Options_Helper $options, Meta_Helper $meta, Current_Page_Helper $current_page ) {
		$this->options      = $options;
		$this->meta         = $meta;
		$this->current_page = $current_page;
	}

	/**
	 * @codeCoverageIgnore
	 * @inheritDoc
	 */
	public static function get_conditionals() {
		return [ Front_End_Conditional::class ];
	}

	/**
	 * @codeCoverageIgnore
	 * @inheritDoc
	 */
	public function register_hooks() {
		add_action( 'wp', [ $this, 'archive_redirect' ] );
		add_action( 'wp', [ $this, 'page_redirect' ], 99 );
		add_action( 'template_redirect', [ $this, 'attachment_redirect' ], 1 );
	}

	/**
	 * When certain archives are disabled, this redirects those to the homepage.
	 *
	 * @return boolean False when no redirect was triggered.
	 */
	public function archive_redirect() {
		if (
			( $this->options->get( 'disable-date', false ) && $this->current_page->is_date_archive() ) ||
			( $this->options->get( 'disable-author', false ) && $this->current_page->is_author_archive() ) ||
			( $this->options->get( 'disable-post_format', false ) && $this->current_page->is_post_format_archive() )
		) {
			$this->do_safe_redirect( get_bloginfo( 'url' ), 301 );

			return true;
		}

		return false;
	}

	/**
	 * Based on the redirect meta value, this function determines whether it should redirect the current post / page.
	 *
	 * @return boolean
	 */
	public function page_redirect() {
		if ( ! is_singular() ) {
			return false;
		}

		$post = get_post();
		if ( ! is_object( $post ) ) {
			return false;
		}

		$redirect = $this->meta->get_value( 'redirect', $post->ID );
		if ( $redirect === '' ) {
			return false;
		}

		$this->do_redirect( $redirect );
		return true;
	}


	/**
	 * If the option to disable attachment URLs is checked, this performs the redirect to the attachment.
	 *
	 * @return bool Returns success status.
	 */
	public function attachment_redirect() {
		if ( ! $this->current_page->is_attachment() || $this->options->get( 'disable-attachment', false ) === false ) {
			return false;
		}

		/**
		 * Allow the developer to change the target redirection URL for attachments.
		 *
		 * @api   string $attachment_url The attachment URL for the queried object.
		 * @api   object $queried_object The queried object.
		 *
		 * @since 7.5.3
		 */
		$url = apply_filters(
			'wpseo_attachment_redirect_url',
			\wp_get_attachment_url( \get_queried_object_id() ),
			\get_queried_object()
		);

		if ( ! empty( $url ) ) {
			$this->do_redirect( $url );

			return true;
		}

		return false;
	}

	/**
	 * Wraps wp_safe_redirect to allow testing for redirects.
	 *
	 * @param string $location The path to redirect to.
	 * @param int    $status   Status code to use.
	 */
	protected function do_safe_redirect( $location, $status = 302 ) {
		\header( 'X-Redirect-By: Yoast SEO' );
		\wp_safe_redirect( $location, $status, 'Yoast SEO' );
		exit;
	}

	/**
	 * Performs the redirect from the attachment page to the image file itself.
	 *
	 * @param string $location The attachment image url.
	 * @param int    $status   Status code to use.
	 *
	 * @return void
	 */
	protected function do_redirect( $location, $status = 301 ) {
		\header( 'X-Redirect-By: Yoast SEO' );
		\wp_redirect( $location, $status, 'Yoast SEO' );
		exit;
	}
}

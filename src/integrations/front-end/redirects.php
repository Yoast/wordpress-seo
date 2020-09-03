<?php

namespace Yoast\WP\SEO\Integrations\Front_End;

use Yoast\WP\SEO\Conditionals\Front_End_Conditional;
use Yoast\WP\SEO\Helpers\Current_Page_Helper;
use Yoast\WP\SEO\Helpers\Meta_Helper;
use Yoast\WP\SEO\Helpers\Options_Helper;
use Yoast\WP\SEO\Helpers\Redirect_Helper;
use Yoast\WP\SEO\Integrations\Integration_Interface;

/**
 * Class Redirects.
 */
class Redirects implements Integration_Interface {

	/**
	 * The options helper.
	 *
	 * @var Options_Helper
	 */
	protected $options;

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
	 * Sets the helpers.
	 *
	 * @codeCoverageIgnore
	 *
	 * @param Options_Helper      $options      Options helper.
	 * @param Meta_Helper         $meta         Meta helper.
	 * @param Current_Page_Helper $current_page The current page helper.
	 * @param Redirect_Helper     $redirect     The redirect helper.
	 */
	public function __construct( Options_Helper $options, Meta_Helper $meta, Current_Page_Helper $current_page, Redirect_Helper $redirect ) {
		$this->options      = $options;
		$this->meta         = $meta;
		$this->current_page = $current_page;
		$this->redirect     = $redirect;
	}

	/**
	 * @inheritDoc
	 */
	public static function get_conditionals() {
		return [ Front_End_Conditional::class ];
	}

	/**
	 * @inheritDoc
	 */
	public function register_hooks() {
		\add_action( 'wp', [ $this, 'archive_redirect' ] );
		\add_action( 'wp', [ $this, 'page_redirect' ], 99 );
		\add_action( 'template_redirect', [ $this, 'attachment_redirect' ], 1 );
	}

	/**
	 * When certain archives are disabled, this redirects those to the homepage.
	 */
	public function archive_redirect() {
		if ( $this->need_archive_redirect() ) {
			$this->redirect->do_safe_redirect( \get_bloginfo( 'url' ), 301 );
		}
	}

	/**
	 * Based on the redirect meta value, this function determines whether it should redirect the current post / page.
	 */
	public function page_redirect() {
		if ( ! $this->current_page->is_simple_page() ) {
			return;
		}

		$post = \get_post();
		if ( ! \is_object( $post ) ) {
			return;
		}

		$redirect = $this->meta->get_value( 'redirect', $post->ID );
		if ( $redirect === '' ) {
			return;
		}

		$this->redirect->do_redirect( $redirect, 301 );
	}

	/**
	 * If the option to disable attachment URLs is checked, this performs the redirect to the attachment.
	 */
	public function attachment_redirect() {
		if ( ! $this->current_page->is_attachment() ) {
			return;
		}

		if ( $this->options->get( 'disable-attachment', false ) === false ) {
			return;
		}

		$url = $this->get_attachment_url();
		if ( empty( $url ) ) {
			return;
		}

		$this->redirect->do_redirect( $url, 301 );
	}

	/**
	 * Checks if certain archive pages are disabled to determine if a archive redirect is needed.
	 *
	 * @codeCoverageIgnore
	 *
	 * @return bool Whether or not to redirect an archive page.
	 */
	protected function need_archive_redirect() {
		if ( $this->options->get( 'disable-date', false ) && $this->current_page->is_date_archive() ) {
			return true;
		}

		if ( $this->options->get( 'disable-author', false ) && $this->current_page->is_author_archive() ) {
			return true;
		}

		if ( $this->options->get( 'disable-post_format', false ) && $this->current_page->is_post_format_archive() ) {
			return true;
		}

		return false;
	}

	/**
	 * Retrieves the attachment url for the current page.
	 *
	 * @codeCoverageIgnore It wraps WordPress functions.
	 *
	 * @return string The attachment url.
	 */
	protected function get_attachment_url() {
		/**
		 * Allows the developer to change the target redirection URL for attachments.
		 *
		 * @api string $attachment_url The attachment URL for the queried object.
		 * @api object $queried_object The queried object.
		 *
		 * @since 7.5.3
		 */
		return \apply_filters(
			'wpseo_attachment_redirect_url',
			\wp_get_attachment_url( \get_queried_object_id() ),
			\get_queried_object()
		);
	}
}

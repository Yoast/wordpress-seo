<?php

namespace Yoast\WP\SEO\Integrations\Front_End;

use Yoast\WP\SEO\Conditionals\Front_End_Conditional;
use Yoast\WP\SEO\Helpers\Current_Page_Helper;
use Yoast\WP\SEO\Helpers\Meta_Helper;
use Yoast\WP\SEO\Helpers\Options_Helper;
use Yoast\WP\SEO\Helpers\Redirect_Helper;
use Yoast\WP\SEO\Helpers\Url_Helper;
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
	 * The URL helper.
	 *
	 * @var Url_Helper
	 */
	private $url;

	/**
	 * Holds the WP_Query variables we should get rid of.
	 *
	 * @var string[]
	 */
	private $date_query_variables = [
		'year',
		'm',
		'monthnum',
		'day',
		'hour',
		'minute',
		'second',
	];

	/**
	 * Sets the helpers.
	 *
	 * @codeCoverageIgnore
	 *
	 * @param Options_Helper      $options      Options helper.
	 * @param Meta_Helper         $meta         Meta helper.
	 * @param Current_Page_Helper $current_page The current page helper.
	 * @param Redirect_Helper     $redirect     The redirect helper.
	 * @param Url_Helper          $url          The URL helper.
	 */
	public function __construct( Options_Helper $options, Meta_Helper $meta, Current_Page_Helper $current_page, Redirect_Helper $redirect, Url_Helper $url ) {
		$this->options      = $options;
		$this->meta         = $meta;
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
		return [ Front_End_Conditional::class ];
	}

	/**
	 * Initializes the integration.
	 *
	 * This is the place to register hooks and filters.
	 *
	 * @return void
	 */
	public function register_hooks() {
		\add_action( 'wp', [ $this, 'archive_redirect' ] );
		\add_action( 'wp', [ $this, 'page_redirect' ], 99 );
		\add_action( 'template_redirect', [ $this, 'attachment_redirect' ], 1 );
		\add_action( 'template_redirect', [ $this, 'disable_date_queries' ] );
	}

	/**
	 * Disable date queries, if they're disabled in Yoast SEO settings, to prevent indexing the wrong things.
	 *
	 * @return void
	 */
	public function disable_date_queries() {
		if ( $this->options->get( 'disable-date', false ) ) {
			$exploded_url                    = \explode( '?', $this->url->recreate_current_url(), 2 );
			list( $base_url, $query_string ) = \array_pad( $exploded_url, 2, '' );
			\parse_str( $query_string, $query_vars );
			foreach ( $this->date_query_variables as $variable ) {
				if ( \in_array( $variable, \array_keys( $query_vars ), true ) ) {
					$this->do_date_redirect( $query_vars, $base_url );
				}
			}
		}
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

		$this->redirect->do_safe_redirect( $redirect, 301 );
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

		$this->redirect->do_unsafe_redirect( $url, 301 );
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

	/**
	 * Redirects away query variables that shouldn't work.
	 *
	 * @param array  $query_vars   The query variables in the current URL.
	 * @param string $base_url     The base URL without query string.
	 *
	 * @return void
	 */
	private function do_date_redirect( $query_vars, $base_url ) {
		foreach ( $this->date_query_variables as $variable ) {
			unset( $query_vars[ $variable ] );
		}
		$url = $base_url;
		if ( count( $query_vars ) > 0 ) {
			$url .= '?' . \http_build_query( $query_vars );
		}

		$this->redirect->do_safe_redirect( $url, 301 );
	}
}

<?php

namespace Yoast\WP\SEO\Integrations;

use Yoast\WP\SEO\Conditionals\No_Conditionals;
use Yoast\WP\SEO\Exceptions\Sitemaps\Path_Transformation_Exception;
use Yoast\WP\SEO\Helpers\Redirect_Helper;
use Yoast\WP\SEO\Services\Sitemaps\Sitemap_Path_Transformer;
use Yoast\WP\SEO\Services\Sitemaps\Sitemap_State;

/**
 * Disables the WP core sitemaps or falls back to WP core sitemaps.
 */
class Sitemap_Source_Determination_Integration implements Integration_Interface {

	use No_Conditionals;

	/**
	 * The redirect helper.
	 *
	 * @var Redirect_Helper
	 */
	protected $redirect;

	/**
	 * Transforms WordPress sitemap paths into Yoast SEO sitemap paths and vice versa.
	 *
	 * @var Sitemap_Path_Transformer
	 */
	protected $path_transformer;

	/**
	 * Determines the state the Yoast SEO sitemap is currently in.
	 *
	 * @var Sitemap_State
	 */
	protected $sitemap_state;

	/**
	 * Sitemaps_Enabled_Conditional constructor.
	 *
	 * @codeCoverageIgnore
	 *
	 * @param Redirect_Helper          $redirect         The redirect helper.
	 * @param Sitemap_Path_Transformer $path_transformer A service which transforms WordPress sitemap paths into Yoast SEO paths and vice versa.
	 * @param Sitemap_State $sitemap_state
	 */
	public function __construct(
		Redirect_Helper $redirect,
		Sitemap_Path_Transformer $path_transformer,
		Sitemap_State $sitemap_state
	) {
		$this->redirect         = $redirect;
		$this->path_transformer = $path_transformer;
		$this->sitemap_state  = $sitemap_state;
	}

	/**
	 * Disable the WP core XML sitemaps.
	 * {@inheritDoc}
	 */
	public function register_hooks() {
		$path = $this->get_requested_path();
		if ( \strpos( $path, 'sitemap' ) === false ) {
			// Not a sitemap request.
			return;
		}
		// Ignore xsl requests.
		if ( \strpos( $path, '.xsl' ) !== false ) {
			return;
		}

		\add_action( 'init', [ $this, 'determine_sitemap_provider' ], 11 );
	}

	/**
	 * Disables the core sitemaps if Yoast SEO sitemaps are enabled.
	 *
	 * @return void
	 */
	public function determine_sitemap_provider() {
		// If sitemaps are disabled, don't interfere with anything.
		if ( ! $this->sitemap_state->is_enabled() ) {
			return;
		}

		if ( $this->sitemap_state->is_presentable() ) {
			\add_filter( 'wp_sitemaps_enabled', '__return_false' );
			\add_action( 'send_headers', [ $this, 'redirect_to_yoast_seo_sitemap' ] );
		}
		else {
			\add_action( 'send_headers', [ $this, 'redirect_to_wp_core_sitemap' ] );
		}
	}

	/**
	 * Redirects requests from the WordPress core sitemap to the Yoast sitemaps.
	 *
	 * @return void
	 */
	public function redirect_to_yoast_seo_sitemap() {
		$path = $this->get_requested_path();
		// If it's not a wp-sitemap request, nothing to do.
		if ( \strpos( $path, '/wp-sitemap' ) !== 0 ) {
			return;
		}

		try {
			$yoast_seo_path = $this->path_transformer->transform_wp_core_to_yoast_seo( $path );
		} catch ( Path_Transformation_Exception $exception ) {
			// We don't have a valid Yoast SEO alternative. Don't do anything.
			return;
		}

		$this->redirect->do_safe_redirect( \home_url( $yoast_seo_path ), 301 );
	}

	/**
	 * Redirects requests from the Yoast SEO to the WordPress core sitemaps.
	 *
	 * @return void
	 */
	public function redirect_to_wp_core_sitemap() {
		$path = $this->get_requested_path();

		try {
			$wp_core_path = $this->path_transformer->transform_yoast_seo_to_wp_core( $path );
		} catch ( Path_Transformation_Exception $exception ) {
			// The current path isn't a Yoast SEO sitemap path, or we don't have a valid WP Core alternative. Don't do anything.
			return;
		}

		// Use a 302, as this is a temporary fallback which is no longer used once all indexables are complete.
		$this->redirect->do_safe_redirect( \home_url( $wp_core_path ), 302 );
	}

	/**
	 * Gets the requested path of the current request.
	 *
	 * @return string The requested path.
	 */
	protected function get_requested_path() {
		static $path;

		if ( isset( $path ) ) {
			return $path;
		}
		if ( empty( $_SERVER['REQUEST_URI'] ) ) {
			return '';
		}

		return $path = sanitize_text_field( \wp_unslash( $_SERVER['REQUEST_URI'] ) );
	}
}

<?php
/**
 * WPSEO plugin file.
 *
 * @package Yoast\WP\SEO\Integrations\Front_End
 */

namespace Yoast\WP\SEO\Integrations;

use WPSEO_Replace_Vars;
use Yoast\WP\SEO\Conditionals\Breadcrumbs_Enabled_Conditional;
use Yoast\WP\SEO\Conditionals\Migrations_Conditional;
use Yoast\WP\SEO\Memoizers\Meta_Tags_Context_Memoizer;
use Yoast\WP\SEO\Presenters\Breadcrumbs_Presenter;
use Yoast\WP\SEO\Surfaces\Helpers_Surface;

/**
 * Adds customizations to the front end for breadcrumbs.
 */
class Breadcrumbs_Integration implements Integration_Interface {

	/**
	 * The breadcrumbs presenter.
	 *
	 * @var Breadcrumbs_Presenter
	 */
	private $presenter;

	/**
	 * The meta tags context memoizer.
	 *
	 * @var Meta_Tags_Context_Memoizer
	 */
	private $context_memoizer;

	/**
	 * Breadcrumbs integration constructor.
	 *
	 * @param Helpers_Surface            $helpers          The helpers.
	 * @param WPSEO_Replace_Vars         $replace_vars     The replace vars.
	 * @param Meta_Tags_Context_Memoizer $context_memoizer The meta tags context memoizer.
	 */
	public function __construct(
		Helpers_Surface $helpers,
		WPSEO_Replace_Vars $replace_vars,
		Meta_Tags_Context_Memoizer $context_memoizer
	) {
		$this->context_memoizer        = $context_memoizer;
		$this->presenter               = new Breadcrumbs_Presenter();
		$this->presenter->helpers      = $helpers;
		$this->presenter->replace_vars = $replace_vars;
	}

	/**
	 * @inheritDoc
	 */
	public static function get_conditionals() {
		return [ Breadcrumbs_Enabled_Conditional::class, Migrations_Conditional::class ];
	}

	/**
	 * @codeCoverageIgnore
	 * @inheritDoc
	 */
	public function register_hooks() {
		add_shortcode( 'wpseo_breadcrumb', [ $this, 'render' ] );
	}

	/**
	 * Renders the breadcrumbs.
	 *
	 * @return string The rendered breadcrumbs.
	 */
	public function render() {
		$context = $this->context_memoizer->for_current_page();
		/** This filter is documented in src/integrations/front-end-integration.php */
		$presentation = \apply_filters( 'wpseo_frontend_presentation', $context->presentation, $context );
		$this->presenter->presentation = $presentation;

		return $this->presenter->present();
	}
}

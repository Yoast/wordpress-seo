<?php
/**
 * WPSEO plugin file.
 *
 * @package Yoast\WP\SEO\Integrations\Front_End
 */

namespace Yoast\WP\SEO\Integrations;

use WPSEO_Replace_Vars;
use Yoast\WP\SEO\Conditionals\Breadcrumbs_Enabled_Conditional;
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
	 * Breadcrumbs integration constructor.
	 *
	 * @param Helpers_Surface    $helpers      The helpers.
	 * @param WPSEO_Replace_Vars $replace_vars The replace vars.
	 */
	public function __construct(
		Helpers_Surface $helpers,
		WPSEO_Replace_Vars $replace_vars
	) {
		$this->presenter = new Breadcrumbs_Presenter();
		$this->presenter->helpers      = $helpers;
		$this->presenter->replace_vars = $replace_vars;
	}

	/**
	 * @inheritDoc
	 */
	public static function get_conditionals() {
		return [ Breadcrumbs_Enabled_Conditional::class ];
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
		$this->presenter->presentation = YoastSEO()->current_page->get_presentation();

		return $this->presenter->present();
	}
}

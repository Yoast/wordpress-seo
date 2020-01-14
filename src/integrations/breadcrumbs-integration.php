<?php
/**
 * WPSEO plugin file.
 *
 * @package Yoast\WP\SEO\Integrations\Front_End
 */

namespace Yoast\WP\SEO\Integrations;

use Yoast\WP\SEO\Conditionals\Breadcrumbs_Enabled_Conditional;
use Yoast\WP\SEO\Presenters\Breadcrumbs_Presenter;

/**
 * Adds customizations to the front end for the primary category.
 */
class Breadcrumbs_Integration implements Integration_Interface {

	/**
	 * @var Breadcrumbs_Presenter
	 */
	private $presenter;

	/**
	 * Breadcrumbs_Integration constructor.
	 *
	 * @param Breadcrumbs_Presenter $presenter The breadcrumbs presenter.
	 *
	 * @codeCoverageIgnore
	 */
	public function __construct( Breadcrumbs_Presenter $presenter ) {
		$this->presenter = $presenter;
	}

	/**
	 * Returns the conditionals.
	 *
	 * @inheritDoc
	 */
	public static function get_conditionals() {
		return [ Breadcrumbs_Enabled_Conditional::class ];
	}

	/**
	 * Registers the required hooks.
	 *
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
	 * @throws \Exception If something goes wrong generating the DI container.
	 */
	public function render() {
		$indexable_presentation = yoastseo()->get_current_page_presentation();

		return $this->presenter->present( $indexable_presentation );
	}
}

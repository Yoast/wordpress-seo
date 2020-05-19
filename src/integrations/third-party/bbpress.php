<?php
/**
 * WPSEO plugin file.
 *
 * @package Yoast\WP\SEO\Integrations\Third_Party
 */

namespace Yoast\WP\SEO\Integrations\Third_Party;

use Yoast\WP\SEO\Conditionals\Front_End_Conditional;
use Yoast\WP\SEO\Helpers\Options_Helper;
use Yoast\WP\SEO\Integrations\Integration_Interface;

/**
 * Class BbPress
 */
class BbPress implements Integration_Interface {

	/**
	 * The options helper.
	 *
	 * @var Options_Helper
	 */
	private $options;

	/**
	 * @inheritDoc
	 */
	public static function get_conditionals() {
		return [ Front_End_Conditional::class ];
	}

	/**
	 * BbPress constructor.
	 *
	 * @codeCoverageIgnore It only sets dependencies.
	 *
	 * @param Options_Helper $options The options helper.
	 */
	public function __construct( Options_Helper $options ) {
		$this->options = $options;
	}

	/**
	 * @inheritDoc
	 */
	public function register_hooks() {
		if ( $this->options->get( 'breadcrumbs-enable' ) !== true ) {
			return;
		}

		/**
		 * If breadcrumbs are active (which they supposedly are if the users has enabled this settings,
		 * there's no reason to have bbPress breadcrumbs as well.
		 *
		 * {@internal The class itself is only loaded when the template tag is encountered
		 *            via the template tag function in the wpseo-functions.php file.}}
		 */
		add_filter( 'bbp_get_breadcrumb', '__return_false' );
	}
}

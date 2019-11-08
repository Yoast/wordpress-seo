<?php
/**
 * WPSEO plugin file.
 *
 * @package Yoast\WP\Free\Integrations\Third_Party
 */

namespace Yoast\WP\Free\Integrations\Third_Party;

use Yoast\WP\Free\Conditionals\Front_End_Conditional;
use Yoast\WP\Free\Helpers\Options_Helper;
use Yoast\WP\Free\Integrations\Integration_Interface;

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
	 * @codeCoverageIgnore
	 * @inheritDoc
	 */
	public static function get_conditionals() {
		return [ Front_End_Conditional::class ];
	}

	/**
	 * BbPress constructor.
	 *
	 * @codeCoverageIgnore
	 *
	 * @param Options_Helper $options The options helper.
	 */
	public function __construct( Options_Helper $options ) {
		$this->options = $options;
	}

	/**
	 * @codeCoverageIgnore
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

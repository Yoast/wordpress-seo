<?php
/**
 * Backwards compatibility class for WPSEO_Frontend.
 *
 * @package Yoast\YoastSEO\Backwards_Compatibility
 */

use Yoast\WP\Free\Initializers\Initializer_Interface;
use Yoast\WP\Free\Memoizer\Meta_Tags_Context_Memoizer;
use Yoast\WP\Free\Presenters\Canonical_Presenter;

/**
 * Class WPSEO_Frontend
 */
class WPSEO_Frontend implements Initializer_Interface {
	/**
	 * Instance of this class.
	 *
	 * @var WPSEO_Frontend
	 */
	public static $instance;

	/**
	 * The memoizer for the meta tags context.
	 *
	 * @var Meta_Tags_Context_Memoizer
	 */
	private $context_memoizer;

	/**
	 * @inheritDoc
	 */
	public function initialize() {
		self::$instance = $this;
	}

	/**
	 * @inheritDoc
	 */
	public static function get_conditionals() {
		return [];
	}

	/**
	 * WPSEO_Breadcrumbs constructor.
	 *
	 * @param Meta_Tags_Context_Memoizer $context_memoizer The context memoizer.
	 */
	public function __construct( Meta_Tags_Context_Memoizer $context_memoizer ) {
		$this->context_memoizer = $context_memoizer;
	}

	/**
	 * Catches call to methods that don't exist and might deprecated.
	 *
	 * @param string $name      The called method.
	 * @param array  $arguments The given arguments.
	 */
	public function __call( $name, $arguments ) {
		_deprecated_function( $name, 'WPSEO xx.x' );

		return null;
	}

	/**
	 * Retrieves an instance of the class.
	 *
	 * @return WPSEO_Breadcrumbs The instance.
	 */
	public static function get_instance() {
		return self::$instance;
	}
}

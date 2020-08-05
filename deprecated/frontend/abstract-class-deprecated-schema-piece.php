<?php
/**
 * WPSEO plugin file.
 *
 * @package WPSEO\Frontend\Schema
 */

use Yoast\WP\SEO\Context\Meta_Tags_Context;
use Yoast\WP\SEO\Generators\Schema\Abstract_Schema_Piece;
use Yoast\WP\SEO\Memoizers\Meta_Tags_Context_Memoizer;
use Yoast\WP\SEO\Surfaces\Helpers_Surface;

/**
 * Returns schema Article data.
 *
 * @deprecated 14.0
 *
 * @since 10.2
 */
abstract class WPSEO_Deprecated_Graph_Piece implements WPSEO_Graph_Piece {

	/**
	 * The meta tags context.
	 *
	 * @var Meta_Tags_Context
	 */
	private $context;

	/**
	 * The helpers surface.
	 *
	 * @var Helpers_Surface
	 */
	public $helpers;

	/**
	 * The date helper.
	 *
	 * @var WPSEO_Date_Helper
	 */
	protected $date;

	/**
	 * The new stable piece.
	 *
	 * @var Abstract_Schema_Piece
	 */
	protected $stable;

	/**
	 * The stable class name.
	 *
	 * @var string
	 */
	protected $stable_class_name;

	/**
	 * WPSEO_Schema_Article constructor.
	 *
	 * @param string $class_name The class name.
	 *
	 * @codeCoverageIgnore
	 * @deprecated 14.0
	 */
	public function __construct( $class_name ) {
		$this->stable_class_name = $class_name;
		$this->stable            = new $class_name();

		_deprecated_function( __METHOD__, 'WPSEO 14.0', $this->stable_class_name );

		$memoizer = YoastSEO()->classes->get( Meta_Tags_Context_Memoizer::class );

		// We cannot extend the stable graph piece because a property was made public on it that was previously private.
		// So instead, we instantiate a stable graph piece and delegate to it.
		$this->context         = $memoizer->for_current_page();
		$this->stable->context = $this->context;
		$this->helpers         = YoastSEO()->helpers;
		$this->stable->helpers = $this->helpers;
	}

	/**
	 * Determines whether or not a piece should be added to the graph.
	 *
	 * @codeCoverageIgnore
	 * @deprecated 14.0
	 *
	 * @return bool
	 */
	public function is_needed() {
		_deprecated_function( __METHOD__, 'WPSEO 14.0', $this->stable_class_name . '::is_needed' );

		return $this->stable->is_needed();
	}

	/**
	 * Returns Article data.
	 *
	 * @codeCoverageIgnore
	 * @deprecated 14.0
	 *
	 * @return array $data Article data.
	 */
	public function generate() {
		_deprecated_function( __METHOD__, 'WPSEO 14.0', $this->stable_class_name . '::generate' );

		return $this->stable->generate();
	}
}

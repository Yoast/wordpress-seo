<?php
/**
 * Abstract presenter class for indexable presentations.
 *
 * @package Yoast\YoastSEO\Presenters
 */

namespace Yoast\WP\SEO\Presenters;

use WPSEO_Replace_Vars;
use Yoast\WP\SEO\Presentations\Indexable_Presentation;
use Yoast\WP\SEO\Surfaces\Helpers_Surface;

/**
 * Class Abstract_Indexable_Presenter
 */
abstract class Abstract_Indexable_Presenter extends Abstract_Presenter {

	/**
	 * The WPSEO Replace Vars object.
	 *
	 * @var WPSEO_Replace_Vars
	 */
	public $replace_vars;

	/**
	 * The indexable presentation.
	 *
	 * @var Indexable_Presentation
	 */
	public $presentation;

	/**
	 * The helpers surface
	 *
	 * @var Helpers_Surface
	 */
	public $helpers;

	/**
	 * Gets the raw value of a presentation.
	 *
	 * @return string|array The raw value.
	 */
	abstract public function get();

	/**
	 * Replace replacement variables in a string.
	 *
	 * @param string $string The string.
	 *
	 * @return string The string with replacement variables replaced.
	 */
	protected function replace_vars( $string ) {
		return $this->replace_vars->replace( $string, $this->presentation->source );
	}
}

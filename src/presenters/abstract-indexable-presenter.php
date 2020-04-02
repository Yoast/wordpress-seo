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
abstract class Abstract_Indexable_Presenter {

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
	 * Presents a presentation.
	 *
	 * @codeCoverageIgnore There is nothing to test.
	 *
	 * @return string The template.
	 */
	public abstract function present();

	/**
	 * Replace replacement variables in a string.
	 *
	 * @param string $string The string.
	 *
	 * @codeCoverageIgnore Wrapper method.
	 *
	 * @return string The string with replacement variables replaced.
	 */
	protected function replace_vars( $string ) {
		return $this->replace_vars->replace( $string, $this->presentation->source );
	}
}

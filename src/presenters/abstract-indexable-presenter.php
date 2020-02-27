<?php
/**
 * Abstract presenter class for indexable presentations.
 *
 * @package Yoast\YoastSEO\Presenters
 */

namespace Yoast\WP\SEO\Presenters;

use WPSEO_Replace_Vars;
use Yoast\WP\SEO\Presentations\Indexable_Presentation;

/**
 * Class Abstract_Indexable_Presenter
 */
abstract class Abstract_Indexable_Presenter {

	/**
	 * The WPSEO Replace Vars object.
	 *
	 * @var WPSEO_Replace_Vars
	 */
	protected $replace_vars;

	/**
	 * Sets the replace vars helper, used by DI.
	 *
	 * @required
	 *
	 * @param \WPSEO_Replace_Vars $replace_vars The replace vars helper.
	 */
	public function set_replace_vars( WPSEO_Replace_Vars $replace_vars ) {
		$this->replace_vars = $replace_vars;
	}

	/**
	 * Presents a presentation.
	 *
	 * @param Indexable_Presentation $presentation The presentation to present.
	 *
	 * @return string The template.
	 */
	public abstract function present( Indexable_Presentation $presentation );

	/**
	 * Replace replacement variables in the meta description.
	 *
	 * @param string                 $meta_description The meta description.
	 * @param Indexable_Presentation $presentation     The presentation to present.
	 *
	 * @return string The meta description with replacement variables replaced.
	 */
	protected function replace_vars( $meta_description, Indexable_Presentation $presentation ) {
		return $this->replace_vars->replace( $meta_description, $presentation->source );
	}
}

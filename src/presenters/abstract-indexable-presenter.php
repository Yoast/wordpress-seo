<?php
/**
 * Abstract presenter class for indexable presentations.
 *
 * @package Yoast\YoastSEO\Presenters
 */

namespace Yoast\WP\Free\Presenters;

use WPSEO_Replace_Vars;
use Yoast\WP\Free\Presentations\Indexable_Presentation;

abstract class Abstract_Indexable_Presenter {

	/**
	 * @var WPSEO_Replace_Vars
	 */
	protected $replace_vars_helper;

	/**
	 * @required
	 *
	 * Sets the replace vars helper, used by DI.
	 *
	 * @param \WPSEO_Replace_Vars $replace_vars_helper The replace vars helper.
	 */
	public function set_replace_vars_helper( WPSEO_Replace_Vars $replace_vars_helper ) {
		$this->replace_vars_helper = $replace_vars_helper;
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
		return $this->replace_vars_helper->replace( $meta_description, $presentation->replace_vars_object );
	}
}

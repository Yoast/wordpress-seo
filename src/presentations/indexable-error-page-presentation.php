<?php
/**
 * Presentation object for indexables.
 *
 * @package Yoast\YoastSEO\Presentations
 */

namespace Yoast\WP\SEO\Presentations;

/**
 * Class Indexable_Error_Page_Presentation
 */
class Indexable_Error_Page_Presentation extends Indexable_Presentation {

	/**
	 * @inheritDoc
	 */
	public function generate_robots() {
		$robots = $this->get_base_robots();

		$robots['index'] = 'noindex';

		return $this->filter_robots( $robots );
	}

	/**
	 * @inheritDoc
	 */
	public function generate_title() {
		if ( $this->model->title ) {
			return $this->model->title;
		}

		return $this->options->get_title_default( 'title-404-wpseo' );
	}
}

<?php
/**
 * Presentation object for indexables.
 *
 * @package Yoast\YoastSEO\Presentations
 */

namespace Yoast\WP\Free\Presentations;

/**
 * Class Indexable_Search_Result_Page_Presentation
 */
class Indexable_Search_Result_Page_Presentation extends Indexable_Presentation {

	/**
	 * @inheritDoc
	 */
	public function generate_robots() {
		$robots = $this->robots_helper->get_base_values( $this->model );

		$robots['index'] = 'noindex';

		return $this->robots_helper->after_generate( $robots );
	}

	/**
	 * @inheritDoc
	 */
	public function generate_title() {
		if ( $this->model->title ) {
			return $this->model->title;
		}

		$title_option  = 'title-search-wpseo';

		return $this->options_helper->get_title_default( $title_option );
	}

	/**
	 * @inheritDoc
	 */
	public function generate_twitter_title() {
		return $this->title;
	}
}

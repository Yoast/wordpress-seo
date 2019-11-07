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

		return $this->options_helper->get_title_default( 'title-search-wpseo' );
	}

	/**
	 * @inheritDoc
	 */
	public function generate_twitter_title() {
		return $this->title;
	}

	/**
	 * @inheritDoc
	 */
	public function generate_og_url() {
		$search_query = \get_search_query();

		// Regex catches case when /search/page/N without search term is itself mistaken for search term.
		if ( ! empty( $search_query ) && ! preg_match( '|^page/\d+$|', $search_query ) ) {
			return get_search_link();
		}

		return '';
	}
}

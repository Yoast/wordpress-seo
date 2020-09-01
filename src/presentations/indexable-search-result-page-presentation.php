<?php

namespace Yoast\WP\SEO\Presentations;

/**
 * Class Indexable_Search_Result_Page_Presentation.
 *
 * Presentation object for indexables.
 */
class Indexable_Search_Result_Page_Presentation extends Indexable_Presentation {

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

		return $this->options->get_title_default( 'title-search-wpseo' );
	}

	/**
	 * @inheritDoc
	 */
	public function generate_twitter_title() {
		return $this->title;
	}

	/**
	 * Generates the open graph url.
	 *
	 * @return string The open graph url.
	 */
	public function generate_open_graph_url() {
		$search_query = \get_search_query();

		// Regex catches case when /search/page/N without search term is itself mistaken for search term.
		if ( ! empty( $search_query ) && ! \preg_match( '|^page/\d+$|', $search_query ) ) {
			return \get_search_link();
		}

		return '';
	}

	/**
	 * Generates the Open Graph type.
	 *
	 * @return string The Open Graph type.
	 */
	public function generate_open_graph_type() {
		return 'article';
	}
}

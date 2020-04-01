<?php
/**
 * Presentation object for indexables.
 *
 * @package Yoast\YoastSEO\Presentations
 */

namespace Yoast\WP\SEO\Presentations;

use Yoast\WP\SEO\Helpers\Pagination_Helper;

/**
 * Class Indexable_Static_Posts_Page_Presentation
 */
class Indexable_Static_Posts_Page_Presentation extends Indexable_Post_Type_Presentation {

	/**
	 * The pagination helper.
	 *
	 * @var Pagination_Helper
	 */
	protected $pagination;

	use Archive_Adjacent;

	/**
	 * @inheritDoc
	 */
	public function generate_canonical() {
		if ( $this->model->canonical ) {
			return $this->model->canonical;
		}

		$current_page = $this->pagination->get_current_archive_page_number();

		if ( $current_page > 1 ) {
			return $this->pagination->get_paginated_url( $this->model->permalink, $current_page );
		}

		return $this->model->permalink;
	}

	/**
	 * Generates the open graph url.
	 *
	 * @return string The open graph url.
	 */
	public function generate_open_graph_url() {
		return $this->model->permalink;
	}
}

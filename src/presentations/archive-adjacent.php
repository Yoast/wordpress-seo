<?php
/**
 * Presentation object for indexables.
 *
 * @package Yoast\YoastSEO\Presentations
 */

namespace Yoast\WP\Free\Presentations;

use Yoast\WP\Free\Helpers\Pagination_Helper;

/**
 * Class Archive_Adjacent
 *
 * @property \Yoast\WP\Free\Helpers\Current_Page_Helper $current_page The current page helper.
 * @property \Yoast\WP\Free\Models\Indexable            $model        The indexable.
 */
trait Archive_Adjacent {

	/**
	 * Holds the Pagination_Helper instance.
	 *
	 * @var Pagination_Helper
	 */
	protected $pagination;

	/**
	 * Sets the helpers for the trait.
	 *
	 * @required
	 *
	 * @param Pagination_Helper $pagination The pagination helper.
	 *
	 * @codeCoverageIgnore
	 */
	public function set_archive_adjacent_helpers( Pagination_Helper $pagination ) {
		$this->pagination = $pagination;
	}

	/**
	 * @inheritDoc
	 */
	public function generate_rel_prev() {
		if ( $this->pagination->is_rel_adjacent_disabled() ) {
			return '';
		}

		$current_page = \max( 1, $this->current_page->get_current_archive_page_number() );
		// Check if there is a previous page.
		if ( $current_page === 1 ) {
			return '';
		}
		// Check if the previous page is the first page.
		if ( $current_page === 2 ) {
			return $this->model->permalink;
		}

		return $this->pagination->get_paginated_url( $this->model->permalink, ( $current_page - 1 ) );
	}

	/**
	 * @inheritDoc
	 */
	public function generate_rel_next() {
		if ( $this->pagination->is_rel_adjacent_disabled() ) {
			return '';
		}

		$current_page = \max( 1, $this->current_page->get_current_archive_page_number() );
		if ( $this->pagination->get_number_of_archive_pages() <= $current_page ) {
			return '';
		}

		return $this->pagination->get_paginated_url( $this->model->permalink, ( $current_page + 1 ) );
	}
}

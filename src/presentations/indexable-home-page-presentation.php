<?php
/**
 * Presentation object for indexables.
 *
 * @package Yoast\YoastSEO\Presentations
 */

namespace Yoast\WP\Free\Presentations;

use Yoast\WP\Free\Helpers\Rel_Adjacent_Helper;

/**
 * Class Indexable_Presentation
 */
class Indexable_Home_Page_Presentation extends Indexable_Presentation {

	/**
	 * Holds the Rel_Adjacent_Helper instance.
	 *
	 * @var Rel_Adjacent_Helper
	 */
	protected $rel_adjacent;

	/**
	 * Indexable_Date_Archive_Presentation constructor.
	 *
	 * @param Rel_Adjacent_Helper $rel_adjacent The rel adjacent helper.
	 *
	 * @codeCoverageIgnore
	 */
	public function __construct(
		Rel_Adjacent_Helper $rel_adjacent
	) {
		$this->rel_adjacent = $rel_adjacent;
	}

	/**
	 * @inheritDoc
	 */
	public function generate_canonical() {
		if ( $this->model->canonical ) {
			return $this->model->canonical;
		}

		if ( ! $this->model->permalink ) {
			return '';
		}

		$current_page = $this->current_page->get_current_archive_page();
		if ( $current_page > 1 ) {
			return $this->rel_adjacent->get_paginated_url( $this->model->permalink, $current_page );
		}

		return $this->model->permalink;
	}

	/**
	 * @inheritDoc
	 */
	public function generate_meta_description() {
		if ( $this->model->description ) {
			return $this->model->description;
		}

		return $this->options_helper->get( 'metadesc-home-wpseo' );
	}

	/**
	 * @inheritDoc
	 */
	public function generate_title() {
		if ( $this->model->title ) {
			return $this->model->title;
		}

		return $this->options_helper->get_title_default( 'title-home-wpseo' );
	}
}

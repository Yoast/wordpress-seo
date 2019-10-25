<?php
/**
 * Presentation object for indexables.
 *
 * @package Yoast\YoastSEO\Presentations
 */

namespace Yoast\WP\Free\Presentations;

use Yoast\WP\Free\Helpers\Rel_Adjacent_Helper;

/**
 * Class Indexable_Post_Type_Archive_Presentation
 */
class Indexable_Post_Type_Archive_Presentation extends Indexable_Presentation {

	/**
	 * Holds the rel adjacent helper instance.
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
	public function generate_robots() {
		$robots = $this->robots_helper->get_base_values( $this->model );

		if ( $this->options_helper->get( 'noindex-ptarchive-' . $this->model->object_sub_type, false ) ) {
			$robots['index'] = 'noindex';
		}

		return $this->robots_helper->after_generate( $robots );
	}

	/**
	 * @inheritDoc
	 */
	public function generate_title() {
		if ( $this->model->title ) {
			return $this->model->title;
		}

		$post_type = $this->model->object_sub_type;
		$title     = $this->options_helper->get_title_default( 'title-ptarchive-' . $post_type );

		return $title;
	}
}

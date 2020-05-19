<?php
/**
 * Presentation object for indexables.
 *
 * @package Yoast\YoastSEO\Presentations
 */

namespace Yoast\WP\SEO\Presentations;

/**
 * Class Indexable_Post_Type_Archive_Presentation
 */
class Indexable_Post_Type_Archive_Presentation extends Indexable_Presentation {
	use Archive_Adjacent;

	/**
	 * @inheritDoc
	 */
	public function generate_canonical() {
		if ( ! $this->model->permalink ) {
			return '';
		}

		$current_page = $this->pagination->get_current_archive_page_number();
		if ( $current_page > 1 ) {
			return $this->pagination->get_paginated_url( $this->model->permalink, $current_page );
		}

		return $this->model->permalink;
	}

	/**
	 * @inheritDoc
	 */
	public function generate_robots() {
		$robots = $this->get_base_robots();

		if ( $this->options->get( 'noindex-ptarchive-' . $this->model->object_sub_type, false ) ) {
			$robots['index'] = 'noindex';
		}

		return $this->filter_robots( $robots );
	}

	/**
	 * @inheritDoc
	 */
	public function generate_title() {
		if ( $this->model->title ) {
			return $this->model->title;
		}

		$post_type = $this->model->object_sub_type;
		$title     = $this->options->get_title_default( 'title-ptarchive-' . $post_type );

		return $title;
	}

	/**
	 * @inheritDoc
	 */
	public function generate_source() {
		return [ 'post_type' => $this->model->object_sub_type ];
	}
}

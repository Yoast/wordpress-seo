<?php
/**
 * Presentation object for indexables.
 *
 * @package Yoast\YoastSEO\Presentations
 */

namespace Yoast\WP\Free\Presentations;

/**
 * Class Indexable_Presentation
 */
class Indexable_Post_Type_Archive_Presentation extends Indexable_Presentation {

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

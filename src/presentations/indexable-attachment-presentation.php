<?php
/**
 * Presentation object for indexables.
 *
 * @package Yoast\YoastSEO\Presentations
 */

namespace Yoast\WP\Free\Presentations;

/**
 * Class Indexable_Attachment_Presentation
 */
class Indexable_Attachment_Presentation extends Indexable_Post_Type_Presentation {

	/**
	 * @inheritDoc
	 */
	public function generate_twitter_image() {
		if ( $this->model->twitter_image ) {
			return $this->model->twitter_image;
		}

		// When OpenGraph image is set and the OpenGraph feature is enabled.
		if ( $this->model->og_image && $this->options_helper->get( 'opengraph' ) === true ) {
			return $this->model->og_image;
		}

		$image_url = $this->image_helper->get_attachment_image( $this->model->object_id );
		if ( $image_url ) {
			return $image_url;
		}

		return (string) $this->get_default_og_image();
	}
}

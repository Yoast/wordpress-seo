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
	 * Generates the open graph images.
	 *
	 * @return array The open graph images.
	 */
	public function generate_og_images() {
		if ( $this->model->og_image_id === null && $this->model->og_image ) {
			return [ $this->model->og_image ];
		}

		if ( $this->model->og_image_id ) {
			$attachment = $this->get_attachment_url_by_id( $this->model->og_image_id );
			if ( $attachment ) {
				return [ $attachment ];
			}
		}

		if ( \wp_attachment_is_image( $this->model->object_id ) ) {
			$attachment_image_url = $this->get_attachment_url_by_id( $this->model->object_id );
			if ( $attachment_image_url ) {
				return [ $attachment_image_url ];
			}
		}

		$default_image = $this->get_default_og_image();
		if ( $default_image ) {
			return [ $default_image ];
		}

		return [];
	}

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

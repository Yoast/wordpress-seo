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
class Indexable_Home_Page_Presentation extends Indexable_Presentation {

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
	public function generate_og_images() {
		$images = parent::generate_og_images();

		if ( ! empty( $images ) ) {
			return $images;
		}

		$frontpage_image_id  = $this->options_helper->get( 'og_frontpage_image_id' );
		if ( $frontpage_image_id ) {
			$attachment_url = $this->get_attachment_url_by_id( $this->model->og_image_id );
			if ( $attachment_url ) {
				return [ $attachment_url ];
			}
		}

		$frontpage_image_url = $this->options_helper->get( 'og_frontpage_image' );
		if ( $frontpage_image_url ) {
			return [ $frontpage_image_url ];
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
		$twitter_image = parent::generate_twitter_image();

		if ( $twitter_image ) {
			return $twitter_image;
		}

		// When OpenGraph image is set and the OpenGraph feature is enabled.
		if ( $this->model->og_image && $this->options_helper->get( 'opengraph' ) === true ) {
			return $this->model->og_image;
		}

		return (string) $this->get_default_og_image();
	}
}

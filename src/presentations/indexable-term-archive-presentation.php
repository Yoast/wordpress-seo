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
class Indexable_Term_Archive_Presentation extends Indexable_Presentation {

	/**
	 * @inheritDoc
	 */
	public function generate_meta_description() {
		if ( $this->model->description ) {
			return $this->model->description;
		}

		return $this->options_helper->get( 'metadesc-tax-' . $this->model->object_sub_type );
	}

	/**
	 * @inheritDoc
	 */
	public function generate_replace_vars_object() {
		return \get_term( $this->model->object_id, $this->model->object_sub_type );
	}

	/**
	 * @inheritDoc
	 */
	public function generate_twitter_description() {
		$twitter_description = parent::generate_twitter_description();

		if ( $twitter_description ) {
			return $twitter_description;
		}

		$excerpt = \wp_strip_all_tags( \term_description( $this->model->object_id ) );
		if ( $excerpt ) {
			return $excerpt;
		}

		return '';
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

		/**
		 * Filter: wpseo_twitter_taxonomy_image - Allow developers to set a custom Twitter image for taxonomies.
		 *
		 * @api bool|string $unsigned Return string to supply image to use, false to use no image.
		 */
		$twitter_image = \apply_filters( 'wpseo_twitter_taxonomy_image', false );
		if ( is_string( $twitter_image ) && $twitter_image !== '' ) {
			return $twitter_image;
		}

		return (string) $this->get_default_og_image();
	}
}

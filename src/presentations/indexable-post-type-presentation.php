<?php
/**
 * Presentation object for indexables.
 */

namespace Yoast\WP\Free\Presentations;

use Yoast\WP\Free\Helpers\Image_Helper;
use Yoast\WP\Free\Helpers\Options_Helper;

/**
 * Class Indexable_Presentation
 */
class Indexable_Post_Type_Presentation extends Indexable_Presentation {

	/**
	 * @var Image_Helper
	 */
	private $image_helper;

	/**
	 * @var Options_Helper
	 */
	private $options_helper;

	/**
	 * Indexable_Post_Type_Presentation constructor.
	 *
	 * @param Options_Helper $options_helper
	 * @param Image_Helper   $image_helper
	 */
	public function __construct(
		Options_Helper $options_helper,
		Image_Helper $image_helper
	) {
		$this->options_helper = $options_helper;
		$this->image_helper   = $image_helper;
	}

	/**
	 * @inheritDoc
	 */
	public function generate_title() {
		if ( $this->model->title ) {
			return $this->model->title;
		}

		return $this->options_helper->get( 'title-' . $this->model->object_sub_type );
	}

	/**
	 * @inheritDoc
	 */
	public function generate_meta_description() {
		if ( $this->model->description ) {
			return $this->model->description;
		}

		return $this->options_helper->get( 'metadesc-' . $this->model->object_sub_type );
	}

	/**
	 * @inheritDoc
	 */
	public function generate_og_type() {
		return 'article';
	}

	/**
	 * @inheritDoc
	 */
	public function generate_replace_vars_object() {
		return \get_post( $this->model->object_id );
	}

	/**
	 * @inheritDoc
	 */
	public function generate_twitter_image() {
		$twitter_image = parent::generate_twitter_image();

		if ( $twitter_image ) {
			return $twitter_image;
		}

		// When OpenGraph is disabled just return empty string.
		if ( ! $this->options_helper->get( 'opengraph' ) !== true ) {
			return '';
		}

		if ( ! empty( $this->og_images ) ) {
			return \reset( $this->og_images );
		}

		$image_url = $this->image_helper->get_attachment_image( $this->model->object_id );
		if ( $image_url ) {
			return $image_url;
		}

		$image_url = $this->image_helper->get_featured_image( $this->model->object_id );
		if ( $image_url ) {
			return $image_url;
		}

		$image_url = $this->image_helper->get_gallery_image( $this->model->object_id );
		if ( $image_url ) {
			return $image_url;
		}

		$image_url = $this->image_helper->get_post_content_image( $this->model->object_id );
		if ( $image_url ) {
			return $image_url;
		}

		// When image is empty just retrieve the sitewide default.
		return (string) $this->options_helper->get( 'og_default_image', '' );
	}
}

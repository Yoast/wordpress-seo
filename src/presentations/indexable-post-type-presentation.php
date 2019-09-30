<?php
/**
 * Presentation object for indexables.
 *
 * @package Yoast\YoastSEO\Presentations
 */

namespace Yoast\WP\Free\Presentations;

use Yoast\WP\Free\Helpers\Meta_Helper;
use Yoast\WP\Free\Helpers\Image_Helper;
use Yoast\WP\Free\Helpers\Options_Helper;
use Yoast\WP\Free\Helpers\Post_Type_Helper;

/**
 * Class Indexable_Presentation
 */
class Indexable_Post_Type_Presentation extends Indexable_Presentation {

	/**
	 * @var Image_Helper
	 */
	protected $image_helper;

	/**
	 * @var Options_Helper
	 */
	protected $options_helper;

	/**
	 * @var Post_Type_Helper
	 */
	protected $post_type_helper;

	/**
	 * @var Meta_Helper
	 */
	protected $meta_helper;

	/**
	 * Indexable_Post_Type_Presentation constructor.
	 *
	 * @param Options_Helper   $options_helper   The options helper.
	 * @param Post_Type_Helper $post_type_helper The post type helper.
	 * @param Meta_Helper      $meta_helper      The meta helper.
	 * @param Image_Helper     $image_helper     The image helper.
	 */
	public function __construct(
		Options_Helper $options_helper,
		Post_Type_Helper $post_type_helper,
		Meta_Helper $meta_helper,
		Image_Helper $image_helper
	) {
		$this->options_helper   = $options_helper;
		$this->post_type_helper = $post_type_helper;
		$this->meta_helper      = $meta_helper;
		$this->image_helper     = $image_helper;
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
	public function generate_twitter_title() {
		if ( $this->model->twitter_title ) {
			return $this->model->twitter_title;
		}

		$title = $this->meta_helper->get_value( 'twitter-title', $this->current_page_helper->get_simple_page_id() );
		if ( ! is_string( $title ) ) {
			return '';
		}

		return $this->title;
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
	public function generate_robots() {
		$robots = array_merge(
			$this->robots_helper->get_base_values( $this->model ),
			[
				'noimageindex' => ( $this->model->is_robots_noimageindex === true ) ? 'noimageindex' : null,
				'noarchive'    => ( $this->model->is_robots_noarchive === true ) ? 'noarchive' : null,
				'nosnippet'    => ( $this->model->is_robots_nosnippet === true ) ? 'nosnippet' : null,
			]
		);

		$private           = \get_post_status( $this->model->object_id ) === 'private';
		$post_type_noindex = ! $this->post_type_helper->is_indexable( $this->model->object_id );

		if ( $private || $post_type_noindex ) {
			$robots['index'] = 'noindex';
		}

		return $this->robots_helper->after_generate( $robots );
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

		$image_url = $this->image_helper->get_attachment_image( $this->model->object_id );
		if ( $image_url ) {
			return $image_url;
		}

		/**
		 * Filter: 'wpseo_twitter_image_size' - Allow changing the Twitter Card image size.
		 *
		 * @api string $featured_img Image size string.
		 */
		$image_size = \apply_filters( 'wpseo_twitter_image_size', 'full' );
		$image_url  = $this->image_helper->get_featured_image( $this->model->object_id, $image_size );
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

		if ( $this->options_helper->get( 'opengraph' ) === true ) {
			return (string) $this->options_helper->get( 'og_default_image', '' );
		}

		return '';
	}
}

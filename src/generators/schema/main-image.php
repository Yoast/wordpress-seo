<?php
/**
 * WPSEO plugin file.
 *
 * @package Yoast\WP\SEO\Generators\Schema
 */

namespace Yoast\WP\SEO\Generators\Schema;

use Yoast\WP\SEO\Context\Meta_Tags_Context;
use Yoast\WP\SEO\Helpers\Image_Helper;
use Yoast\WP\SEO\Helpers\Schema;

/**
 * Returns ImageObject schema data.
 */
class Main_Image extends Abstract_Schema_Piece {

	/**
	 * The image helper.
	 *
	 * @var Image_Helper
	 */
	private $image;

	/**
	 * The Schema image helper.
	 *
	 * @var Schema\Image_Helper
	 */
	private $schema_image;

	/**
	 * Main_Image constructor.
	 *
	 * @param Image_Helper        $image        The image helper.
	 * @param Schema\Image_Helper $schema_image The schema image helper.
	 */
	public function __construct(
		Image_Helper $image,
		Schema\Image_Helper $schema_image
	) {
		$this->image        = $image;
		$this->schema_image = $schema_image;
	}

	/**
	 * Determines whether or not a piece should be added to the graph.
	 *
	 * @param Meta_Tags_Context $context The meta tags context.
	 *
	 * @return bool
	 */
	public function is_needed( Meta_Tags_Context $context ) {
		return $context->indexable->object_type === 'post';
	}

	/**
	 * Adds a main image for the current URL to the schema if there is one.
	 *
	 * This can be either the featured image, or fall back to the first image in the content of the page.
	 *
	 * @param Meta_Tags_Context $context The meta tags context.
	 *
	 * @return false|array $data Image Schema.
	 */
	public function generate( Meta_Tags_Context $context ) {
		$image_id = $context->canonical . $this->id->primary_image_hash;

		$image_schema = $this->get_featured_image( $context->id, $image_id );

		if ( $image_schema === null ) {
			$image_schema = $this->get_first_content_image( $context->id, $image_id );
		}

		if ( $image_schema === null ) {
			return false;
		}

		$context->has_image = true;

		return $image_schema;
	}

	/**
	 * Gets the image schema for the web page based on the featured image.
	 *
	 * @param int    $post_id  The post id.
	 * @param string $image_id The image schema id.
	 *
	 * @return array|null The image schema object or null if there is no featured image.
	 */
	private function get_featured_image( $post_id, $image_id ) {
		if ( ! \has_post_thumbnail( $post_id ) ) {
			return null;
		}

		return $this->schema_image->generate_from_attachment_id( $image_id, \get_post_thumbnail_id( $post_id ) );
	}

	/**
	 * Gets the image schema for the web page based on the first content image image.
	 *
	 * @param int    $post_id  The post id.
	 * @param string $image_id The image schema id.
	 *
	 * @return array|null The image schema object or null if there is no image in the content.
	 */
	private function get_first_content_image( $post_id, $image_id ) {
		$image_url = $this->image->get_post_content_image( $post_id );

		if ( $image_url === '' ) {
			return null;
		}

		return $this->schema_image->generate_from_url( $image_id, $image_url );
	}
}

<?php
/**
 * WPSEO plugin file.
 *
 * @package WPSEO\Frontend\Schema
 */

use Yoast\WP\SEO\Generators\Schema\Main_Image;

/**
 * Returns ImageObject schema data.
 *
 * @since      11.5
 * @deprecated 14.0
 * @codeCoverageIgnore
 */
class WPSEO_Schema_MainImage extends WPSEO_Deprecated_Graph_Piece {

	/**
	 * WPSEO_Schema_WebPage constructor.
	 *
	 * @deprecated 14.0
	 * @codeCoverageIgnore
	 *
	 * @param null $context The context. No longer used but present for BC.
	 */
	public function __construct( $context = null ) {
		parent::__construct( Main_Image::class );
	}

	/**
	 * Gets the post's first usable content image. Null if none is available.
	 *
	 * @deprecated 14.0
	 * @codeCoverageIgnore
	 *
	 * @param int $post_id The post id.
	 *
	 * @return string|null The image URL or null if there is no image.
	 */
	protected function get_first_usable_content_image_for_post( $post_id ) {
		_deprecated_function( __METHOD__, 'WPSEO 14.0' );

		return WPSEO_Image_Utils::get_first_usable_content_image_for_post( $post_id );
	}

	/**
	 * Generates image schema from the attachment id.
	 *
	 * @deprecated 14.0
	 * @codeCoverageIgnore
	 *
	 * @param string $image_id The image schema id.
	 *
	 * @return array Schema ImageObject array.
	 */
	protected function generate_image_schema_from_attachment_id( $image_id ) {
		_deprecated_function( __METHOD__, 'WPSEO 14.0', 'YoastSEO()->helpers->schema->image->generate_from_attachment_id' );

		return $this->helpers->schema->image->generate_from_attachment_id( $image_id, get_post_thumbnail_id() );
	}

	/**
	 * Generates image schema from the url.
	 *
	 * @deprecated 14.0
	 * @codeCoverageIgnore
	 *
	 * @param string $image_id  The image schema id.
	 * @param string $image_url The image URL.
	 *
	 * @return array Schema ImageObject array.
	 */
	protected function generate_image_schema_from_url( $image_id, $image_url ) {
		_deprecated_function( __METHOD__, 'WPSEO 14.0', 'YoastSEO()->helpers->schema->image->generate_from_url' );

		return $this->helpers->schema->image->generate_from_url( $image_id, $image_url );
	}
}

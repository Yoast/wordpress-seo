<?php
/**
 * WPSEO plugin file.
 *
 * @package WPSEO\Frontend\Schema
 */

use Yoast\WP\SEO\Generators\Schema\Main_Image;
use Yoast\WP\SEO\Memoizers\Meta_Tags_Context_Memoizer;

/**
 * Returns ImageObject schema data.
 *
 * @codeCoverageIgnore
 * @deprecated 14.0
 *
 * @since 11.5
 */
class WPSEO_Schema_MainImage extends Main_Image implements WPSEO_Graph_Piece {

	/**
	 * WPSEO_Schema_WebPage constructor.
	 *
	 * @param null $context The context. No longer used but present for BC.
	 *
	 * @codeCoverageIgnore
	 * @deprecated 14.0
	 */
	public function __construct( $context = null ) {
		_deprecated_function( __METHOD__, 'WPSEO 14.0', 'Yoast\WP\SEO\Generators\Schema\Main_Image' );

		$memoizer      = YoastSEO()->classes->get( Meta_Tags_Context_Memoizer::class );
		$this->context = $memoizer->for_current_page();
		$this->helpers = YoastSEO()->helpers;
	}

	/**
	 * Determines whether or not a piece should be added to the graph.
	 *
	 * @codeCoverageIgnore
	 * @deprecated 14.0
	 *
	 * @return bool
	 */
	public function is_needed() {
		_deprecated_function( __METHOD__, 'WPSEO 14.0', 'Yoast\WP\SEO\Generators\Schema\Main_Image::is_needed' );

		return parent::is_needed();
	}

	/**
	 * Adds a main image for the current URL to the schema if there is one.
	 *
	 * This can be either the featured image, or fall back to the first image in the content of the page.
	 *
	 * @codeCoverageIgnore
	 * @deprecated 14.0
	 *
	 * @return false|array $data Image Schema.
	 */
	public function generate() {
		_deprecated_function( __METHOD__, 'WPSEO 14.0', 'Yoast\WP\SEO\Generators\Schema\Main_Image::generate' );

		return parent::generate();
	}

	/**
	 * Gets the post's first usable content image. Null if none is available.
	 *
	 * @codeCoverageIgnore
	 * @deprecated 14.0
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
	 * @codeCoverageIgnore
	 * @deprecated 14.0
	 *
	 * @param string $image_id The image schema id.
	 *
	 * @return array Schema ImageObject array.
	 */
	protected function generate_image_schema_from_attachment_id( $image_id ) {
		_deprecated_function( __METHOD__, 'WPSEO 14.0', 'YoastSEO()->helpers->schema->image->generate_from_attachment_id' );

		return $this->helpers->schema->image->generate_from_attachment_id( $image_id, \get_post_thumbnail_id() );
	}

	/**
	 * Generates image schema from the url.
	 *
	 * @codeCoverageIgnore
	 * @deprecated 14.0
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

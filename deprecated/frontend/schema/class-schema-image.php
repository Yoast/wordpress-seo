<?php
/**
 * WPSEO plugin file.
 *
 * @package WPSEO\Frontend\Schema
 */

/**
 * Returns schema image data.
 *
 * @since 11.1
 *
 * @deprecated 14.0
 *
 * @property string $schema_id      The `@id` to use for the returned image.
 * @property array  $data           The ImageObject Schema array.
 * @property int    $attachment_id  The ID of the attachment used to generate the object.
 */
class WPSEO_Schema_Image {

	/**
	 * Value to use as the image id.
	 *
	 * @var string
	 */
	private $schema_id;

	/**
	 * WPSEO_Schema_Image constructor.
	 *
	 * @codeCoverageIgnore
	 * @deprecated 14.0
	 *
	 * @param string $schema_id The string to use in an image's `@id`.
	 */
	public function __construct( $schema_id ) {
		_deprecated_function( __METHOD__, 'WPSEO 14.0', 'YoastSEO()->helpers->schema->image' );
		$this->schema_id = $schema_id;
	}

	/**
	 * Find an image based on its URL and generate a Schema object for it.
	 *
	 * @codeCoverageIgnore
	 * @deprecated 14.0
	 *
	 * @param string $url     The image URL to base our object on.
	 * @param string $caption An optional caption.
	 *
	 * @return array Schema ImageObject array.
	 */
	public function generate_from_url( $url, $caption = '' ) {
		_deprecated_function( __METHOD__, 'WPSEO 14.0', 'YoastSEO()->helpers->schema->image->generate_from_url' );
		return YoastSEO()->helpers->schema->image->generate_from_url( $this->schema_id, $url, $caption );
	}

	/**
	 * Retrieve data about an image from the database and use it to generate a Schema object.
	 *
	 * @codeCoverageIgnore
	 * @deprecated 14.0
	 *
	 * @param int    $attachment_id The attachment to retrieve data from.
	 * @param string $caption       The caption string, if there is one.
	 *
	 * @return array Schema ImageObject array.
	 */
	public function generate_from_attachment_id( $attachment_id, $caption = '' ) {
		_deprecated_function( __METHOD__, 'WPSEO 14.0', 'YoastSEO()->helpers->schema->image->generate_from_attachment_id' );
		return YoastSEO()->helpers->schema->image->generate_from_attachment_id( $this->schema_id, $attachment_id, $caption );
	}

	/**
	 * If we can't find $url in our database, we output a simple ImageObject.
	 *
	 * @codeCoverageIgnore
	 * @deprecated 14.0
	 *
	 * @param string $url     The image URL.
	 * @param string $caption A caption, if set.
	 *
	 * @return array $data Schema ImageObject array.
	 */
	public function simple_image_object( $url, $caption = '' ) {
		_deprecated_function( __METHOD__, 'WPSEO 14.0', 'YoastSEO()->helpers->schema->image->simple_image_object' );
		return YoastSEO()->helpers->schema->image->simple_image_object( $this->schema_id, $url, $caption );
	}
}

<?php
/**
 * WPSEO plugin file.
 *
 * @package WPSEO\Frontend\Schema
 */

use Yoast\WP\SEO\Helpers\Schema\Image_Helper;

/**
 * Returns schema image data.
 *
 * @since 11.1
 *
 * @deprecated xx.x
 *
 * @property string $schema_id      The `@id` to use for the returned image.
 * @property array  $data           The ImageObject Schema array.
 * @property int    $attachment_id  The ID of the attachment used to generate the object.
 */
class WPSEO_Schema_Image {

	/**
	 * The image helper.
	 *
	 * @var Image_Helper
	 */
	private $image;

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
	 * @deprecated xx.x
	 *
	 * @param string $schema_id The string to use in an image's `@id`.
	 */
	public function __construct( $schema_id ) {
		_deprecated_function( __METHOD__, 'WPSEO xx.x', 'Yoast\WP\SEO\Helpers\Schema\Image_Helper' );

		$this->schema_id = $schema_id;
		$this->image     = YoastSEO()->classes->get( Image_Helper::class );
	}

	/**
	 * Find an image based on its URL and generate a Schema object for it.
	 *
	 * @codeCoverageIgnore
	 * @deprecated xx.x
	 *
	 * @param string $url     The image URL to base our object on.
	 * @param string $caption An optional caption.
	 *
	 * @return array Schema ImageObject array.
	 */
	public function generate_from_url( $url, $caption = '' ) {
		_deprecated_function( __METHOD__, 'WPSEO xx.x', 'Yoast\WP\SEO\Helpers\Schema\Image_Helper::generate_from_url' );

		return $this->image->generate_from_url( $this->schema_id, $url, $caption );
	}

	/**
	 * Retrieve data about an image from the database and use it to generate a Schema object.
	 *
	 * @codeCoverageIgnore
	 * @deprecated xx.x
	 *
	 * @param int    $attachment_id The attachment to retrieve data from.
	 * @param string $caption       The caption string, if there is one.
	 *
	 * @return array Schema ImageObject array.
	 */
	public function generate_from_attachment_id( $attachment_id, $caption = '' ) {
		_deprecated_function( __METHOD__, 'WPSEO xx.x', 'Yoast\WP\SEO\Helpers\Schema\Image_Helper::generate_from_attachment_id' );

		return $this->image->generate_from_attachment_id( $this->schema_id, $attachment_id, $caption );
	}

	/**
	 * If we can't find $url in our database, we output a simple ImageObject.
	 *
	 * @codeCoverageIgnore
	 * @deprecated xx.x
	 *
	 * @param string $url     The image URL.
	 * @param string $caption A caption, if set.
	 *
	 * @return array $data Schema ImageObject array.
	 */
	public function simple_image_object( $url, $caption = '' ) {
		_deprecated_function( __METHOD__, 'WPSEO xx.x', 'Yoast\WP\SEO\Helpers\Schema\Image_Helper::simple_image_object' );

		return $this->image->simple_image_object( $this->schema_id, $url, $caption );
	}
}

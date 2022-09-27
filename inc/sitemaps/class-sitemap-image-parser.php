<?php
/**
 * WPSEO plugin file.
 *
 * @package WPSEO\XML_Sitemaps
 */

use Yoast\WP\SEO\Helpers\Image_Helper;
use Yoast\WP\SEO\Helpers\Url_Helper;

/**
 * Parses images from the given post.
 */
class WPSEO_Sitemap_Image_Parser {

	/**
	 * Holds the Image Helper.
	 *
	 * @var Image_Helper
	 */
	protected $image_helper;

	/**
	 * Holds the URL Helper.
	 *
	 * @var Url_Helper
	 */
	protected $url_helper;

	/**
	 * Set up URL properties for reuse.
	 */
	public function __construct() {
		$this->image_helper = YoastSEO()->helpers->image;
		$this->url_helper   = YoastSEO()->helpers->url;
	}

	/**
	 * Get the post images.
	 *
	 * Get the post thumbnail, images within the post content, images within galleries within the post content,
	 * and possibly the image if $post is an attachment.
	 *
	 * @param WP_Post $post The post to get images for.
	 * @return array An array of post images.
	 */
	public function get_images( $post ) {

		$images = [];

		if ( ! is_object( $post ) ) {
			return $images;
		}

		$thumbnail_id = get_post_thumbnail_id( $post->ID );
		if ( $thumbnail_id ) {
			$src      = $this->url_helper->ensure_absolute_url( $this->image_url( $thumbnail_id ) );
			$images[] = $this->get_image_item( $post, $src );
		}

		/**
		 * Filter: 'wpseo_sitemap_content_before_parse_html_images' - Filters the post content
		 * before it is parsed for images.
		 *
		 * @param string $content The raw/unprocessed post content.
		 */
		$content = apply_filters( 'wpseo_sitemap_content_before_parse_html_images', $post->post_content );

		$unfiltered_images = $this->image_helper->get_images_from_post_content( $content );

		foreach ( $unfiltered_images as $image ) {
			$images[] = $this->get_image_item( $post, $image->get_src() );
		}

		if ( $post->post_type === 'attachment' && wp_attachment_is_image( $post ) ) {
			$src      = $this->url_helper->ensure_absolute_url( $this->image_url( $post->ID ) );
			$images[] = $this->get_image_item( $post, $src );
		}

		foreach ( $images as $key => $image ) {

			if ( empty( $image['src'] ) ) {
				unset( $images[ $key ] );
			}
		}

		/**
		 * Filter images to be included for the post in XML sitemap.
		 *
		 * @param array $images  Array of image items.
		 * @param int   $post_id ID of the post.
		 */
		return apply_filters( 'wpseo_sitemap_urlimages', $images, $post->ID );
	}

	/**
	 * Get the images in the term description.
	 *
	 * @param object $term Term to get images from description for.
	 *
	 * @return array
	 */
	public function get_term_images( $term ) {
		$images = $this->image_helper->get_images_from_post_content( $term->description );
		return \array_map(
			function ( $image ) {
				return [ 'src' => $image->get_src() ];
			},
			$images
		);
	}

	/**
	 * Get image item array with filters applied.
	 *
	 * @param WP_Post $post Post object for the context.
	 * @param string  $src  Image URL.
	 *
	 * @return array The filtered image.
	 */
	protected function get_image_item( $post, $src ) {
		$image = [];

		/**
		 * Filter image URL to be included in XML sitemap for the post.
		 *
		 * @param string $src  Image URL.
		 * @param object $post Post object.
		 */
		$image['src'] = apply_filters( 'wpseo_xml_sitemap_img_src', $src, $post );

		/**
		 * Filter image data to be included in XML sitemap for the post.
		 *
		 * @param array  $image {
		 *     Array of image data.
		 *
		 *     @type string  $src   Image URL.
		 * }
		 *
		 * @param object $post  Post object.
		 */
		return apply_filters( 'wpseo_xml_sitemap_img', $image, $post );
	}

	/**
	 * Parse gallery shortcodes in a given content.
	 *
	 * @param string $content Content string.
	 * @param int    $post_id Optional. ID of post being parsed.
	 *
	 * @return array Set of attachment objects.
	 */
	protected function parse_galleries( $content, $post_id = 0 ) {
		return $this->image_helper->get_gallery_images_from_post_content( $content, $post_id );
	}

	/**
	 * Get attached image URL with filters applied.
	 *
	 * @param int $post_id ID of the post.
	 *
	 * @return string
	 */
	protected function image_url( $post_id ) {
		$src = $this->image_helper->image_url( $post_id );
		if ( is_null( $src ) ) {
			$src = '';
		}
		return \apply_filters( 'wp_get_attachment_url', $src, $post_id );
	}
}

<?php

namespace Yoast\WP\SEO\Helpers;

use Yoast\WP\SEO\Models\Indexable;
use Yoast\WP\SEO\Repositories\SEO_Links_Repository;

/**
 * A helper object for the user.
 */
class XML_Sitemap_Helper {

	/**
	 * The Links repository
	 *
	 * @var SEO_Links_Repository
	 */
	private $links_repository;

	/**
	 * The image helper.
	 *
	 * @var Image_Helper
	 */
	protected $image_helper;

	/**
	 * XML_Sitemap_Helper constructor.
	 *
	 * @param SEO_Links_Repository $links_repository The links repository.
	 * @param Image_Helper         $image_helper     The image helper.
	 */
	public function __construct(
		SEO_Links_Repository $links_repository,
		Image_Helper $image_helper
	) {
		$this->links_repository = $links_repository;
		$this->image_helper     = $image_helper;
	}

	/**
	 * Find images for a given set of indexables.
	 *
	 * @param Indexable[] $indexables Array of indexables.
	 * @param string      $type       The type of link to retrieve, defaults to image internal.
	 *
	 * @return array $images_by_id Array of images for the indexable, in XML sitemap format.
	 */
	public function find_images_for_indexables( $indexables, $type = 'image-in' ) {
		$images_by_id  = [];
		$indexable_ids = [];

		foreach ( $indexables as $indexable ) {
			$indexable_ids[ $indexable->object_id ] = $indexable->id;
		}

		if ( $indexable_ids === [] ) {
			return [];
		}

		$images = $this->links_repository
			->query()
			->select_many( 'indexable_id', 'url' )
			->where( 'type', $type )
			->where_in( 'indexable_id', array_values( $indexable_ids ) )
			->find_many();

		foreach ( $images as $image ) {
			if ( ! is_array( $images_by_id[ $image->indexable_id ] ) ) {
				$images_by_id[ $image->indexable_id ] = [];
			}
			$images_by_id[ $image->indexable_id ][] = [
				'src' => $image->url,
			];
		}

		// The featured image may not be in the links table. Make sure it is included in the image list.
		foreach ( $indexable_ids as $object_id => $indexable_id ) {
			if ( ! is_int( $object_id ) || $object_id <= 0 ) {
				continue;
			}

			$featured_image_link = $this->get_featured_image_link( $object_id );

			if ( is_null( $featured_image_link ) ) {
				continue;
			}

			if ( ! isset( $images_by_id[ $indexable_id ] ) ) {
				$images_by_id[ $indexable_id ] = [];
			}

			if ( ! in_array( $featured_image_link, $images_by_id[ $indexable_id ], true ) ) {
				$images_by_id[ $indexable_id ][] = $featured_image_link;

			}
		}
		return $images_by_id;
	}

	/**
	 * Gets the sitemap link for a post's featured image.
	 *
	 * @param int $post_id The id of the post.
	 *
	 * @return string[]|null The featured image link. Null if the post doesn't have a featured image.
	 */
	private function get_featured_image_link( $post_id ) {
		$link = $this->get_featured_image_source( $post_id );
		if ( ! $link ) {
			return null;
		}

		return [ 'src' => $link ];
	}

	/**
	 * Gets the source url for a post's featured image.
	 *
	 * @param int $post_id The id of the post.
	 *
	 * @return string|null The featured image source. Null if the post doesn't have a featured image.
	 */
	private function get_featured_image_source( $post_id ) {
		$featured_id = $this->image_helper->get_featured_image_id( $post_id );
		if ( ! $featured_id ) {
			return null;
		}

		$featured_image_source = $this->image_helper->get_attachment_image_source( $featured_id );

		if ( $featured_image_source === '' ) {
			return null;
		}

		return $featured_image_source;
	}

	/**
	 * Convert an array of indexables to an array that can be used by the XML sitemap renderer.
	 *
	 * @param Indexable[] $indexables  Array of indexables.
	 * @param string      $object_type The Indexable object type.
	 *
	 * @return array Array to be used by the XML sitemap renderer.
	 */
	public function convert_indexables_to_sitemap_links( $indexables, $object_type ) {
		/**
		 * Filter - Allows excluding images from the XML sitemap.
		 *
		 * @param bool $include True to include, false to exclude.
		 */
		$include_images = apply_filters( 'wpseo_xml_sitemap_include_images', true );

		if ( $include_images ) {
			$images_by_id = $this->find_images_for_indexables( $indexables );
		}

		$links = [];
		foreach ( $indexables as $indexable ) {
			$images = isset( $images_by_id[ $indexable->id ] ) ? $images_by_id[ $indexable->id ] : [];

			if ( $indexable->object_type === 'post' ) {
				/**
				 * Filter images to be included for the post in XML sitemap.
				 *
				 * @param array $images  Array of image items.
				 * @param int   $post_id ID of the post.
				 */
				$images = \apply_filters( 'wpseo_sitemap_urlimages', $images, $indexable->object_id );
			}

			$url = [
				'loc'    => $indexable->permalink,
				'mod'    => $indexable->object_last_modified,
				'images' => $images,
			];

			/**
			 * Filter URL entry before it gets added to the sitemap.
			 *
			 * @param array  $url       Array of URL parts.
			 * @param string $type      URL type.
			 * @param int    $object_id WordPress ID of the object.
			 */
			$url = apply_filters( 'wpseo_sitemap_entry', $url, $object_type, $indexable->object_id );

			$links[] = $url;
		}

		return $links;
	}
}

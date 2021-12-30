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
	 * XML_Sitemap_Helper constructor.
	 *
	 * @param SEO_Links_Repository $links_repository The links repository.
	 */
	public function __construct(
		SEO_Links_Repository $links_repository
	) {
		$this->links_repository = $links_repository;
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
			$indexable_ids[] = $indexable->id;
		}

		if ( $indexable_ids === [] ) {
			return [];
		}

		$images = $this->links_repository->query()
			->select_many( 'indexable_id', 'url' )
			->where( 'type', $type )
			->where_in( 'indexable_id', $indexable_ids )
			->find_many();

		foreach ( $images as $image ) {
			if ( ! is_array( $images_by_id[ $image->indexable_id ] ) ) {
				$images_by_id[ $image->indexable_id ] = [];
			}
			$images_by_id[ $image->indexable_id ][] = [
				'src' => $image->url,
			];
		}

		return $images_by_id;
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

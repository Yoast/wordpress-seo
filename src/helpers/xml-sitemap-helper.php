<?php

namespace Yoast\WP\SEO\Helpers;

use Yoast\WP\Lib\Model;
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
		global $wpdb;

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

		$placeholders    = \implode( ', ', \array_fill( 0, count( $indexable_ids ), '%s' ) );
		$indexable_table = Model::get_table_name( 'Indexable' );
		// phpcs:disable WordPress.DB.PreparedSQLPlaceholders.UnfinishedPrepare -- Placeholders are in $placeholders.
		// phpcs:disable WordPress.DB.PreparedSQL.InterpolatedNotPrepared -- Table names can not be prepared.
		// phpcs:disable WordPress.DB.DirectDatabaseQuery -- Query can not be done without a direct query.
		$featured_images = $wpdb->get_results(
			$wpdb->prepare(
				"
				SELECT pm.post_id, i.permalink
				FROM {$wpdb->prefix}postmeta AS pm
				INNER JOIN $indexable_table AS i ON i.object_id = pm.meta_value AND i.object_type = 'post'
				WHERE pm.meta_key = '_thumbnail_id' AND pm.post_id IN ( $placeholders )
				",
				\array_keys( $indexable_ids )
			)
		);
		// phpcs:enable

		foreach ( $featured_images as $featured_image ) {
			$indexable_id        = $indexable_ids[ $featured_image->post_id ];
			$featured_image_link = [ 'src' => $featured_image->permalink ];
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

			if ( $object_type === 'post' ) {
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

			if ( ! is_array( $url ) || ! isset( $url['loc'] ) ) {
				continue;
			}

			$links[] = $url;
		}

		return $links;
	}
}

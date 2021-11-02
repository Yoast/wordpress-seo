<?php

namespace Yoast\WP\SEO\Helpers;

use Yoast\WP\SEO\Models\Indexable;
use Yoast\WP\SEO\Repositories\SEO_Links_Repository;

/**
 * A helper object for the user.
 */
class XML_Sitemap_Helper {
	/**
	 * @var SEO_Links_Repository
	 */
	private $links_repository;

	/**
	 * XML_Sitemap_Helper constructor.
	 *
	 * @param SEO_Links_Repository $links_repository
	 */
	public function __construct(
		SEO_Links_Repository $links_repository
	) {
		$this->links_repository = $links_repository;
	}

	/**
	 * @param Indexable[] $indexables Array of indexables.
	 *
	 * @return array $images_by_id Array of images for the indexable, in XML sitemap format.
	 */
	public function find_images_for_links( $indexables, $type = 'image-in' ) {
		$images_by_id  = [];
		$indexable_ids = [];

		foreach ( $indexables as $indexable ) {
			$indexable_ids[] = $indexable->id;
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
				'src' => $image->url
			];
		}

		return $images_by_id;
	}

	/**
	 * @param $indexables
	 *
	 * @return array
	 */
	public function convert_indexables_to_sitemap_links( $indexables ) {
		/**
		 * Filter - Allows excluding images from the XML sitemap.
		 *
		 * @param bool $include True to include, false to exclude.
		 */
		$include_images = apply_filters( 'wpseo_xml_sitemap_include_images', true );

		if ( $include_images ) {
			$images_by_id = $this->find_images_for_links( $indexables );
		}

		$links = [];
		foreach ( $indexables as $indexable ) {
			$links[] = [
				'loc'    => $indexable->permalink,
				'mod'    => $indexable->object_last_modified,
				'images' => isset( $images_by_id[ $indexable->id ] ) ? $images_by_id[ $indexable->id ] : [],
			];
		}

		return $links;
	}
}


<?php

namespace Yoast\WP\SEO\Helpers;

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
	 * @param int[] $indexable_ids Array of indexable IDs.
	 *
	 * @return array $images_by_id Array of images for the indexable, in XML sitemap format.
	 */
	public function find_images_for_links( $indexable_ids, $type = 'image-in' ) {
		$images_by_id = [];

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
}


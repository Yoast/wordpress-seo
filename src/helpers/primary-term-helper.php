<?php
/**
 * Yoast SEO Plugin File.
 *
 * @package Yoast\YoastSEO\Config
 */

namespace Yoast\WP\Free\Helpers;

use Yoast\WP\Free\ORM\Repositories\Primary_Term_Repository;

class Primary_Term_Helper {

	/**
	 * @var Primary_Term_Repository
	 */
	protected $repository;

	/**
	 * Primary_Term_Helper constructor.
	 *
	 * @param Primary_Term_Repository $repository
	 */
	public function __construct( Primary_Term_Repository $repository ) {
		$this->repository = $repository;
	}

	/**
	 * Retrieves an indexable by a post ID and taxonomy.
	 *
	 * @param int    $post_id     The post the indexable is based upon.
	 * @param string $taxonomy    The taxonomy the indexable belongs to.
	 * @param bool   $auto_create Optional. Creates an indexable if it does not exist yet.
	 *
	 * @return bool|\Yoast\WP\Free\Models\Indexable Instance of indexable.
	 */
	public function find_by_postid_and_taxonomy( $post_id, $taxonomy, $auto_create = true ) {
		/** @var \Yoast\WP\Free\Models\Primary_Term $indexable */
		$indexable = $this->repository->where( 'post_id', $post_id )
									  ->where( 'taxonomy', $taxonomy )
									  ->find_one();

		if ( $auto_create && ! $indexable ) {
			$indexable = $this->repository->create();
		}

		return $indexable;
	}
}

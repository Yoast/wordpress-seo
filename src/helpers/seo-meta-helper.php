<?php
/**
 * Yoast SEO Plugin File.
 *
 * @package Yoast\YoastSEO\Config
 */

namespace Yoast\WP\Free\Helpers;

use Yoast\WP\Free\ORM\Repositories\SEO_Meta_Repository;

class SEO_Meta_Helper {

	/**
	 * @var SEO_Meta_Repository
	 */
	protected $repository;

	/**
	 * SEO_Meta_Helper constructor.
	 *
	 * @param SEO_Meta_Repository $repository
	 */
	public function __construct( SEO_Meta_Repository $repository ) {
		$this->repository = $repository;
	}

	/**
	 * Finds the SEO meta for given post.
	 *
	 * @param int $post_id The post ID.
	 *
	 * @return \Yoast\WP\Free\Models\SEO_Meta The SEO meta.
	 */
	public function find_by_post_id( $post_id ) {
		return $this->repository->where( 'object_id', $post_id )
						  		->find_one();
	}
}

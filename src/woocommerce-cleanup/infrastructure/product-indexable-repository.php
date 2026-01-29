<?php

// phpcs:disable Yoast.NamingConventions.NamespaceName.TooLong
namespace Yoast\WP\SEO\Woocommerce_Cleanup\Infrastructure;

use Yoast\WP\SEO\Models\Indexable;
use Yoast\WP\SEO\Repositories\Indexable_Repository;

/**
 * The product indexable repository.
 */
class Product_Indexable_Repository {

	/**
	 * The indexable repository.
	 *
	 * @var Indexable_Repository
	 */
	private $indexable_repository;

	/**
	 * Constructor.
	 *
	 * @param Indexable_Repository $indexable_repository The indexable repository.
	 */
	public function __construct( Indexable_Repository $indexable_repository ) {
		$this->indexable_repository = $indexable_repository;
	}

	/**
	 * Finds an indexable for a given product ID.
	 *
	 * @param int $product_id The product ID.
	 *
	 * @return Indexable|false The indexable or false if not found.
	 */
	public function find_by_product_id( int $product_id ) {
		return $this->indexable_repository->find_by_id_and_type( $product_id, 'post', false );
	}

	/**
	 * Updates the permalink for an indexable.
	 *
	 * @param Indexable $indexable The indexable to update.
	 * @param string    $permalink The new permalink.
	 *
	 * @return void
	 */
	public function update_permalink( Indexable $indexable, string $permalink ): void {
		$indexable->permalink = $permalink;
		$indexable->save();
	}
}

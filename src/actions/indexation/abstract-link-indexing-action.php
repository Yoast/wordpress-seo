<?php

namespace Yoast\WP\SEO\Actions\Indexation;

use wpdb;
use Yoast\WP\SEO\Builders\Indexable_Link_Builder;
use Yoast\WP\SEO\Models\SEO_Links;
use Yoast\WP\SEO\Repositories\Indexable_Repository;

/**
 * Reindexation action for link indexables.
 */
abstract class Abstract_Link_Indexing_Action implements Indexation_Action_Interface {

	/**
	 * The transient name.
	 *
	 * @var string
	 */
	const UNINDEXED_COUNT_TRANSIENT = null;

	/**
	 * The link builder.
	 *
	 * @var Indexable_Link_Builder
	 */
	protected $link_builder;

	/**
	 * The indexable repository.
	 *
	 * @var Indexable_Repository
	 */
	protected $repository;

	/**
	 * The WordPress database instance.
	 *
	 * @var wpdb
	 */
	protected $wpdb;

	/**
	 * Indexable_Post_Indexing_Action constructor
	 *
	 * @param Indexable_Link_Builder $link_builder The indexable link builder.
	 * @param Indexable_Repository   $repository   The indexable repository.
	 * @param wpdb                   $wpdb         The WordPress database instance.
	 */
	public function __construct(
		Indexable_Link_Builder $link_builder,
		Indexable_Repository $repository,
		wpdb $wpdb
	) {
		$this->link_builder = $link_builder;
		$this->repository   = $repository;
		$this->wpdb         = $wpdb;
	}

	/**
	 * @inheritDoc
	 */
	public function get_total_unindexed() {
		$transient = \get_transient( static::UNINDEXED_COUNT_TRANSIENT );

		if ( $transient !== false ) {
			return (int) $transient;
		}

		$query = $this->get_query( true );

		$result = $this->wpdb->get_var( $query );

		if ( \is_null( $result ) ) {
			return false;
		}

		\set_transient( static::UNINDEXED_COUNT_TRANSIENT, $result, \DAY_IN_SECONDS );

		return (int) $result;
	}

	/**
	 * Creates indexables for unindexed objects.
	 *
	 * @return SEO_Links[] The created SEO links.
	 */
	public function index() {
		$objects = $this->get_objects();

		$indexables = [];
		foreach ( $objects as $object ) {
			$indexable = $this->repository->find_by_id_and_type( $object->id, $object->type );

			// It's possible the indexable was created without having it's links indexed.
			if ( $indexable->link_count === null ) {
				$this->link_builder->build( $indexable, $object->content );
				$indexable->save();
			}

			$indexables[] = $indexable;
		}

		\delete_transient( static::UNINDEXED_COUNT_TRANSIENT );

		return $indexables;
	}

	/**
	 * @inheritDoc
	 */
	public function get_limit() {
		/**
		 * Filter 'wpseo_link_indexing_limit' - Allow filtering the amount of texts indexed during each link indexing pass.
		 *
		 * @api int The maximum number of texts indexed.
		 */
		return \apply_filters( 'wpseo_link_indexing_limit', 5 );
	}

	/**
	 * Returns objects to be indexed.
	 *
	 * @return array Objects to be indexed, should be an array of objects with object_id, object_type and content.
	 */
	abstract protected function get_objects();

	/**
	 * Queries the database for unindexed term IDs.
	 *
	 * @param bool $count Whether or not it should be a count query.
	 * @param int  $limit The maximum amount of term IDs to return.
	 *
	 * @return string The query.
	 */
	abstract protected function get_query( $count, $limit = 1 );
}

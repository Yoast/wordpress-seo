<?php

namespace Yoast\WP\SEO\Tests\Unit\Doubles\Builders;

use Yoast\WP\SEO\Builders\Indexable_Builder;
use Yoast\WP\SEO\Models\Indexable;

/**
 * Class Primary_Term_Builder_Double
 */
final class Indexable_Builder_Double extends Indexable_Builder {

	/**
	 * Saves and returns an indexable (on production environments only).
	 *
	 * @param Indexable      $indexable        The indexable.
	 * @param Indexable|null $indexable_before The indexable before possible changes.
	 *
	 * @return Indexable The indexable.
	 */
	public function exposed_save_indexable( $indexable, $indexable_before = null ) {
		return $this->indexable_helper->save_indexable( $indexable, $indexable_before );
	}

	/**
	 * Checks if the indexable type is one that is not supposed to have object ID for (on production environments only).
	 *
	 * @param string $type The type of the indexable.
	 *
	 * @return bool Whether the indexable type is one that is not supposed to have object ID for.
	 */
	public function exposed_is_type_with_no_id( $type ) {
		return $this->is_type_with_no_id( $type );
	}

	/**
	 * Build and author indexable from an author id if it does not exist yet, or if the author indexable needs to be upgraded (on production environments only).
	 *
	 * @param int $author_id The author id.
	 *
	 * @return Indexable|false The author indexable if it has been built, `false` if it could not be built.
	 */
	public function exposed_maybe_build_author_indexable( $author_id ) {
		return $this->maybe_build_author_indexable( $author_id );
	}

	/**
	 * Ensures we have a valid indexable. Creates one if false is passed.(on production environments only).
	 *
	 * @param Indexable|false $indexable The indexable.
	 * @param array           $defaults  The initial properties of the Indexable.
	 *
	 * @return Indexable The indexable.
	 */
	public function exposed_ensure_indexable( $indexable, $defaults = [] ) {
		return $this->ensure_indexable( $indexable, $defaults );
	}
}

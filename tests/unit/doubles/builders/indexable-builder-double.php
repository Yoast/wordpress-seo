<?php

namespace Yoast\WP\SEO\Tests\Unit\Doubles\Builders;

use Yoast\WP\SEO\Builders\Indexable_Builder;
use Yoast\WP\SEO\Models\Indexable;

/**
 * Class Primary_Term_Builder_Double
 */
class Indexable_Builder_Double extends Indexable_Builder {

	/**
	 * Saves and returns an indexable (on production environments only).
	 *
	 * @param Indexable      $indexable        The indexable.
	 * @param Indexable|null $indexable_before The indexable before possible changes.
	 *
	 * @return Indexable The indexable.
	 */
	public function exposed_save_indexable( $indexable, $indexable_before = null ): Indexable {
		return $this->save_indexable( $indexable, $indexable_before );
	}

	/**
	 * Checks if the indexable type is one that is not supposed to have object ID for.
	 *
	 * @param string $type The type of the indexable.
	 *
	 * @return bool Whether the indexable type is one that is not supposed to have object ID for.
	 */
	public function exposed_is_type_with_no_id( $type ) {
		return $this->is_type_with_no_id( $type );
	}
}

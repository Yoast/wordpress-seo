<?php


namespace doubles\builders;

use Yoast\WP\SEO\Builders\Indexable_Builder;
use Yoast\WP\SEO\Models\Indexable;

/**
 * Class Primary_Term_Builder_Double
 */
class Indexable_Builder_Double extends Indexable_Builder
{
	/**
	 * Saves and returns an indexable (on production environments only).
	 *
	 * @param Indexable      $indexable        The indexable.
	 * @param Indexable|null $indexable_before The indexable before possible changes.
	 *
	 * @return Indexable The indexable.
	 */
	public function exposed_save_indexable( $indexable, $indexable_before = null ) {
		return $this->save_indexable( $indexable, $indexable_before );
	}
}

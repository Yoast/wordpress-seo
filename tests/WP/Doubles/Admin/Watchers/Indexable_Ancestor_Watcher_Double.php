<?php

namespace Yoast\WP\SEO\Tests\WP\Doubles\Admin\Watchers;

use Yoast\WP\SEO\Integrations\Watchers\Indexable_Ancestor_Watcher;

/**
 * Class Indexable_Ancestor_Watcher_Double.
 */
class Indexable_Ancestor_Watcher_Double extends Indexable_Ancestor_Watcher {

	/**
	 * Retrieves the object id's for a term based on the term-post relationship.
	 *
	 * @param int              $term_id          The term to get the object id's for.
	 * @param array<Indexable> $child_indexables The child indexables.
	 *
	 * @return array<int> List with object ids for the term.
	 */
	public function get_object_ids_for_term( $term_id, $child_indexables ) {
		return parent::get_object_ids_for_term( $term_id, $child_indexables );
	}
}

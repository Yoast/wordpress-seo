<?php

namespace Yoast\WP\SEO\Integrations\Watchers;

use Yoast\WP\SEO\Conditionals\No_Conditionals;
use Yoast\WP\SEO\Integrations\Integration_Interface;
use Yoast\WP\SEO\Models\Indexable;

/**
 * Class to update the is_protected status of inherited objects.
 */
class Indexable_Inherited_Watcher implements Integration_Interface {
	use No_Conditionals;

	/**
	 * Registers the appropriate hooks.
	 */
	public function register_hooks() {
		\add_action( 'wpseo_save_indexable', [ $this, 'maybe_update_inherited' ], \PHP_INT_MAX, 2 );
	}

	/**
	 * If an indexable's is_protected has changed, updates its inherited children.
	 *
	 * @param Indexable $indexable        The indexable.
	 * @param Indexable $indexable_before The old indexable.
	 *
	 * @return void
	 */
	public function maybe_update_inherited( $indexable, $indexable_before ) {
		// If the post password hasn't changed then there's no need to do anything.
		if ( $indexable->post_password === $indexable_before->post_password ) {
			return;
		}

		$inherited = $this->repository->query()
			->where( 'post_parent', $indexable->object_id )
			->where( 'post_status', 'inherited' )
			->find_many();

		foreach ( $inherited as $other_indexable ) {
			$other_indexable->is_protected = $indexable->is_protected;
		}

		$this->repository->query()->update_many( $inherited );
	}
}

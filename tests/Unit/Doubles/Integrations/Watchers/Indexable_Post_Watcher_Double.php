<?php

namespace Yoast\WP\SEO\Tests\Unit\Doubles\Integrations\Watchers;

use WP_Post;
use Yoast\WP\SEO\Integrations\Watchers\Indexable_Post_Watcher;
use Yoast\WP\SEO\Models\Indexable;

/**
 * Class Indexable_Post_Watcher_Double.
 */
class Indexable_Post_Watcher_Double extends Indexable_Post_Watcher {

	/**
	 * Updates the has_public_posts when the post indexable is built.
	 *
	 * @param Indexable $indexable The indexable to check.
	 *
	 * @return void
	 */
	public function update_has_public_posts( $indexable ) {
		parent::update_has_public_posts( $indexable );
	}

	/**
	 * Updates the relations on post save or post status change.
	 *
	 * @param WP_Post $post The post that has been updated.
	 *
	 * @return void
	 */
	public function update_relations( $post ) {
		parent::update_relations( $post );
	}

	/**
	 * Retrieves the related indexables for given post.
	 *
	 * @param WP_Post $post The post to get the indexables for.
	 *
	 * @return Indexable[] The indexables.
	 */
	public function get_related_indexables( $post ) {
		return parent::get_related_indexables( $post );
	}
}

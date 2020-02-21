<?php

namespace Yoast\WP\SEO\Tests\Doubles;

use Yoast\WP\SEO\Models\Indexable;

/**
 * Class Indexable_Post_Watcher_Double.
 *
 * @package Yoast\Tests\Doubles
 */
class Indexable_Post_Watcher_Double extends \Yoast\WP\SEO\Integrations\Watchers\Indexable_Post_Watcher {

	/**
	 * @inheritDoc
	 */
	public function update_has_public_posts( $indexable ) {
		parent::update_has_public_posts( $indexable );
	}

	/**
	 * @inheritDoc
	 */
	public function attachment_has_public_posts( $parent_id, Indexable $indexable ) {
		return parent::attachment_has_public_posts( $parent_id, $indexable );
	}

	/**
	 * @inheritDoc
	 */
	public function update_relations( $post ) {
		parent::update_relations( $post );
	}

	/**
	 * @inheritDoc
	 */
	public function get_related_indexables( $post ) {
		return parent::get_related_indexables( $post );
	}
}

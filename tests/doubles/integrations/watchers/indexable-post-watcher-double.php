<?php

namespace Yoast\WP\SEO\Tests\Doubles;

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
}

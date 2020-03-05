<?php

namespace Yoast\WP\SEO\Tests\Doubles\Integrations\Watchers;

use Yoast\WP\SEO\Integrations\Watchers\Primary_Term_Watcher;

/**
 * Class Primary_Term_Watcher_Double.
 *
 * @package Yoast\WP\SEO\Tests\Doubles\Integrations\Watchers
 */
class Primary_Term_Watcher_Double extends Primary_Term_Watcher {

	/**
	 * @inheritDoc
	 */
	public function save_primary_term( $post_id, $taxonomy ) {
		return parent::save_primary_term( $post_id, $taxonomy );
	}

	/**
	 * @inheritDoc
	 */
	public function get_primary_term_taxonomies( $post_id = null ) {
		return parent::get_primary_term_taxonomies( $post_id );
	}

	/**
	 * @inheritDoc
	 */
	public function generate_primary_term_taxonomies( $post_id ) {
		return parent::generate_primary_term_taxonomies( $post_id );
	}
}

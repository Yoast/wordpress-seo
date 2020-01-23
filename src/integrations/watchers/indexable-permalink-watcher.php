<?php

/**
 * WordPress Permalink structure watcher.
 *
 * @package Yoast\YoastSEO\Watchers
 */

namespace Yoast\WP\SEO\Integrations\Watchers;

use Yoast\WP\SEO\Conditionals\Migrations_Conditional;
use Yoast\WP\SEO\Integrations\Integration_Interface;
use Yoast\WP\SEO\Repositories\Indexable_Repository;

/**
 * Handles updates to the permalink_structure for the Indexables table.
 */
class Indexable_Permalink_Watcher implements Integration_Interface {

	/**
	 * Indexable_Permalink_Watcher constructor.
	 *
	 * @param Indexable_Repository $repository The repository to use.
	 */
	public function __construct( Indexable_Repository $repository ) {
		$this->repository = $repository;
	}

	/**
	 * @inheritdoc
	 */
	public static function get_conditionals() {
		return [ Migrations_Conditional::class ];
	}

	public function register_hooks() {
		\add_action( 'update_option_permalink_structure', [ $this, 'reset_permalinks' ], 10, 3 );
		\add_action( 'update_option_category_base', [ $this, 'reset_permalinks' ], 10, 3 );
		\add_action( 'update_option_tag_base', [ $this, 'reset_permalinks' ], 10, 3 );
	}

	public function reset_permalinks( $old, $new, $type ) {
		var_dump( $old  );
		var_dump( $new );
		var_dump( $type );
		if( $type !== "tag_base" ) {
			return;
		}

		//todo set indexables to null for posts, category base, or tag base?
//		$this-><indexable->reset_permalinks( $type );
		wp_die();
	}
}

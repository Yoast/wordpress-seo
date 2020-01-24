<?php

/**
 * WordPress Permalink structure watcher.
 *
 * @package Yoast\YoastSEO\Watchers
 */

namespace Yoast\WP\SEO\Integrations\Watchers;

use Yoast\WP\SEO\Conditionals\Migrations_Conditional;
use Yoast\WP\SEO\Integrations\Integration_Interface;
use Yoast\WP\SEO\WordPress\Wrapper;

/**
 * Handles updates to the permalink_structure for the Indexables table.
 */
class Indexable_Permalink_Watcher implements Integration_Interface {


	/**
	 * @inheritdoc
	 */
	public static function get_conditionals() {
		return [ Migrations_Conditional::class ];
	}

	public function register_hooks() {
		\add_action( 'update_option_permalink_structure', [ $this, 'reset_permalinks' ], 10, 3 );
		\add_action( 'update_option_category_base', [ $this, 'reset_permalinks_term' ], 10, 3 );
		\add_action( 'update_option_tag_base', [ $this, 'reset_permalinks_term' ], 10, 3 );

		//todo I have yet to find which actions are done for custom categories
//		\add_action( 'update_option_woocommerce_product_category_slug', [ $this, 'reset_permalinks_term' ], 10, 3 );
	}

	public function reset_permalinks( $old, $new, $type ) {
		echo $type;
		exit;
		$this->reset_permalink_indexables( 'post', 'post' );
		$this->reset_permalink_indexables( 'post', 'page' );
	}

	public function reset_permalinks_term( $old, $new, $type ) {
		echo $type;
		exit;
		$subtype = $type;
		if ( strstr( $subtype, '_base') ) {
			$subtype = substr( $type, 0, -5 ); // 'strips _base' from the field.
		}

		//todo actually do the request
//		$this->reset_permalink_indexables( 'term', $subtype );

	}

	private function reset_permalink_indexables( $type, $subtype ) {
		Wrapper::get_wpdb()->update(
			Yoast_Model::get_table_name( 'Indexable' ),
			[
				'permalink' => null,
			],
			[
				'object_type'    => $type,
				'object_subtype' => $subtype,
			]

		);
	}
}

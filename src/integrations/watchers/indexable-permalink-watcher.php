<?php
/**
 * WordPress Permalink structure watcher.
 *
 * @package Yoast\YoastSEO\Watchers
 */

namespace Yoast\WP\SEO\Integrations\Watchers;

use Yoast\WP\SEO\Conditionals\Migrations_Conditional;
use Yoast\WP\SEO\Helpers\Post_Type_Helper;
use Yoast\WP\SEO\Integrations\Integration_Interface;
use Yoast\WP\Lib\Model;
use Yoast\WP\SEO\WordPress\Wrapper;

/**
 * Handles updates to the permalink_structure for the Indexables table.
 */
class Indexable_Permalink_Watcher implements Integration_Interface {

	/**
	 * The post type helper.
	 *
	 * @var Post_Type_Helper
	 */
	private $post_type;

	/**
	 * @inheritDoc
	 */
	public static function get_conditionals() {
		return [ Migrations_Conditional::class ];
	}

	/**
	 * Indexable_Permalink_Watcher constructor.
	 *
	 * @codeCoverageIgnore It sets a dependency.
	 *
	 * @param Post_Type_Helper $post_type The post type helper.
	 */
	public function __construct( Post_Type_Helper $post_type ) {
		$this->post_type = $post_type;
	}

	/**
	 * @inheritDoc
	 */
	public function register_hooks() {
		\add_action( 'update_option_permalink_structure', [ $this, 'reset_permalinks' ] );
		\add_action( 'update_option_category_base', [ $this, 'reset_permalinks_term' ], 10, 3 );
		\add_action( 'update_option_tag_base', [ $this, 'reset_permalinks_term' ], 10, 3 );
	}

	/**
	 * Resets the permalinks for everything that is related to the permalink structure.
	 */
	public function reset_permalinks() {
		$post_types = $this->get_post_types();
		foreach ( $post_types as $post_type ) {
			$this->reset_permalinks_post_type( $post_type );
		}

		$taxonomies = $this->get_taxonomies_for_post_types( $post_types );
		foreach ( $taxonomies as $taxonomy ) {
			$this->reset_permalink_indexables( 'term', $taxonomy );
		}

		$this->reset_permalink_indexables( 'user' );
		$this->reset_permalink_indexables( 'date-archive' );
		$this->reset_permalink_indexables( 'system-page' );
	}

	/**
	 * Resets the permalink for the given post type.
	 *
	 * @param string $post_type The post type to reset.
	 */
	public function reset_permalinks_post_type( $post_type ) {
		$this->reset_permalink_indexables( 'post', $post_type );
		$this->reset_permalink_indexables( 'post-type-archive', $post_type );
	}

	/**
	 * Resets the term indexables when the base has been changed.
	 *
	 * @param string $old  Unused. The old option value.
	 * @param string $new  Unused. The new option value.
	 * @param string $type The option name.
	 */
	public function reset_permalinks_term( $old, $new, $type ) {
		$subtype = $type;

		// When the subtype contains _base, just strip it.
		if ( strstr( $subtype, '_base' ) ) {
			$subtype = substr( $type, 0, -5 );
		}

		if ( $subtype === 'tag' ) {
			$subtype = 'post_tag';
		}

		$this->reset_permalink_indexables( 'term', $subtype );
	}

	/**
	 * Retrieves a list with the public post types.
	 *
	 * @codeCoverageIgnore
	 *
	 * @return array The post types.
	 */
	protected function get_post_types() {
		/**
		 * Filter: Gives the possibility to filter out post types.
		 *
		 * @param array $post_types The post type names.
		 *
		 * @return array The post types.
		 */
		$post_types = \apply_filters( 'wpseo_post_types_reset_permalinks', $this->post_type->get_public_post_types() );

		return $post_types;
	}

	/**
	 * Retrieves the taxonomies that belongs to the public post types.
	 *
	 * @codeCoverageIgnore
	 *
	 * @param array $post_types The post types to get taxonomies for.
	 *
	 * @return array The retrieved taxonomies.
	 */
	protected function get_taxonomies_for_post_types( $post_types ) {
		$taxonomies = [];
		foreach ( $post_types as $post_type ) {
			$taxonomies[] = get_object_taxonomies( $post_type, 'names' );
		}

		$taxonomies = array_merge( [], ...$taxonomies );
		$taxonomies = array_unique( $taxonomies );

		return $taxonomies;
	}

	/**
	 * Resets the permalinks of the indexables.
	 *
	 * @codeCoverageIgnore
	 *
	 * @param string      $type    The type of the indexable.
	 * @param null|string $subtype The subtype. Can be null.
	 */
	protected function reset_permalink_indexables( $type, $subtype = null ) {
		$where = [ 'object_type' => $type ];

		if ( $subtype ) {
			$where['object_sub_type'] = $subtype;
		}

		Wrapper::get_wpdb()->update(
			Model::get_table_name( 'Indexable' ),
			[
				'permalink' => null,
			],
			$where
		);
	}
}

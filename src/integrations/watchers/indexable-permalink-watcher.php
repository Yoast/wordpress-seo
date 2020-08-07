<?php
/**
 * WordPress Permalink structure watcher.
 *
 * @package Yoast\YoastSEO\Watchers
 */

namespace Yoast\WP\SEO\Integrations\Watchers;

use Yoast\WP\Lib\Model;
use Yoast\WP\SEO\Actions\Indexation\Indexable_Post_Indexation_Action;
use Yoast\WP\SEO\Actions\Indexation\Indexable_Post_Type_Archive_Indexation_Action;
use Yoast\WP\SEO\Actions\Indexation\Indexable_Term_Indexation_Action;
use Yoast\WP\SEO\Conditionals\Migrations_Conditional;
use Yoast\WP\SEO\Helpers\Options_Helper;
use Yoast\WP\SEO\Helpers\Post_Type_Helper;
use Yoast\WP\SEO\Integrations\Integration_Interface;
use Yoast\WP\SEO\Presenters\Admin\Indexation_Permalink_Warning_Presenter;
use Yoast\WP\SEO\WordPress\Wrapper;

/**
 * Handles updates to the permalink_structure for the Indexables table.
 */
class Indexable_Permalink_Watcher implements Integration_Interface {

	/**
	 * Represents the options helper.
	 *
	 * @var Options_Helper
	 */
	protected $options_helper;

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
	 * @param Post_Type_Helper $post_type The post type helper.
	 * @param Options_Helper   $options   The options helper.
	 */
	public function __construct( Post_Type_Helper $post_type, Options_Helper $options ) {
		$this->post_type      = $post_type;
		$this->options_helper = $options;
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
		if ( \strstr( $subtype, '_base' ) ) {
			$subtype = \substr( $type, 0, -5 );
		}

		if ( $subtype === 'tag' ) {
			$subtype = 'post_tag';
		}

		$this->reset_permalink_indexables( 'term', $subtype );
	}

	/**
	 * Resets the permalinks of the indexables.
	 *
	 * @param string      $type    The type of the indexable.
	 * @param null|string $subtype The subtype. Can be null.
	 * @param string      $reason  The reason that the permalink has been changed.
	 */
	public function reset_permalink_indexables( $type, $subtype = null, $reason = Indexation_Permalink_Warning_Presenter::REASON_PERMALINK_SETTINGS ) {
		$where = [ 'object_type' => $type ];

		if ( $subtype ) {
			$where['object_sub_type'] = $subtype;
		}

		$result = Wrapper::get_wpdb()->update(
			Model::get_table_name( 'Indexable' ),
			[
				'permalink'      => null,
				'permalink_hash' => null,
			],
			$where
		);

		if ( $result > 0 ) {
			$this->options_helper->set( 'indexables_indexation_reason', $reason );
			$this->options_helper->set( 'ignore_indexation_warning', false );
			$this->options_helper->set( 'indexation_warning_hide_until', false );

			delete_transient( Indexable_Post_Indexation_Action::TRANSIENT_CACHE_KEY );
			delete_transient( Indexable_Post_Type_Archive_Indexation_Action::TRANSIENT_CACHE_KEY );
			delete_transient( Indexable_Term_Indexation_Action::TRANSIENT_CACHE_KEY );
		}
	}

	/**
	 * Retrieves a list with the public post types.
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
	 * @param array $post_types The post types to get taxonomies for.
	 *
	 * @return array The retrieved taxonomies.
	 */
	protected function get_taxonomies_for_post_types( $post_types ) {
		$taxonomies = [];
		foreach ( $post_types as $post_type ) {
			$taxonomies[] = \get_object_taxonomies( $post_type, 'names' );
		}

		$taxonomies = \array_merge( [], ...$taxonomies );
		$taxonomies = \array_unique( $taxonomies );

		return $taxonomies;
	}
}

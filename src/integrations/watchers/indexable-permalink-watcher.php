<?php

namespace Yoast\WP\SEO\Integrations\Watchers;

use Yoast\WP\Lib\Model;
use Yoast\WP\SEO\Actions\Indexing\Indexable_Post_Indexation_Action;
use Yoast\WP\SEO\Actions\Indexing\Indexable_Post_Type_Archive_Indexation_Action;
use Yoast\WP\SEO\Actions\Indexing\Indexable_Term_Indexation_Action;
use Yoast\WP\SEO\Conditionals\Migrations_Conditional;
use Yoast\WP\SEO\Helpers\Indexable_Helper;
use Yoast\WP\SEO\Helpers\Options_Helper;
use Yoast\WP\SEO\Helpers\Post_Type_Helper;
use Yoast\WP\SEO\Helpers\Taxonomy_Helper;
use Yoast\WP\SEO\Integrations\Integration_Interface;
use Yoast\WP\SEO\Presenters\Admin\Indexation_Permalink_Warning_Presenter;
use Yoast\WP\SEO\WordPress\Wrapper;

/**
 * WordPress Permalink structure watcher.
 *
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
	 * The taxonomy helper.
	 *
	 * @var Taxonomy_Helper
	 */
	protected $taxonomy_helper;

	/**
	 * The post type helper.
	 *
	 * @var Post_Type_Helper
	 */
	private $post_type;

	/**
	 * The indexable helper.
	 *
	 * @var Indexable_Helper
	 */
	protected $indexable_helper;

	/**
	 * @inheritDoc
	 */
	public static function get_conditionals() {
		return [ Migrations_Conditional::class ];
	}

	/**
	 * Indexable_Permalink_Watcher constructor.
	 *
	 * @param Post_Type_Helper $post_type       The post type helper.
	 * @param Options_Helper   $options         The options helper.
	 * @param Indexable_Helper $indexable       The indexable helper.
	 * @param Taxonomy_Helper  $taxonomy_helper The taxonomy helper.
	 */
	public function __construct( Post_Type_Helper $post_type, Options_Helper $options, Indexable_Helper $indexable, Taxonomy_Helper $taxonomy_helper ) {
		$this->post_type        = $post_type;
		$this->options_helper   = $options;
		$this->indexable_helper = $indexable;
		$this->taxonomy_helper  = $taxonomy_helper;

		$this->schedule_cron();
	}

	/**
	 * @inheritDoc
	 */
	public function register_hooks() {
		\add_action( 'update_option_permalink_structure', [ $this, 'reset_permalinks' ] );
		\add_action( 'update_option_category_base', [ $this, 'reset_permalinks_term' ], 10, 3 );
		\add_action( 'update_option_tag_base', [ $this, 'reset_permalinks_term' ], 10, 3 );
		\add_action( 'wpseo_permalink_structure_check', [ $this, 'force_reset_permalinks' ] );
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
			$this->indexable_helper->reset_permalink_indexables( 'term', $taxonomy );
		}

		$this->indexable_helper->reset_permalink_indexables( 'user' );
		$this->indexable_helper->reset_permalink_indexables( 'date-archive' );
		$this->indexable_helper->reset_permalink_indexables( 'system-page' );

		// Always update `permalink_structure` in the wpseo option.
		$this->options_helper->set( 'permalink_structure', \get_option( 'permalink_structure' ) );
	}

	/**
	 * Resets the permalink for the given post type.
	 *
	 * @param string $post_type The post type to reset.
	 */
	public function reset_permalinks_post_type( $post_type ) {
		$this->indexable_helper->reset_permalink_indexables( 'post', $post_type );
		$this->indexable_helper->reset_permalink_indexables( 'post-type-archive', $post_type );
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

		$this->indexable_helper->reset_permalink_indexables( 'term', $subtype );
	}

	/**
	 * Resets the permalink indexables automatically, if necessary.
	 *
	 * @return bool Whether the reset request ran.
	 */
	public function force_reset_permalinks() {
		if ( $this->should_reset_permalinks() ) {
			$this->reset_permalinks();

			return true;
		}

		$this->reset_altered_custom_taxonomies();

		return true;
	}

	/**
	 * Checks whether permalinks should be reset.
	 *
	 * @return bool Whether the permalinks should be reset.
	 */
	public function should_reset_permalinks() {
		return \get_option( 'permalink_structure' ) !== $this->options_helper->get( 'permalink_structure' );
	}

	/**
	 * Resets custom taxonomies if their slugs have changed.
	 *
	 * @return void
	 */
	public function reset_altered_custom_taxonomies() {
		$taxonomies            = $this->taxonomy_helper->get_custom_taxonomies();
		$custom_taxonomy_bases = $this->options_helper->get( 'custom_taxonomy_slugs', [] );
		$new_taxonomy_bases    = [];

		foreach ( $taxonomies as $taxonomy ) {
			$taxonomy_slug = $this->taxonomy_helper->get_taxonomy_slug( $taxonomy );

			$new_taxonomy_bases[ $taxonomy ] = $taxonomy_slug;

			if ( ! array_key_exists( $taxonomy, $custom_taxonomy_bases ) ) {
				continue;
			}

			if ( $taxonomy_slug !== $custom_taxonomy_bases[ $taxonomy ] ) {
				$this->indexable_helper->reset_permalink_indexables( 'term', $taxonomy );
			}
		}

		$this->options_helper->set( 'custom_taxonomy_slugs', $new_taxonomy_bases );
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

	/**
	 * Schedules the WP-Cron job to check the permalink_structure status.
	 *
	 * @return void
	 */
	protected function schedule_cron() {
		if ( \wp_next_scheduled( 'wpseo_permalink_structure_check' ) ) {
			return;
		}

		\wp_schedule_event( time(), 'daily', 'wpseo_permalink_structure_check' );
	}

	/* ********************* DEPRECATED METHODS ********************* */

	/**
	 * Resets the permalinks of the indexables.
	 *
	 * @deprecated 15.1
	 * @codeCoverageIgnore
	 *
	 * @param string      $type    The type of the indexable.
	 * @param null|string $subtype The subtype. Can be null.
	 * @param string      $reason  The reason that the permalink has been changed.
	 */
	public function reset_permalink_indexables( $type, $subtype = null, $reason = Indexation_Permalink_Warning_Presenter::REASON_PERMALINK_SETTINGS ) {
		_deprecated_function( __METHOD__, 'WPSEO 15.1', 'Indexable_Helper::reset_permalink_indexables' );

		return $this->indexable_helper->reset_permalink_indexables( $type, $subtype, $reason );
	}
}

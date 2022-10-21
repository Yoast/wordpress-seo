<?php

namespace Yoast\WP\SEO\Integrations\Watchers;

use Yoast\WP\SEO\Helpers\Options_Helper;
use Yoast\WP\SEO\Conditionals\Migrations_Conditional;
use Yoast\WP\SEO\Conditionals\Admin_Conditional;
use Yoast\WP\SEO\Conditionals\Not_Admin_Ajax_Conditional;
use Yoast\WP\SEO\Repositories\Indexable_Repository;
use Yoast\WP\SEO\Integrations\Integration_Interface;

/**
 * WordPress Post watcher.
 *
 * Fills the Indexable according to Post data.
 */

class Indexable_Taxonomy_Change_Watcher implements Integration_Interface {

	/**
	 * Holds the Options_Helper instance.
	 *
	 * @var Options_Helper
	 */
	private $options;

	/**
	 * The indexable repository.
	 *
	 * @var Indexable_Repository
	 */
	private $repository;

	/**
	 * Returns the conditionals based on which this loadable should be active.
	 *
	 * @return array
	 */
	public static function get_conditionals() {
		return [ Not_Admin_Ajax_Conditional::class, Admin_Conditional::class, Migrations_Conditional::class ];
	}

	/**
	 * Indexable_Taxonomy_Change_Watcher constructor.
	 *
	 * @param Options_Helper $options The options helper.
	 */
	public function __construct(
		Options_Helper $options,
		Indexable_Repository $repository
	) {
		$this->options    = $options;
		$this->repository = $repository;
	}

	/**
	 * Initializes the integration.
	 *
	 * This is the place to register hooks and filters.
	 *
	 * @return void
	 */
	public function register_hooks() {
		\add_action( 'admin_init', [ $this, 'check_taxonomy_viewability' ] );
	}

	public function check_taxonomy_viewability() {
		
		// We have to make sure this is just a plain http request, no ajax/REST
		if ( \wp_is_json_request() ) {
			return;
		}

		if ( ! function_exists( '\is_taxonomy_viewable' ) ) {
			return;
		}

		$taxonomies =  \get_taxonomies();
		$viewable_taxonomies            = \array_filter( $taxonomies, '\is_taxonomy_viewable' );
		$last_known_viewable_taxonomies = $this->options->get( 'last_known_viewable_taxonomies', [] );

		$newly_made_viewable_taxonomy     = \array_diff( $viewable_taxonomies, $last_known_viewable_taxonomies );
		$newly_made_non_viewable_taxonomy = \array_diff( $last_known_viewable_taxonomies, $viewable_taxonomies );

		// The very first time this is gonna be false, as the last_known_viewable_taxonomies option will be empty
		// We want to change this (maybe in the migration?)
		if ( empty( $newly_made_viewable_taxonomy ) && ( empty( $newly_made_non_viewable_taxonomy ) ) ) {
			return;
		}

		// Update the list of last known viewable taxonomies in the database
		$this->options->set( 'last_known_viewable_taxonomies', $viewable_taxonomies );

		if ( ! empty( $newly_made_viewable_taxonomy ) ) {
			$this->options->set( 'taxonomy_made_viewable', $newly_made_viewable_taxonomy );
			return;
		}

		if ( ! empty( $newly_made_non_viewable_taxonomy ) ) {
			$this->options->set( 'taxonomy_made_non_viewable', $newly_made_non_viewable_taxonomy );
			return $this->delete_indexables_by_term( array_values( $newly_made_non_viewable_taxonomy )[0] );
		}

		return;
	}

	private function delete_indexables_by_term( $taxonomy ) {
		return $this->repository->query()
		->where( 'object_type', 'term' )
		->where( 'object_sub_type', $taxonomy )
		->delete_many();
	}
}

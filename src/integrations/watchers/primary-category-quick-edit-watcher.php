<?php

namespace Yoast\WP\SEO\Integrations\Watchers;

use WPSEO_Meta;
use Yoast\WP\SEO\Conditionals\Admin\Doing_Post_Quick_Edit_Save_Conditional;
use Yoast\WP\SEO\Conditionals\Migrations_Conditional;
use Yoast\WP\SEO\Helpers\Options_Helper;
use Yoast\WP\SEO\Integrations\Integration_Interface;
use Yoast\WP\SEO\Repositories\Primary_Term_Repository;

// phpcs:disable Yoast.NamingConventions.ObjectNameDepth.MaxExceeded -- Base class can't be written shorter without abbreviating.
/**
 * Class Primary_Category_Quick_Edit_Watcher
 */
class Primary_Category_Quick_Edit_Watcher implements Integration_Interface {

	/**
	 * Holds the options helper.
	 *
	 * @var Options_Helper
	 */
	protected $options_helper;

	/**
	 * Holds the primary term repository.
	 *
	 * @var Primary_Term_Repository
	 */
	protected $primary_term_repository;

	/**
	 * Primary_Category_Quick_Edit_Watcher constructor.
	 *
	 * @param Options_Helper          $options_helper          The options helper.
	 * @param Primary_Term_Repository $primary_term_repository The primary term repository.
	 */
	public function __construct(
		Options_Helper $options_helper,
		Primary_Term_Repository $primary_term_repository
	) {
		$this->options_helper          = $options_helper;
		$this->primary_term_repository = $primary_term_repository;
	}

	/**
	 * Initializes the integration.
	 *
	 * This is the place to register hooks and filters.
	 *
	 * @return void
	 */
	public function register_hooks() {
		\add_action( 'set_object_terms', [ $this, 'validate_primary_category' ], 10, 4 );
	}

	/**
	 * Returns the conditionals based on which this loadable should be active.
	 *
	 * @return array The conditionals.
	 */
	public static function get_conditionals() {
		return [ Migrations_Conditional::class, Doing_Post_Quick_Edit_Save_Conditional::class ];
	}

	/**
	 * Validates if the current primary category is still present. If not just remove the post meta for it.
	 *
	 * @param int    $object_id  Object ID.
	 * @param array  $terms      Unused. An array of object terms.
	 * @param array  $tt_ids     An array of term taxonomy IDs.
	 * @param string $taxonomy   Taxonomy slug.
	 */
	public function validate_primary_category( $object_id, $terms, $tt_ids, $taxonomy ) {
		$post = \get_post( $object_id );
		if ( $post === null ) {
			return;
		}

		$main_taxonomy = $this->options_helper->get( 'post_types-' . $post->post_type . '-maintax' );
		if ( ! $main_taxonomy || $main_taxonomy === '0' ) {
			return;
		}

		if ( $main_taxonomy !== $taxonomy ) {
			return;
		}

		$primary_category = $this->get_primary_term_id( $post->ID, $main_taxonomy );
		if ( $primary_category === false ) {
			return;
		}

		// The primary category isn't removed.
		if ( in_array( (string) $primary_category, $tt_ids, true ) ) {
			return;
		}

		$this->remove_primary_term( $post->ID, $main_taxonomy );
	}

	/**
	 * Returns the primary term id of a post.
	 *
	 * @param int    $post_id       The post ID.
	 * @param string $main_taxonomy The main taxonomy.
	 *
	 * @return int The ID of the primary term.
	 */
	private function get_primary_term_id( $post_id, $main_taxonomy ) {
		$primary_term = $this->primary_term_repository->find_by_post_id_and_taxonomy( $post_id, $main_taxonomy, false );

		if ( $primary_term ) {
			return $primary_term->term_id;
		}

		return \get_post_meta( $post_id, WPSEO_Meta::$meta_prefix . 'primary_' . $main_taxonomy, true );
	}

	/**
	 * Removes the primary category.
	 *
	 * @param int    $post_id       The post id to set primary taxonomy for.
	 * @param string $main_taxonomy Name of the taxonomy that is set to be the primary one.
	 */
	private function remove_primary_term( $post_id, $main_taxonomy ) {
		$primary_term = $this->primary_term_repository->find_by_post_id_and_taxonomy( $post_id, $main_taxonomy, false );
		if ( $primary_term ) {
			$primary_term->delete();
		}

		// Remove it from the post meta.
		\delete_post_meta( $post_id, WPSEO_Meta::$meta_prefix . 'primary_' . $main_taxonomy );
	}
}
// phpcs:enable Yoast.NamingConventions.ObjectNameDepth.MaxExceeded

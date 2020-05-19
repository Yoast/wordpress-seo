<?php
/**
 * Primary term builder.
 *
 * @package Yoast\WP\SEO\Builders
 */

namespace Yoast\WP\SEO\Builders;

use Yoast\WP\SEO\Helpers\Meta_Helper;
use Yoast\WP\SEO\Helpers\Primary_Term_Helper;
use Yoast\WP\SEO\Repositories\Primary_Term_Repository;

/**
 * Creates the primary term for a post.
 */
class Primary_Term_Builder {

	/**
	 * The primary term repository.
	 *
	 * @var Primary_Term_Repository
	 */
	protected $repository;

	/**
	 * The primary term helper.
	 *
	 * @var Primary_Term_Helper
	 */
	private $primary_term;

	/**
	 * The meta helper.
	 *
	 * @var Meta_Helper
	 */
	private $meta;

	/**
	 * Primary_Term_Builder constructor.
	 *
	 * @param Primary_Term_Repository $repository   The primary term repository.
	 * @param Primary_Term_Helper     $primary_term The primary term helper.
	 * @param Meta_Helper             $meta         The meta helper.
	 */
	public function __construct(
		Primary_Term_Repository $repository,
		Primary_Term_Helper $primary_term,
		Meta_Helper $meta
	) {
		$this->repository   = $repository;
		$this->primary_term = $primary_term;
		$this->meta         = $meta;
	}

	/**
	 * Formats and saves the primary terms for the post with the given post id.
	 *
	 * @param int $post_id The post ID.
	 *
	 * @return void
	 */
	public function build( $post_id ) {
		foreach ( $this->primary_term->get_primary_term_taxonomies( $post_id ) as $taxonomy ) {
			$this->save_primary_term( $post_id, $taxonomy->name );
		}
	}

	/**
	 * Save the primary term for a specific taxonomy.
	 *
	 * @param int    $post_id  Post ID to save primary term for.
	 * @param string $taxonomy Taxonomy to save primary term for.
	 *
	 * @return void
	 */
	protected function save_primary_term( $post_id, $taxonomy ) {
		$term_id = $this->meta->get_value( 'primary_' . $taxonomy, $post_id );

		$term_selected = ! empty( $term_id );
		$primary_term  = $this->repository->find_by_post_id_and_taxonomy( $post_id, $taxonomy, $term_selected );

		// Removes the indexable when found.
		if ( ! $term_selected ) {
			if ( $primary_term ) {
				$primary_term->delete();
			}

			return;
		}

		$primary_term->term_id  = $term_id;
		$primary_term->post_id  = $post_id;
		$primary_term->taxonomy = $taxonomy;
		$primary_term->blog_id  = \get_current_blog_id();
		$primary_term->save();
	}
}

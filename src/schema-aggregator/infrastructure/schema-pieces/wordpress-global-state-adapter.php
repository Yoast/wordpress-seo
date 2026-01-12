<?php
// phpcs:disable Yoast.NamingConventions.NamespaceName.TooLong -- Needed in the folder structure.
namespace Yoast\WP\SEO\Schema_Aggregator\Infrastructure\Schema_Pieces;

use WP_Post;
use Yoast\WP\SEO\Models\Indexable;
/**
 * Helper class to set and reset WordPress global state.
 */
class WordPress_Global_State_Adapter {

	/**
	 * Previous global $post
	 *
	 * @var WP_Post|null
	 */
	private $previous_post;

	/**
	 * Previous global $wp_query->queried_object
	 *
	 * @var WP_Post|null
	 */
	private $previous_queried_object;

	/**
	 * Previous global $wp_query->queried_object_id
	 *
	 * @var int|string|null
	 */
	private $previous_queried_object_id;

	/**
	 * Set WordPress global state
	 *
	 * Helper method to set $post and $wp_query globals based on the given indexable.
	 * This is critical to ensure that schema pieces relying on global state function correctly.
	 *
	 * @param Indexable $indexable The indexable to set the global state for.
	 *
	 * @return void
	 */
	public function set_global_state( Indexable $indexable ): void {
		global $post, $wp_query;
		$this->previous_post              = $post;
		$this->previous_queried_object    = ( $wp_query->queried_object ?? null );
		$this->previous_queried_object_id = ( $wp_query->queried_object_id ?? null );

		// phpcs:ignore WordPress.WP.GlobalVariablesOverride.Prohibited -- To setup the post we need to do this explicitly.
		$post                        = \get_post( $indexable->object_id );
		$wp_query->queried_object    = \get_post( $indexable->object_id );
		$wp_query->queried_object_id = $indexable->object_id;
		$wp_query->is_single         = true;
		$wp_query->is_singular       = true;
		\setup_postdata( $post );
	}

	/**
	 * Restore WordPress global state
	 *
	 * Helper method to restore $post and $wp_query globals after schema collection.
	 * This is critical to prevent side effects that could corrupt WordPress's global context.
	 *
	 * @return void
	 */
	public function reset_global_state(): void {
		global $post, $wp_query;

		\wp_reset_postdata();

		// phpcs:ignore WordPress.WP.GlobalVariablesOverride.Prohibited -- To reset the post we need to do this explicitly.
		$post = $this->previous_post;

		if ( isset( $wp_query ) && \is_object( $wp_query ) ) {
			$wp_query->queried_object    = $this->previous_queried_object;
			$wp_query->queried_object_id = $this->previous_queried_object_id;
			$wp_query->is_single         = false;
			$wp_query->is_singular       = false;
		}
	}
}

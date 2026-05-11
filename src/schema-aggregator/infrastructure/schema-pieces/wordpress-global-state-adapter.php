<?php
// phpcs:disable Yoast.NamingConventions.NamespaceName.TooLong -- Needed in the folder structure.
namespace Yoast\WP\SEO\Schema_Aggregator\Infrastructure\Schema_Pieces;

use WP_Post;
use Yoast\WP\SEO\Context\Meta_Tags_Context;
use Yoast\WP\SEO\Memoizers\Meta_Tags_Context_Memoizer;
use Yoast\WP\SEO\Models\Indexable;
/**
 * Helper class to set and reset WordPress global state.
 */
class WordPress_Global_State_Adapter {

	/**
	 * The meta tags context memoizer.
	 *
	 * @var Meta_Tags_Context_Memoizer
	 */
	private $memoizer;

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
	 * Previous query flags
	 *
	 * @var array<string, bool>
	 */
	private $previous_query_flags;

	/**
	 * Constructor.
	 *
	 * @param Meta_Tags_Context_Memoizer $memoizer The meta tags context memoizer.
	 */
	public function __construct( Meta_Tags_Context_Memoizer $memoizer ) {
		$this->memoizer = $memoizer;
	}

	/**
	 * Set WordPress global state
	 *
	 * Helper method to set $post and $wp_query globals based on the given indexable, and
	 * prime the memoizer's current_page slot with the indexable's context so external schema
	 * generators (e.g. WPSEO_WooCommerce_Schema) read the correct per-indexable values.
	 * This is critical to ensure that schema pieces relying on global state function correctly.
	 *
	 * @param Indexable         $indexable The indexable to set the global state for.
	 * @param Meta_Tags_Context $context   The indexable's context, installed as the current_page slot.
	 *
	 * @return void
	 */
	public function set_global_state( Indexable $indexable, Meta_Tags_Context $context ): void {
		global $post, $wp_query;
		$this->previous_post              = $post;
		$this->previous_queried_object    = ( $wp_query->queried_object ?? null );
		$this->previous_queried_object_id = ( $wp_query->queried_object_id ?? null );

		$this->previous_query_flags = [
			'is_single'   => ( $wp_query->is_single ?? false ),
			'is_page'     => ( $wp_query->is_page ?? false ),
			'is_singular' => ( $wp_query->is_singular ?? false ),
		];

		// phpcs:ignore WordPress.WP.GlobalVariablesOverride.Prohibited -- To setup the post we need to do this explicitly.
		$post                        = \get_post( $indexable->object_id );
		$wp_query->queried_object    = \get_post( $indexable->object_id );
		$wp_query->queried_object_id = $indexable->object_id;

		$wp_query->is_single   = false;
		$wp_query->is_page     = false;
		$wp_query->is_singular = true;

		if ( $indexable->object_sub_type === 'page' ) {
			$wp_query->is_page = true;
		}
		else {
			$wp_query->is_single = true;

		}

		\setup_postdata( $post );

		// Make for_current_page() resolve to the indexable being processed, so external schema
		// generators (e.g. WPSEO_WooCommerce_Schema) read the correct per-indexable canonical /
		// main_schema_id. reset_global_state() clears this slot at the end of the iteration.
		$this->memoizer->set_for_current_page( $context );
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
			$wp_query->is_single         = $this->previous_query_flags['is_single'];
			$wp_query->is_page           = $this->previous_query_flags['is_page'];
			$wp_query->is_singular       = $this->previous_query_flags['is_singular'];
		}

		// Drop the per-iteration current_page context primed by Schema_Piece_Repository::get(),
		// so the next iteration re-resolves cleanly.
		$this->memoizer->clear_for_current_page();
	}
}

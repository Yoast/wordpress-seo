<?php
/**
 * The meta tags context memoizer.
 *
 * @package Yoast\YoastSEO\Memoizers
 */

namespace Yoast\WP\SEO\Memoizers;

use Yoast\WP\SEO\Context\Meta_Tags_Context;
use Yoast\WP\SEO\Helpers\Blocks_Helper;
use Yoast\WP\SEO\Helpers\Current_Page_Helper;
use Yoast\WP\SEO\Models\Indexable;
use Yoast\WP\SEO\Repositories\Indexable_Repository;

/**
 * Class Meta_Tags_Context_Memoizer
 */
class Meta_Tags_Context_Memoizer {

	/**
	 * The blocks helper.
	 *
	 * @var Blocks_Helper
	 */
	private $blocks;

	/**
	 * The current page helper.
	 *
	 * @var Current_Page_Helper
	 */
	private $current_page;

	/**
	 * The indexable repository.
	 *
	 * @var Indexable_Repository
	 */
	private $repository;

	/**
	 * The meta tags context.
	 *
	 * @var Meta_Tags_Context
	 */
	private $context_prototype;

	/**
	 * The presentation memoizer.
	 *
	 * @var Presentation_Memoizer
	 */
	private $presentation_memoizer;

	/**
	 * The meta tags context.
	 *
	 * @var Meta_Tags_Context[]
	 */
	private $cache = [];

	/**
	 * Meta_Tags_Context_Memoizer constructor.
	 *
	 * @param Blocks_Helper         $blocks                The blocks helper.
	 * @param Current_Page_Helper   $current_page          The current page helper.
	 * @param Indexable_Repository  $repository            Indexable repository.
	 * @param Meta_Tags_Context     $context_prototype     The meta tags context prototype.
	 * @param Presentation_Memoizer $presentation_memoizer Memoizer for the presentation.
	 */
	public function __construct(
		Blocks_Helper $blocks,
		Current_Page_Helper $current_page,
		Indexable_Repository $repository,
		Meta_Tags_Context $context_prototype,
		Presentation_Memoizer $presentation_memoizer
	) {
		$this->blocks                = $blocks;
		$this->current_page          = $current_page;
		$this->repository            = $repository;
		$this->context_prototype     = $context_prototype;
		$this->presentation_memoizer = $presentation_memoizer;
	}

	/**
	 * Gets the meta tags context for the current page.
	 * This function is memoized so every call will return the same result.
	 *
	 * @return Meta_Tags_Context The meta tags context.
	 */
	public function for_current_page() {
		if ( ! isset( $this->cache['current_page'] ) ) {
			$indexable = $this->repository->for_current_page();
			$page_type = $this->current_page->get_page_type();

			if ( $indexable->permalink === null ) {
				$indexable->permalink = $this->get_permalink_for_indexable( $indexable );
				$indexable->save();
			}

			$this->cache['current_page'] = $this->get( $indexable, $page_type );
		}

		return $this->cache['current_page'];
	}

	/**
	 * Gets the meta tags context given an indexable.
	 * This function is memoized by the indexable so every call with the same indexable will yield the same result.
	 *
	 * @param Indexable $indexable The indexable.
	 * @param string    $page_type The page type.
	 *
	 * @return Meta_Tags_Context The meta tags context.
	 */
	public function get( Indexable $indexable, $page_type ) {
		if ( ! isset( $this->cache[ $indexable->id ] ) ) {
			$blocks = [];
			$post   = null;
			if ( $indexable->object_type === 'post' ) {
				$post   = \get_post( $indexable->object_id );
				$blocks = $this->blocks->get_all_blocks_from_content( $post->post_content );
			}

			$context               = $this->context_prototype->of( [
				'indexable' => $indexable,
				'blocks'    => $blocks,
				'post'      => $post,
				'page_type' => $page_type,
			] );
			$context->presentation = $this->presentation_memoizer->get( $indexable, $context, $page_type );

			$this->cache[ $indexable->id ] = $context;
		}

		return $this->cache[ $indexable->id ];
	}

	/**
	 * Clears the memoization of either a specific indexable or all indexables.
	 *
	 * @param Indexable|int|string $indexable Optional. The indexable or indexable id to clear the memoization of.
	 *                                        "current-page" clears the current-page context.
	 */
	public function clear( $indexable = null ) {
		if ( $indexable instanceof Indexable ) {
			unset( $this->cache[ $indexable->id ] );
			return;
		}
		if ( $indexable !== null ) {
			unset( $this->cache[ $indexable ] );
			return;
		}
		$this->cache = [];
	}

	/**
	 * Retrieves the permalink for an indexable.
	 *
	 * @param Indexable $indexable The indexable.
	 *
	 * @return string|null The permalink.
	 */
	protected function get_permalink_for_indexable( Indexable $indexable ) {
		switch ( true ) {
			case $this->current_page->is_simple_page():
			case $this->current_page->is_home_static_page():
			case $this->current_page->is_home_posts_page():
				return get_permalink( $indexable->object_id );
			case $this->current_page->is_term_archive():
				$term = get_term( $indexable->object_id );

				return get_term_link( $term, $term->taxonomy );
			case $this->current_page->is_search_result():
				return get_search_link();
			case $this->current_page->is_post_type_archive():
				return get_post_type_archive_link( $indexable->object_sub_type );
			case $this->current_page->is_author_archive():
				return get_author_posts_url( $indexable->object_id );
		}

		return null;
	}
}

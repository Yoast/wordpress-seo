<?php
/**
 * Post link builder.
 *
 * @package Yoast\WP\SEO\Builders
 */

namespace Yoast\WP\SEO\Builders;

use Yoast\WP\SEO\Models\SEO_Links;
use Yoast\WP\SEO\Repositories\Indexable_Repository;
use Yoast\WP\SEO\Repositories\SEO_Links_Repository;
use Yoast\WP\SEO\Repositories\SEO_Meta_Repository;

/**
 * Post_Link_Builder class
 */
class Post_Link_Builder {

	/**
	 * The SEO links repository.
	 *
	 * @var SEO_Links_Repository
	 */
	protected $seo_links_repository;

	/**
	 * The SEO links repository.
	 *
	 * @var SEO_Links_Repository
	 */
	protected $seo_meta_repository;

	/**
	 * The indexable repository.
	 *
	 * @var Indexable_Repository
	 */
	protected $indexable_repository;

	/**
	 * Post_Link_Builder constructor.
	 *
	 * @param SEO_Links_Repository $seo_links_repository The SEO links repository.
	 * @param SEO_Meta_Repository  $seo_meta_repository  The SEO meta repository.
	 * @param Indexable_Repository $indexable_repository The indexable repository.
	 */
	public function __construct(
		SEO_Links_Repository $seo_links_repository,
		SEO_Meta_Repository $seo_meta_repository,
		Indexable_Repository $indexable_repository
	) {
		$this->seo_links_repository = $seo_links_repository;
		$this->seo_meta_repository  = $seo_meta_repository;
		$this->indexable_repository = $indexable_repository;
	}

	/**
	 * Builds the links for a post.
	 *
	 * @param int    $post_id      The post ID.
	 * @param string $post_content The post content. Expected to be unfiltered.
	 *
	 * @return boo Whether or not links were created succesfully.
	 */
	public function build( $post_id, $post_content ) {
		$content = \apply_filters( 'the_content', $post_content );
		$content = \str_replace( ']]>', ']]&gt;', $content );

		$links = [];

		if ( strpos( $content, 'href' ) === false ) {
			// Nothing to do.
			return true;
		}

		$regexp = '<a\s[^>]*href=("??)([^" >]*?)\\1[^>]*>';
		// Used modifiers iU to match case insensitive and make greedy quantifiers lazy.
		if ( preg_match_all( "/$regexp/iU", $this->content, $matches, PREG_SET_ORDER ) ) {
			foreach ( $matches as $match ) {
				$links[] = trim( $match[2], "'" );
			}
		}

		// TODO: Consider if the indexable should instead be the input?
		$indexable   = $this->indexable_repository->find_by_id_and_type( $post_id, 'post' );
		$home_url    = \wp_parse_url( \home_url() );
		$current_url = \wp_parse_url( $indexable->permalink );
		$links       = \array_map(
			function( $link ) use ( $home_url, $indexable ) {
				$url   = \wp_parse_url( $link );

				/**
				 * @var SEO_Links
				 */
				$model = $this->seo_links_repository->query()->create( [
					'link'         => $link,
					'type'         => $this->get_link_type( $url, $home_url ),
					'indexable_id' => $indexable->id,
					'post_id'      => $indexable->object_id,
				] );

				if ( $model->type === SEO_Links::TYPE_INTERNAL ) {
					$permalink = $this->get_permalink( $link, $home_url );
					$target    = $this->indexable_repository->find_by_permalink( $permalink );

					$model->target_indexable_id = $target->id;
					if ( $target->object_type === 'post' ) {
						$model->target_post_id = $target->object_id;
					}
				}

				return [ $model, $url ];
			},
			$links
		);
		// Filter out links to the same page with a fragment or query.
		$links = \array_filter(
			$links,
			function ( $link_and_url ) use ( $current_url ) {
				$link = $link_and_url[0];
				$url  = $link_and_url[1];

				// Always keep external links.
				if ( $link->type === SEO_Links::TYPE_EXTERNAL ) {
					return true;
				}

				// Always keep links with an empty path or pointing to other pages.
				if ( isset( $url['path'] ) ) {
					return empty( $url['path'] ) || $url['path'] !== $current_url['path'];
				}

				// Only keep links to the current page without a fragment or query.
				return ( ! isset( $url['fragment'] ) && ! isset( $url['query'] ) );
			}
		);

		$old_links = $this->seo_links_repository->find_all_by_post_id( $post_id );
		$this->seo_links_repository->delete_all_by_post_id( $post_id );
		foreach ( $links as $link_and_url ) {
			$link = $link_and_url[0];
			$link->save();
		}

		// TODO: Update incoming counts for all new and old target post IDs.
		// TODO: Update outgoing counts for this post.
	}

	/**
	 * Returns the link type.
	 *
	 * @param array $url      The URL, as parsed by wp_parse_url.
	 * @param array $home_url The home URL, as parsed by wp_parse_url.
	 *
	 * @return string The link type.
	 */
	public function get_link_type( $url, $home_url ) {
		// If there is no scheme the link is always internal.
		if ( empty( $url['scheme'] ) ) {
			return SEO_Links::TYPE_INTERNAL;
		}

		// If there is a scheme but it's not https? then the link is always external.
		if ( ! in_array( $url['scheme'], [ 'http', 'https' ], true ) ) {
			return SEO_Links::TYPE_EXTERNAL;
		}
		// When the base host is equal to the host.
		if ( isset( $url['host'] ) && $url['host'] !== $home_url['host'] ) {
			return SEO_Links::TYPE_EXTERNAL;
		}

		// There is no base path.
		if ( empty( $home_url['path'] ) ) {
			return SEO_Links::TYPE_INTERNAL;
		}

		// When there is a path and it matches the start of the url.
		if ( isset( $url['path'] ) && strpos( $url['path'], $home_url['path'] ) !== 0 ) {
			return SEO_Links::TYPE_INTERNAL;
		}

		return SEO_Links::TYPE_EXTERNAL;
	}

	/**
	 * Returns a cleaned permalink for a given link.
	 *
	 * @param string $link     The raw URL.
	 * @param array  $home_url The home URL, as parsed by wp_parse_url.
	 *
	 * @return string The cleaned permalink.
	 */
	public function get_permalink( $link, $home_url ) {
		// Get rid of the #anchor.
		$url_split = explode( '#', $link );
		$link       = $url_split[0];

		// Get rid of URL ?query=string.
		$url_split = explode( '?', $link );
		$link       = $url_split[0];

		// Set the correct URL scheme.
		$link = set_url_scheme( $link, $home_url['scheme'] );

		// Add 'www.' if it is absent and should be there.
		if ( false !== strpos( home_url(), '://www.' ) && false === strpos( $link, '://www.' ) ) {
			$link = str_replace( '://', '://www.', $link );
		}

		// Strip 'www.' if it is present and shouldn't be.
		if ( false === strpos( home_url(), '://www.' ) ) {
			$link = str_replace( '://www.', '://', $link );
		}

		return $link;
	}
}

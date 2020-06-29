<?php
/**
 * Post link builder.
 *
 * @package Yoast\WP\SEO\Builders
 */

namespace Yoast\WP\SEO\Builders;

use Yoast\WP\SEO\Helpers\Image_Helper;
use Yoast\WP\SEO\Helpers\Url_Helper;
use Yoast\WP\SEO\Models\Indexable;
use Yoast\WP\SEO\Models\SEO_Links;
use Yoast\WP\SEO\Repositories\Indexable_Repository;
use Yoast\WP\SEO\Repositories\SEO_Links_Repository;

/**
 * Indexable_Link_Builder class
 */
class Indexable_Link_Builder {

	/**
	 * The SEO links repository.
	 *
	 * @var SEO_Links_Repository
	 */
	protected $seo_links_repository;

	/**
	 * The url helper.
	 *
	 * @var Url_Helper
	 */
	protected $url_helper;

	/**
	 * The image helper.
	 *
	 * @var Image_Helper
	 */
	protected $image_helper;

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
	 */
	public function __construct(
		SEO_Links_Repository $seo_links_repository,
		Url_Helper $url_helper
	) {
		$this->seo_links_repository = $seo_links_repository;
		$this->url_helper           = $url_helper;
	}

	/**
	 * Sets the indexable repository.
	 *
	 * @required
	 *
	 * @param Indexable_Repository $indexable_repository The indexable repository.
	 * @param Image_Helper         $image_helper         The image helper.
	 *
	 * @return void
	 */
	public function set_dependencies(
		Indexable_Repository $indexable_repository,
		Image_Helper $image_helper
	) {
		$this->indexable_repository = $indexable_repository;
		$this->image_helper         = $image_helper;
	}

	/**
	 * Builds the links for a post.
	 *
	 * @param Indexable $indexable The indexable.
	 * @param string    $content   The content. Expected to be unfiltered.
	 *
	 * @return SEO_Links[] The created SEO links.
	 */
	public function build( $indexable, $content ) {
		if ( ! apply_filters( 'wpseo_should_index_links', true ) ) {
			return;
		}

		if ( $indexable->object_type === 'post' ) {
			$content = \apply_filters( 'the_content', $content );
		}

		$content = \str_replace( ']]>', ']]&gt;', $content );
		$links   = $this->gather_links( $content );
		$images  = $this->gather_images( $content );

		if ( empty( $links ) && empty( $images ) ) {
			$indexable->link_count = 0;
			$indexable->save();
			return [];
		}

		// TODO: Consider if the indexable should instead be the input?
		$home_url    = \wp_parse_url( \home_url() );
		$current_url = \wp_parse_url( $indexable->permalink );
		$links       = \array_map(
			function( $link ) use ( $home_url, $indexable ) {
				return $this->create_internal_link( $link, $home_url, $indexable );
			},
			$links
		);
		// Filter out links to the same page with a fragment or query.
		$links = \array_filter(
			$links,
			function ( $link ) use ( $current_url ) {
				return $this->filter_link( $link, $current_url );
			}
		);

		$images = \array_map(
			function( $link ) use ( $home_url, $indexable ) {
				return $this->create_internal_link( $link, $home_url, $indexable, true );
			},
			$images
		);
		$links = \array_merge( $links, $images );

		$updated_indexable_ids = [];
		$internal_link_count   = 0;
		$old_links             = $this->seo_links_repository->find_all_by_indexable_id( $indexable->id );
		$this->seo_links_repository->delete_all_by_indexable_id( $indexable->id );
		foreach ( $links as $link ) {
			$link->save();
			$updated_indexable_ids[] = $link->target_indexable_id;
			if ( $link->type === SEO_Links::TYPE_INTERNAL ) {
				$internal_link_count += 1;
			}
		}
		foreach ( $old_links as $link ) {
			$updated_indexable_ids[] = $link->target_indexable_id;
		}

		$this->update_incoming_links_for_related_indexables( $updated_indexable_ids );
		$indexable->link_count = $internal_link_count;
		$indexable->save();

		return $links;
	}

	/**
	 * Deletes all SEO links for an indexable.
	 *
	 * @param Indexable $indexable The indexable.
	 *
	 * @return void
	 */
	public function delete( $indexable ) {
		if ( ! apply_filters( 'wpseo_should_index_links', true ) ) {
			return;
		}

		$links = ($this->seo_links_repository->find_all_by_indexable_id( $indexable->id ));
		$this->seo_links_repository->delete_all_by_indexable_id( $indexable->id );

		$linked_indexable_ids = [];
		foreach ( $links as $link ) {
			$linked_indexable_ids[] = $link->target_indexable_id;
		}

		$this->update_incoming_links_for_related_indexables( $linked_indexable_ids );
	}

	/**
	 * Gathers all links from content.
	 *
	 * @param string $content The content.
	 *
	 * @return string[] An array of urls.
	 */
	protected function gather_links( $content ) {
		if ( strpos( $content, 'href' ) === false ) {
			// Nothing to do.
			return [];
		}

		$links  = [];
		$regexp = '<a\s[^>]*href=("??)([^" >]*?)\1[^>]*>';
		// Used modifiers iU to match case insensitive and make greedy quantifiers lazy.
		if ( \preg_match_all( "/$regexp/iU", $content, $matches, PREG_SET_ORDER ) ) {
			foreach ( $matches as $match ) {
				$links[] = trim( $match[2], "'" );
			}
		}

		return $links;
	}

	/**
	 * Gathers all images from content.
	 *
	 * @param string $content The content.
	 *
	 * @return string[] An array of urls.
	 */
	protected function gather_images( $content ) {
		if ( strpos( $content, 'src' ) === false ) {
			// Nothing to do.
			return [];
		}

		$images = [];
		$regexp = '<img\s[^>]*src=("??)([^" >]*?)\\1[^>]*>';
		// Used modifiers iU to match case insensitive and make greedy quantifiers lazy.
		if ( preg_match_all( "/$regexp/iU", $content, $matches, PREG_SET_ORDER ) ) {
			foreach ( $matches as $match ) {
				$images[] = trim( $match[2], "'" );
			}
		}

		return $images;
	}

	/**
	 * Creates an internal link.
	 *
	 * @param string    $url       The url of the link.
	 * @param array     $home_url  The home url, as parsed by wp_parse_url.
	 * @param Indexable $indexable The indexable of the post containing the link.
	 * @param bool      $is_image  Whether or not the link is an image.
	 *
	 * @return SEO_Links The created link.
	 */
	protected function create_internal_link( $url, $home_url, $indexable, $is_image = false ) {
		$parsed_url = \wp_parse_url( $url );
		$link_type  = $this->url_helper->get_link_type( $parsed_url, $home_url, $is_image );

		/**
		 * @var SEO_Links
		 */
		$model = $this->seo_links_repository->query()->create( [
			'url'          => $url,
			'type'         => $link_type,
			'indexable_id' => $indexable->id,
			'post_id'      => $indexable->object_id,
		] );
		$model->parsed_url = $parsed_url;

		if ( $model->type === SEO_Links::TYPE_INTERNAL || $model->type === SEO_Links::TYPE_INTERNAL_IMAGE ) {
			$permalink = $this->get_permalink( $url, $home_url );
			$target    = $this->indexable_repository->find_by_permalink( $permalink );

			if ( ! $target ) {
				if ( $model->type === SEO_Links::TYPE_INTERNAL ) {
					$post_id = \url_to_postid( $permalink );
				}
				else {
					$post_id = $this->image_helper->get_attachment_by_url( $permalink );
				}
				$target = $this->indexable_repository->find_by_id_and_type( $post_id, 'post' );
			}

			$model->target_indexable_id = $target->id;
			if ( $target->object_type === 'post' ) {
				$model->target_post_id = $target->object_id;
			}
		}

		return $model;
	}

	/**
	 * Filters out links that point to the same page with a fragment or query.
	 *
	 * @param SEO_Links $link        The link.
	 * @param array     $current_url The url of the page the link is on, as parsed by wp_parse_url.
	 *
	 * @return bool. Whether or not the link should be filtered.
	 */
	protected function filter_link( SEO_Links $link, $current_url ) {
		$url  = $link->parsed_url;

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

	/**
	 * Returns a cleaned permalink for a given link.
	 *
	 * @param string $link     The raw URL.
	 * @param array  $home_url The home URL, as parsed by wp_parse_url.
	 *
	 * @return string The cleaned permalink.
	 */
	protected function get_permalink( $link, $home_url ) {
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

	/**
	 * Updates incoming link counts for related indexables.
	 *
	 * @param int[] $related_indexable_ids The IDs of all related indexables.
	 *
	 * @return void
	 */
	protected function update_incoming_links_for_related_indexables( $related_indexable_ids ) {
		$counts = $this->seo_links_repository->get_incoming_link_counts_for_indexable_ids( $related_indexable_ids );
		foreach ( $counts as $count ) {
			$this->indexable_repository->update_incoming_link_count( $count['indexable_id'], $count['incoming'] );
		}
	}
}

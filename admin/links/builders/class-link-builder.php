<?php
/**
 * WPSEO plugin file.
 *
 * @package WPSEO\Admin\Links
 */

/**
 * Represents the content processor. It will extract links from the content and
 * saves them for the given post id.
 */
class WPSEO_Link_Builder {

	/**
	 * Holds the link storage instance.
	 *
	 * @var WPSEO_Link_Storage
	 */
	protected $storage;

	/**
	 * Holds the meta storage instance.
	 *
	 * @var WPSEO_Meta_Storage
	 */
	private $count_storage;

	/**
	 * @var string
	 */
	private $current_page_path;

	/**
	 * Sets an instance of a storage object.
	 *
	 * @param WPSEO_Link_Storage $storage       The storage object to use.
	 * @param WPSEO_Meta_Storage $count_storage The storage object for the link
	 *                                          counts.
	 */
	public function __construct( WPSEO_Link_Storage $storage, WPSEO_Meta_Storage $count_storage ) {
		$this->storage       = $storage;
		$this->count_storage = $count_storage;
	}

	/**
	 * Process the content for the given post id.
	 *
	 * @param int    $post_id The post id.
	 * @param string $content The content to process.
	 */
	public function build( $post_id, $content ) {
		$link_extractor = new WPSEO_Link_Extractor( $content );
		$link_classifier = new WPSEO_Link_Type_Classifier( home_url() );

		$this->current_page_path = untrailingslashit( WPSEO_Link_Utils::get_url_part( get_permalink( $post_id ), 'path' ) );

		$extracted_links = $link_extractor->extract();

		$extracted_links = array_map(
			function( $link ) use ( $link_classifier ) {
				$link_type = $link_classifier->classify( $link );

				$target_post_id = 0;
				if ( $link_type === WPSEO_Link::TYPE_INTERNAL ) {
					$target_post_id = url_to_postid( $link );
				}

				return new WPSEO_Link( $link, $target_post_id, $link_type );
			},
			$extracted_links
		);

		$filtered_links = array_filter(
			$extracted_links,
			[ $this, 'internal_link_with_fragment_filter']
		);

		$internal_links = array_filter( $filtered_links, [ $this, 'filter_internal_link' ] );

		$stored_links = $this->get_stored_internal_links( $post_id );

		$this->storage->cleanup( $post_id );
		$this->storage->save_links( $post_id, $filtered_links );

		$this->update_link_counts( $post_id, count( $internal_links ), array_merge( $stored_links, $internal_links ) );
	}

	/**
	 * Filters all internal links that contains an fragment in the URL.
	 *
	 * @param WPSEO_Link $link The link that might be filtered.
	 *
	 * @return bool False when url contains a fragment.
	 */
	public function internal_link_with_fragment_filter( WPSEO_Link $link ) {
		// When the type is external.
		if ( $link->get_type() === WPSEO_Link::TYPE_EXTERNAL ) {
			return true;
		}

		$url_parts = wp_parse_url( $link->get_url() );

		if ( isset( $url_parts['path'] ) ) {
			return ! $this->is_current_page( untrailingslashit( $url_parts['path'] ) );
		}

		return ( ! isset( $url_parts['fragment'] ) && ! isset( $url_parts['query'] ) );
	}

	/**
	 * Is the url path the same as the current page path.
	 *
	 * @param string $url_path The url path.
	 *
	 * @return bool True when path is equal to the current page path.
	 */
	protected function is_current_page( $url_path ) {
		return ( ! empty( $url_path ) && $url_path === $this->current_page_path );
	}

	/**
	 * Builds the link.
	 *
	 * @param string $link The link to build.
	 *
	 * @return WPSEO_Link The built link.
	 */
	public function build_link( $link ) {
		$link_type = $this->classifier->classify( $link );

		$target_post_id = 0;
		if ( $link_type === WPSEO_Link::TYPE_INTERNAL ) {
			$target_post_id = $this->internal_lookup->lookup( $link );
		}

		return new WPSEO_Link( $link, $target_post_id, $link_type );
	}

	/**
	 * Updates the link counts for the post and referenced posts.
	 *
	 * @param int      $post_id Post to update link counts for.
	 * @param int|null $count   Number of internal links.
	 * @param array    $links   Links to process for incoming link count update.
	 */
	public function update_link_counts( $post_id, $count, array $links ) {
		$this->store_internal_link_count( $post_id, $count );
		$this->update_incoming_links( $post_id, $links );
	}

	/**
	 * Retrieves the stored internal links for the supplied post.
	 *
	 * @param int $post_id The post to fetch links for.
	 *
	 * @return WPSEO_Link[] List of internal links connected to the post.
	 */
	public function get_stored_internal_links( $post_id ) {
		$links = $this->storage->get_links( $post_id );
		return array_filter( $links, [ $this, 'filter_internal_link' ] );
	}

	/**
	 * Filters on INTERNAL links.
	 *
	 * @param WPSEO_Link $link Link to test type of.
	 *
	 * @return bool True for internal link, false for external link.
	 */
	protected function filter_internal_link( WPSEO_Link $link ) {
		return $link->get_type() === WPSEO_Link::TYPE_INTERNAL;
	}

	/**
	 * Stores the total links for the post.
	 *
	 * @param int $post_id             The post id.
	 * @param int $internal_link_count Total amount of links in the post.
	 *
	 * @return void
	 */
	protected function store_internal_link_count( $post_id, $internal_link_count ) {
		$this->count_storage->save_meta_data( $post_id, [ 'internal_link_count' => $internal_link_count ] );
	}

	/**
	 * Updates the incoming link count.
	 *
	 * @param int          $post_id Post which is processed, this needs to be recalculated too.
	 * @param WPSEO_Link[] $links   Links to update the incoming link count of.
	 *
	 * @return void
	 */
	protected function update_incoming_links( $post_id, $links ) {
		$post_ids = $this->get_internal_post_ids( $links );
		$post_ids = array_merge( [ $post_id ], $post_ids );
		$this->count_storage->update_incoming_link_count( $post_ids, $this->storage );
	}

	/**
	 * Extract the post IDs from the links.
	 *
	 * @param WPSEO_Link[] $links Links to update the incoming link count of.
	 *
	 * @return int[] List of post IDs.
	 */
	protected function get_internal_post_ids( $links ) {
		$post_ids = [];
		foreach ( $links as $link ) {
			$post_ids[] = $link->get_target_post_id();
		}

		return array_filter( $post_ids );
	}
}

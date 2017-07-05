<?php
/**
 * @package WPSEO\Admin\Links
 */

/**
 * Represents the content processor. It will extract links from the content and
 * saves them for the given post id.
 */
class WPSEO_Link_Content_Processor {

	/** @var WPSEO_Link_Storage */
	protected $storage;

	/** @var WPSEO_Meta_Storage */
	private $count_storage;

	/**
	 * Sets an instance of a storage object.
	 *
	 * @param WPSEO_Link_Storage $storage       The storage object to use.
	 * @param WPSEO_Meta_Storage $count_storage The storage object for the link
	 *                                          counts.
	 */
	public function __construct( WPSEO_Link_Storage $storage, WPSEO_Meta_Storage $count_storage ) {
		$this->storage = $storage;
		$this->count_storage = $count_storage;
	}

	/**
	 * Process the content for the given post id.
	 *
	 * @param int    $post_id The post id.
	 * @param string $content The content to process.
	 */
	public function process( $post_id, $content ) {
		$link_extractor = new WPSEO_Link_Extractor( $content );
		$link_processor = new WPSEO_Link_Factory(
			new WPSEO_Link_Type_Classifier( site_url() ),
			new WPSEO_Link_Internal_Lookup(),
			new WPSEO_Link_Filter( get_permalink( $post_id ) )
		);

		$extracted_links = $link_extractor->extract();
		$links = $link_processor->build( $extracted_links );
		$internal_links = array();
		/** @var WPSEO_Link $link */
		foreach ( $links as $link ) {
			if ( $link->get_type() === WPSEO_Link::TYPE_INTERNAL ) {
				$internal_links[] = $link;
			}
		}

		$this->store_links( $post_id, $links );
		$this->store_internal_link_count( $post_id, count( $internal_links ) );
	}

	/**
	 * Stores the links.
	 *
	 * @param int          $post_id The post id.
	 * @param WPSEO_Link[] $links   The links to store.
	 */
	protected function store_links( $post_id, array $links ) {
		$this->storage->cleanup( $post_id );
		$this->storage->save_links( $post_id, $links );
	}

	/**
	 * Stores the total links for the post.
	 *
	 * @param int $post_id             The post id.
	 * @param int $internal_link_count Total amount of links in the post.
	 */
	protected function store_internal_link_count( $post_id, $internal_link_count ) {
		$this->count_storage->cleanup( $post_id );
		$this->count_storage->save_meta_data( $post_id, array( 'internal_link_count' => $internal_link_count ) );

		// When there are unprocess posts, just break out of this.
		if ( ! WPSEO_Link_Query::has_unprocessed_posts( WPSEO_Link_Utils::get_public_post_types() ) ) {
			$this->count_storage->update_incoming_link_counts( $this->storage );
		}
	}
}

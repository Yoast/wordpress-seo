<?php
/**
 * @package WPSEO\Admin\Links
 */

/**
 * Represents the content processor. It will extract links from the content and saves them for the given post id.
 */
class WPSEO_Link_Content_Processor {

	/** @var WPSEO_Link_Storage */
	protected $storage;

	/**
	 * Sets an instance of a storage object.
	 *
	 * @param WPSEO_Link_Storage $storage The storage object to use.
	 */
	public function __construct( WPSEO_Link_Storage $storage ) {
		$this->storage = $storage;
	}

	/**
	 * Process the content for the given post id.
	 *
	 * @param int    $post_id The post id.
	 * @param string $content The content to process.
	 */
	public function process( $post_id, $content ) {
		$link_extractor = new WPSEO_Link_Extractor( $content );
		$link_processor = new WPSEO_Link_Factory( new WPSEO_Link_Type_Classifier( site_url() ), new WPSEO_Link_Internal_Lookup() );

		$extracted_links = $link_extractor->extract();
		$links = $link_processor->build( $extracted_links );

		$this->store_links( $post_id, $links );
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

		// Update post meta to flag that processing has been done.
		update_post_meta( $post_id, WPSEO_Link_Factory::get_index_meta_key(), '1' );
	}
}

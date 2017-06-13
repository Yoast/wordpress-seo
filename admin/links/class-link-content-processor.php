<?php
/**
 * @package WPSEO\Admin\Links
 */

/**
 * Represents the content processor. It will extract links from the content and saves them for the given post id.
 */
class WPSEO_Link_Content_Processor {

	/**
	 * Process the content for the given post id.
	 *
	 * @param int    $post_id The post id.
	 * @param string $content The content to process.
	 */
	public function process( $post_id, $content ) {
		global $wpdb;

		$link_extractor = new WPSEO_Link_Extractor( $content );
		$link_processor = new WPSEO_Link_Factory( new WPSEO_Link_Type_Classifier( site_url() ), new WPSEO_Link_Internal_Lookup() );
		$links = $link_processor->build( $link_extractor->extract() );

		$storage = new WPSEO_Link_Storage( $wpdb->get_blog_prefix() );
		$storage->cleanup( $post_id );
		$storage->save_links( $post_id, $links );
	}
}
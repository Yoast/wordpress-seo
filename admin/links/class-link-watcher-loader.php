<?php
/**
 * WPSEO plugin file.
 *
 * @package WPSEO\Admin\Links
 */

/**
 * Represents the loader for link watcher.
 */
class WPSEO_Link_Watcher_Loader {

	/**
	 * Loads the link watcher.
	 *
	 * @return void
	 */
	public function load() {
		$storage           = new WPSEO_Link_Storage();
		$count_storage     = new WPSEO_Meta_Storage();
		$content_processor = new WPSEO_Link_Content_Processor( $storage, $count_storage );
		$link_watcher      = new WPSEO_Link_Watcher( $content_processor );
		$link_watcher->register_hooks();
	}
}

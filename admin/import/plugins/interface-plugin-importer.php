<?php
/**
 * @package WPSEO\Admin\Import\Plugins
 */

/**
 * Class WPSEO_Plugin_Importer
 *
 * Class with functionality to import Yoast SEO settings from other plugins
 */
interface WPSEO_Plugin_Importer {
	/**
	 * Imports the settings and post meta data from another SEO plugin.
	 *
	 * @return WPSEO_Import_Status
	 */
	public function import();

	/**
	 * Cleans up the data from another SEO plugin (preferably after a successful import).
	 *
	 * @return WPSEO_Import_Status
	 */
	public function cleanup();

	/**
	 * Returns the string for the plugin we're importing from.
	 *
	 * @return string
	 */
	public function plugin_name();

	/**
	 * Detects whether an import for this plugin is needed.
	 *
	 * @return WPSEO_Import_Status
	 */
	public function detect();
}

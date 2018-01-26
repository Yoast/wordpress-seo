<?php
/**
 * @package WPSEO\Admin\Import\External
 */

/**
 * Class WPSEO_Import_External
 *
 * Class with functionality to import Yoast SEO settings from other plugins
 */
interface WPSEO_External_Importer {
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

}
<?php
/**
 * @package WPSEO\XML_Sitemaps
 */

/**
 * Cache Data interface
 */
interface WPSEO_Sitemap_Cache_Data_Interface {

	/**
	 * Status for normal, usable sitemap.
	 */
	const OK = 'ok';
	/**
	 * Status for unusable sitemap.
	 */
	const ERROR = 'error';

	/**
	 * Status for unusable sitemap because it cannot be identified.
	 */
	const UNKNOWN = 'unknown';

	/**
	 * Set the content of the sitemap
	 *
	 * @param string $sitemap The XML content of the sitemap.
	 *
	 * @return void
	 */
	public function set_sitemap( $sitemap );

	/**
	 * Set the status of the sitemap
	 *
	 * @param bool|string $usable True/False or 'ok'/'error' for status.
	 *
	 * @return void
	 */
	public function set_status( $usable );

	/**
	 * @return string The XML content of the sitemap.
	 */
	public function get_sitemap();

	/**
	 * Get the status of this sitemap
	 *
	 * @return string Status 'ok', 'error' or 'unknown'.
	 */
	public function get_status();

	/**
	 * Is the sitemap content usable
	 *
	 * @param null|bool $usable If set; adjust error to value.
	 *
	 * @return bool True if the sitemap is usable, False if not.
	 */
	public function is_usable( $usable = null );
}

<?php
/**
 * @package WPSEO\Premium
 */

/**
 * An interface for registering integrations with WordPress
 */
interface WPSEO_WordPress_Integration {

	/**
	 * Registers all hooks to WordPress
	 */
	public function register_hooks();
}

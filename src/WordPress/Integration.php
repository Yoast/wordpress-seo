<?php

namespace Yoast\WordPress;

/**
 * An interface for registering integrations with WordPress
 */
interface Integration {
	/**
	 * Registers all hooks to WordPress.
	 */
	public function register_hooks();
}

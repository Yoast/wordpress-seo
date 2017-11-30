<?php

namespace Yoast\YoastSEO\Services;

use Yoast\WordPress\Integration;

class Indexable implements Integration {

	/** @var Integration[] List of watchers */
	protected $watchers = array();

	/**
	 * Adds a watcher to the stack.
	 *
	 * @param Integration $watcher Watcher to register.
	 */
	public function add_watcher( Integration $watcher ) {
		$this->watchers[] = $watcher;
	}

	/**
	 * Registers all hooks to WordPress.
	 */
	public function register_hooks() {
		foreach ( $this->watchers as $watcher ) {
			$watcher->register_hooks();
		}
	}
}

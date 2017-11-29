<?php

namespace Yoast\YoastSEO;

use Yoast\WordPress\Integration;

class Meta_Service implements Integration {

	/**
	 * Registers all hooks to WordPress.
	 */
	public function register_hooks() {
		add_action( 'save_post', array( $this, 'save_post' ) );
	}

	/**
	 * @param int $id Post ID.
	 */
	public function save_post( $id ) {
	}
}

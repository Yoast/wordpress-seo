<?php

/**
 * WPSEO plugin test file.
 *
 * @package Yoast\Tests\Doubles\Oauth
 */

namespace Yoast\WP\Free\Tests\Doubles\Presentations;

use Yoast\WP\Free\Presentations\Indexable_Presentation;

/**
 * Test Helper Class.
 */
class Indexable_Presentation_Double extends Indexable_Presentation {

	/**
	 * @inheritDoc
	 */
	public function get_attachment_url_by_id( $attachment_id ) {
		return parent::get_attachment_url_by_id( $attachment_id );
	}

	/**
	 * @inheritDoc
	 */
	public function get_default_og_image() {
		return parent::get_default_og_image();
	}
}

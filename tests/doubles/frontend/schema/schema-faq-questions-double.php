<?php

namespace Yoast\WP\SEO\Tests\Doubles\Frontend\Schema;

use WPSEO_Schema_FAQ_Questions;

/**
 * Test Helper Class.
 */
class Schema_FAQ_Questions_Double extends WPSEO_Schema_FAQ_Questions {

	/**
	 * Generate a Question piece.
	 *
	 * @param array $question The question to generate schema for.
	 *
	 * @return array Schema.org Question piece.
	 */
	public function generate_question_block( $question ) {
		return parent::generate_question_block( $question );
	}
}

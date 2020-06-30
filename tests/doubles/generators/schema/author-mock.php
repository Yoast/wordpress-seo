<?php

namespace Yoast\WP\SEO\Tests\Doubles\Generators\Schema;

use Yoast\WP\SEO\Generators\Schema\Author;

class Author_Mock extends Author {

	/**
	 * @inheritDoc
	 */
	public function build_person_data( $user_id ) {
		return parent::build_person_data( $user_id );
	}
}

<?php

namespace Yoast\WP\SEO\Tests\Doubles\Generators\Schema;

use Yoast\WP\SEO\Context\Meta_Tags_Context as Meta_Tags_Context_Original;
use Yoast\WP\SEO\Generators\Schema\Author;

class Author_Mock extends Author {

	/**
	 * @inheritDoc
	 */
	public function build_person_data( $user_id ) {
		return parent::build_person_data( $user_id );
	}
}

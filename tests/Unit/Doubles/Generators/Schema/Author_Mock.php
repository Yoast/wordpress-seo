<?php

namespace Yoast\WP\SEO\Tests\Unit\Doubles\Generators\Schema;

use Yoast\WP\SEO\Generators\Schema\Author;

/**
 * Author mock object.
 */
class Author_Mock extends Author {

	/**
	 * Builds our array of Schema Person data for a given user ID.
	 *
	 * @param int $user_id The user ID to use.
	 *
	 * @return array An array of Schema Person data.
	 */
	public function build_person_data( $user_id, $add_hash = false ) {
		return parent::build_person_data( $user_id, $add_hash );
	}
}

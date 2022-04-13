<?php
// @phpcs:disable Yoast.NamingConventions.NamespaceName.TooLong -- This namespace should reflect the namespace of the extended class.
namespace Yoast\WP\SEO\Tests\Unit\Doubles\Generators\Schema\Third_Party;

use Yoast\WP\SEO\Generators\Schema\Third_Party\CoAuthor;

/**
 * CoAuthor mock object.
 */
class CoAuthor_Mock extends CoAuthor {

	/**
	 * Generate the Person data given a user ID.
	 *
	 * @param int $user_id User ID.
	 *
	 * @return array|bool
	 */
	public function generate_from_user_id( $user_id ) {
		return parent::generate_from_user_id( $user_id );
	}
}

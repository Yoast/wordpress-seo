<?php
// phpcs:disable Yoast.NamingConventions.NamespaceName.TooLong -- Needed in the folder structure.
// phpcs:disable Yoast.NamingConventions.NamespaceName.MaxExceeded
namespace Yoast\WP\SEO\Tests\Unit\AI_Authorization\Infrastructure\Refresh_Token_User_Meta_Repository;

use Yoast\WP\SEO\Helpers\User_Helper;

/**
 * Tests the Refresh_Token_User_Meta_Repository constructor.
 *
 * @group ai-authorization
 * @covers \Yoast\WP\SEO\AI_Authorization\Infrastructure\Refresh_Token_User_Meta_Repository::__construct
 */
final class Constructor_Test extends Abstract_Refresh_Token_User_Meta_Repository_Test {

	/**
	 * Tests the constructor.
	 *
	 * @return void
	 */
	public function test_constructor() {
		$this->assertInstanceOf(
			User_Helper::class,
			$this->getPropertyValue( $this->instance, 'user_helper' )
		);
	}
}

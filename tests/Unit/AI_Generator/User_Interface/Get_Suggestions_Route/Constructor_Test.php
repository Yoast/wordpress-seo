<?php
// phpcs:disable Yoast.NamingConventions.NamespaceName.TooLong -- Needed in the folder structure.
// phpcs:disable Yoast.NamingConventions.NamespaceName.MaxExceeded
namespace Yoast\WP\SEO\Tests\Unit\AI_Generator\User_Interface\Get_Suggestions_Route;

use Yoast\WP\SEO\AI_Generator\Application\Suggestions_Provider;

/**
 * Tests the Get_Suggestions_Route's construct method.
 *
 * @group ai-generator
 *
 * @covers \Yoast\WP\SEO\AI_Generator\User_Interface\Get_Suggestions_Route::__construct
 */
final class Constructor_Test extends Abstract_Get_Suggestions_Route_Test {

	/**
	 * Tests the constructor.
	 *
	 * @return void
	 */
	public function test_constructor() {
		$this->assertInstanceOf(
			Suggestions_Provider::class,
			$this->getPropertyValue( $this->instance, 'suggestions_provider' )
		);
	}
}

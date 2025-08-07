<?php
// phpcs:disable Yoast.NamingConventions.NamespaceName.TooLong -- Needed in the folder structure.
// phpcs:disable Yoast.NamingConventions.NamespaceName.MaxExceeded
namespace Yoast\WP\SEO\Tests\Unit\AI_Authorization\Application\Code_Verifier_Handler;

use Yoast\WP\SEO\AI_Authorization\Infrastructure\Code_Verifier_User_Meta_Repository;
use Yoast\WP\SEO\Helpers\Date_Helper;

/**
 * Tests the Code_Verifier_Handler constructor.
 *
 * @group ai-authorization
 *
 * @covers \Yoast\WP\SEO\AI_Authorization\Application\Code_Verifier_Handler::__construct
 */
final class Constructor_Test extends Abstract_Code_Verifier_Handler_Test {

	/**
	 * Tests the constructor.
	 *
	 * @return void
	 */
	public function test_constructor() {
		$this->assertInstanceOf(
			Date_Helper::class,
			$this->getPropertyValue( $this->instance, 'date_helper' )
		);
		$this->assertInstanceOf(
			Code_Verifier_User_Meta_Repository::class,
			$this->getPropertyValue( $this->instance, 'code_verifier_repository' )
		);
	}
}

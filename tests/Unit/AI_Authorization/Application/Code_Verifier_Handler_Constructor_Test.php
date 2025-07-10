<?php
// phpcs:disable Yoast.NamingConventions.NamespaceName.TooLong -- Needed in the folder structure.
// phpcs:disable Yoast.NamingConventions.ObjectNameDepth.MaxExceeded
namespace Unit\AI_Authorization\Application;

use Yoast\WP\SEO\AI_Authorization\Infrastructure\Code_Verifier_User_Meta_Repository;
use Yoast\WP\SEO\Helpers\Date_Helper;
use Yoast\WP\SEO\Tests\Unit\AI_Authorization\Application\Abstract_Code_Verifier_Handler_Test;

/**
 * Tests the constructor of the Code_Verifier_Handler class.
 *
 * @group ai-authorization
 *
 * @coversDefaultClass \Yoast\WP\SEO\AI_Authorization\Application\Code_Verifier_Handler
 */
final class Code_Verifier_Handler_Constructor_Test extends Abstract_Code_Verifier_Handler_Test {

	/**
	 * Tests if the needed attributes are set correctly.
	 *
	 * @covers ::__construct
	 *
	 * @return void
	 */
	public function test_constructor(): void {
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

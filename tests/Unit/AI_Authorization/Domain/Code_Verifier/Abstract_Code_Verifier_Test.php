<?php
// phpcs:disable Yoast.NamingConventions.NamespaceName.TooLong -- Needed in the folder structure.
// phpcs:disable Yoast.NamingConventions.NamespaceName.MaxExceeded
namespace Yoast\WP\SEO\Tests\Unit\AI_Authorization\Domain\Code_Verifier;

use Yoast\WP\SEO\AI_Authorization\Domain\Code_Verifier;
use Yoast\WP\SEO\Tests\Unit\TestCase;

/**
 * Abstract class for Code_Verifier tests.
 *
 * @group ai-authorization
 */
abstract class Abstract_Code_Verifier_Test extends TestCase {

	/**
	 * The instance to test.
	 *
	 * @var Code_Verifier
	 */
	protected $instance;

	/**
	 * Setup the test.
	 *
	 * @return void
	 */
	protected function setUp(): void {
		parent::setUp();
		$code       = 'test_value';
		$created_at = ( \time() + 3600 );

		$this->instance = new Code_Verifier( $code, $created_at );
	}
}

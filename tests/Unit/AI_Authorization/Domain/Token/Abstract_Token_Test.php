<?php
// phpcs:disable Yoast.NamingConventions.NamespaceName.TooLong -- Needed in the folder structure.
// phpcs:disable Yoast.NamingConventions.NamespaceName.MaxExceeded
namespace Yoast\WP\SEO\Tests\Unit\AI_Authorization\Domain\Token;

use Yoast\WP\SEO\AI_Authorization\Domain\Token;
use Yoast\WP\SEO\Tests\Unit\TestCase;

/**
 * Abstract class for Token tests.
 *
 * @group ai-authorization
 */
abstract class Abstract_Token_Test extends TestCase {

	/**
	 * The instance to test.
	 *
	 * @var Token
	 */
	protected $instance;

	/**
	 * Setup the test.
	 *
	 * @return void
	 */
	protected function setUp(): void {
		parent::setUp();
		$value      = 'test_value';
		$expiration = ( \time() + 3600 );

		$this->instance = new Token( $value, $expiration );
	}
}

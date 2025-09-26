<?php
// phpcs:disable Yoast.NamingConventions.NamespaceName.TooLong -- Needed in the folder structure.
// phpcs:disable Yoast.NamingConventions.NamespaceName.MaxExceeded
namespace Yoast\WP\SEO\Tests\Unit\AI\Consent\Application\Consent_Handler;

use Mockery;
use Yoast\WP\SEO\AI\Consent\Application\Consent_Handler;
use Yoast\WP\SEO\Helpers\User_Helper;
use Yoast\WP\SEO\Tests\Unit\TestCase;

/**
 * Abstract class for Consent_Handler tests.
 *
 * @group ai-consent
 */
abstract class Abstract_Consent_Handler_Test extends TestCase {

	/**
	 * The instance to test.
	 *
	 * @var Consent_Handler
	 */
	protected $instance;

	/**
	 * The options helper instance.
	 *
	 * @var Mockery\MockInterface|User_Helper
	 */
	protected $user_helper;

	/**
	 * Setup the test.
	 *
	 * @return void
	 */
	protected function setUp(): void {
		parent::setUp();

		$this->user_helper = Mockery::mock( User_Helper::class );

		$this->instance = new Consent_Handler( $this->user_helper );
	}
}

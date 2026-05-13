<?php

// phpcs:disable Yoast.NamingConventions.NamespaceName.TooLong -- Needed in the folder structure.
// phpcs:disable Yoast.NamingConventions.NamespaceName.MaxExceeded
namespace Yoast\WP\SEO\Tests\Unit\AI\Generator\Application\Suggestions_Provider;

use Mockery;
use Yoast\WP\SEO\AI\Authentication\Application\Auth_Strategy_Factory;
use Yoast\WP\SEO\AI\Authentication\Application\Auth_Strategy_Interface;
use Yoast\WP\SEO\AI\Consent\Application\Consent_Handler;
use Yoast\WP\SEO\AI\Generator\Application\Suggestions_Provider;
use Yoast\WP\SEO\Tests\Unit\TestCase;

/**
 * Abstract class for Suggestions_Provider tests.
 *
 * @group ai-generator
 */
abstract class Abstract_Suggestions_Provider_Test extends TestCase {

	/**
	 * The instance to test.
	 *
	 * @var Suggestions_Provider
	 */
	protected $instance;

	/**
	 * The consent handler instance.
	 *
	 * @var Mockery\MockInterface|Consent_Handler
	 */
	protected $consent_handler;

	/**
	 * The auth strategy factory instance.
	 *
	 * @var Mockery\MockInterface|Auth_Strategy_Factory
	 */
	protected $auth_strategy_factory;

	/**
	 * The auth strategy returned by the factory.
	 *
	 * @var Mockery\MockInterface|Auth_Strategy_Interface
	 */
	protected $auth_strategy;

	/**
	 * Setup the test.
	 *
	 * @return void
	 */
	protected function setUp(): void {
		parent::setUp();

		$this->consent_handler       = Mockery::mock( Consent_Handler::class );
		$this->auth_strategy_factory = Mockery::mock( Auth_Strategy_Factory::class );
		$this->auth_strategy         = Mockery::mock( Auth_Strategy_Interface::class );
		$this->auth_strategy_factory->shouldReceive( 'create' )->andReturn( $this->auth_strategy )->byDefault();

		$this->instance = new Suggestions_Provider(
			$this->consent_handler,
			$this->auth_strategy_factory,
		);
	}
}

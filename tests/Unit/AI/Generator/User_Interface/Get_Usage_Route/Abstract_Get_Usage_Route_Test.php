<?php

// phpcs:disable Yoast.NamingConventions.NamespaceName.TooLong -- Needed in the folder structure.
// phpcs:disable Yoast.NamingConventions.NamespaceName.MaxExceeded
namespace Yoast\WP\SEO\Tests\Unit\AI\Generator\User_Interface\Get_Usage_Route;

use Mockery;
use WPSEO_Addon_Manager;
use Yoast\WP\SEO\AI\Authentication\Application\Auth_Strategy_Factory;
use Yoast\WP\SEO\AI\Authentication\Application\Auth_Strategy_Interface;
use Yoast\WP\SEO\AI\Generator\User_Interface\Get_Usage_Route;
use Yoast\WP\SEO\Tests\Unit\TestCase;

/**
 * Abstract class for Get_Usage_Route tests.
 *
 * @group ai-generator
 */
abstract class Abstract_Get_Usage_Route_Test extends TestCase {

	/**
	 * The instance to test.
	 *
	 * @var Get_Usage_Route
	 */
	protected $instance;

	/**
	 * The auth strategy factory mock.
	 *
	 * @var Mockery\MockInterface|Auth_Strategy_Factory
	 */
	protected $auth_strategy_factory;

	/**
	 * The auth strategy mock returned by the factory.
	 *
	 * @var Mockery\MockInterface|Auth_Strategy_Interface
	 */
	protected $auth_strategy;

	/**
	 * The add-on manager mock.
	 *
	 * @var Mockery\MockInterface|WPSEO_Addon_Manager
	 */
	protected $addon_manager;

	/**
	 * Setup the test.
	 *
	 * @return void
	 */
	protected function setUp(): void {
		parent::setUp();

		$this->auth_strategy_factory = Mockery::mock( Auth_Strategy_Factory::class );
		$this->auth_strategy         = Mockery::mock( Auth_Strategy_Interface::class );
		$this->addon_manager         = Mockery::mock( WPSEO_Addon_Manager::class );

		$this->auth_strategy_factory->shouldReceive( 'create' )->andReturn( $this->auth_strategy )->byDefault();

		$this->instance = new Get_Usage_Route(
			$this->auth_strategy_factory,
			$this->addon_manager,
		);
	}
}

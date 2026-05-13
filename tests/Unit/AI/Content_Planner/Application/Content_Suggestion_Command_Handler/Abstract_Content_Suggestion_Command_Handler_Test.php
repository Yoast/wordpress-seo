<?php

// phpcs:disable Yoast.NamingConventions.NamespaceName.TooLong -- Needed in the folder structure.
// phpcs:disable Yoast.NamingConventions.NamespaceName.MaxExceeded
namespace Yoast\WP\SEO\Tests\Unit\AI\Content_Planner\Application\Content_Suggestion_Command_Handler;

use Mockery;
use Yoast\WP\SEO\AI\Authentication\Application\Auth_Strategy_Factory;
use Yoast\WP\SEO\AI\Authentication\Application\Auth_Strategy_Interface;
use Yoast\WP\SEO\AI\Consent\Application\Consent_Handler;
use Yoast\WP\SEO\AI\Content_Planner\Application\Category_Repository_Interface;
use Yoast\WP\SEO\AI\Content_Planner\Application\Content_Suggestion_Command_Handler;
use Yoast\WP\SEO\AI\Content_Planner\Infrastructure\Recent_Content\Recent_Content_Collector;
use Yoast\WP\SEO\Tests\Unit\TestCase;

/**
 * Base class for Content_Suggestion_Command_Handler tests.
 *
 * @phpcs:disable Yoast.NamingConventions.ObjectNameDepth.MaxExceeded
 */
abstract class Abstract_Content_Suggestion_Command_Handler_Test extends TestCase {

	/**
	 * The recent content collector mock.
	 *
	 * @var Mockery\MockInterface|Recent_Content_Collector
	 */
	protected $recent_content_collector;

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
	 * The consent handler mock.
	 *
	 * @var Mockery\MockInterface|Consent_Handler
	 */
	protected $consent_handler;

	/**
	 * The category repository mock.
	 *
	 * @var Mockery\MockInterface|Category_Repository_Interface
	 */
	protected $category_repository;

	/**
	 * The instance under test.
	 *
	 * @var Content_Suggestion_Command_Handler
	 */
	protected $instance;

	/**
	 * Sets up the test fixtures.
	 *
	 * @return void
	 */
	protected function set_up() {
		parent::set_up();

		$this->recent_content_collector = Mockery::mock( Recent_Content_Collector::class );
		$this->auth_strategy_factory    = Mockery::mock( Auth_Strategy_Factory::class );
		$this->auth_strategy            = Mockery::mock( Auth_Strategy_Interface::class );
		$this->consent_handler          = Mockery::mock( Consent_Handler::class );
		$this->category_repository      = Mockery::mock( Category_Repository_Interface::class );

		$this->auth_strategy_factory->shouldReceive( 'create' )->andReturn( $this->auth_strategy )->byDefault();

		$this->instance = new Content_Suggestion_Command_Handler(
			$this->recent_content_collector,
			$this->auth_strategy_factory,
			$this->consent_handler,
			$this->category_repository,
		);
	}
}

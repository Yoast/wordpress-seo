<?php

// phpcs:disable Yoast.NamingConventions.NamespaceName.TooLong -- Needed in the folder structure.
// phpcs:disable Yoast.NamingConventions.NamespaceName.MaxExceeded
namespace Yoast\WP\SEO\Tests\Unit\AI\Content_Planner\Application\Content_Outline_Command_Handler;

use Mockery;
use Yoast\WP\SEO\AI\Authorization\Application\Token_Manager;
use Yoast\WP\SEO\AI\Consent\Application\Consent_Handler;
use Yoast\WP\SEO\AI\Content_Planner\Application\Content_Outline_Command_Handler;
use Yoast\WP\SEO\AI\Content_Planner\Infrastructure\Recent_Content\Recent_Content_Collector;
use Yoast\WP\SEO\AI\HTTP_Request\Application\Request_Handler;
use Yoast\WP\SEO\Tests\Unit\TestCase;

/**
 * Base class for Content_Outline_Command_Handler tests.
 *
 * @phpcs:disable Yoast.NamingConventions.ObjectNameDepth.MaxExceeded
 */
abstract class Abstract_Content_Outline_Command_Handler_Test extends TestCase {

	/**
	 * The recent content collector mock.
	 *
	 * @var Mockery\MockInterface|Recent_Content_Collector
	 */
	protected $recent_content_collector;

	/**
	 * The token manager mock.
	 *
	 * @var Mockery\MockInterface|Token_Manager
	 */
	protected $token_manager;

	/**
	 * The request handler mock.
	 *
	 * @var Mockery\MockInterface|Request_Handler
	 */
	protected $request_handler;

	/**
	 * The consent handler mock.
	 *
	 * @var Mockery\MockInterface|Consent_Handler
	 */
	protected $consent_handler;

	/**
	 * The instance under test.
	 *
	 * @var Content_Outline_Command_Handler
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
		$this->token_manager            = Mockery::mock( Token_Manager::class );
		$this->request_handler          = Mockery::mock( Request_Handler::class );
		$this->consent_handler          = Mockery::mock( Consent_Handler::class );

		$this->instance = new Content_Outline_Command_Handler(
			$this->recent_content_collector,
			$this->token_manager,
			$this->request_handler,
			$this->consent_handler,
		);
	}
}

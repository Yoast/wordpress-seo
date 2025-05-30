<?php
// phpcs:disable Yoast.NamingConventions.NamespaceName.MaxExceeded
namespace Yoast\WP\SEO\Tests\Unit\AI_HTTP_Request\Application\Request_Handler;

use Mockery;

use Yoast\WP\SEO\AI_HTTP_Request\Application\Request_Handler;
use Yoast\WP\SEO\AI_HTTP_Request\Application\Response_Parser;
use Yoast\WP\SEO\AI_HTTP_Request\Infrastructure\API_Client;
use Yoast\WP\SEO\Tests\Unit\TestCase;

/**
 * Abstract class for Request_Handler tests.
 *
 * @group ai-http-request
 */
class Abstract_Request_Handler_Test extends TestCase {

	/**
	 * The API_Client instance.
	 *
	 * @var Mockery\MockInterface|API_Client
	 */
	protected $api_client;

	/**
	 * The Response_Parser instance.
	 *
	 * @var Mockery\MockInterface|Response_Parser
	 */
	protected $response_parser;

	/**
	 * The instance to test.
	 *
	 * @var Request_Handler
	 */
	protected $instance;

	/**
	 * Setup the test.
	 *
	 * @return void
	 */
	protected function setUp(): void {
		parent::setUp();

		$this->api_client = Mockery::mock( API_Client::class );
		$this->response_parser = Mockery::mock( Response_Parser::class );

		$this->instance = new Request_Handler(
			$this->api_client,
			$this->response_parser
		);
	}
}

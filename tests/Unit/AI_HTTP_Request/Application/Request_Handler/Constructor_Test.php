<?php
// phpcs:disable Yoast.NamingConventions.NamespaceName.TooLong -- Needed in the folder structure.
// phpcs:disable Yoast.NamingConventions.NamespaceName.MaxExceeded
namespace Yoast\WP\SEO\Tests\Unit\AI_HTTP_Request\Application\Request_Handler;

use Yoast\WP\SEO\AI_HTTP_Request\Application\Response_Parser;
use Yoast\WP\SEO\AI_HTTP_Request\Infrastructure\API_Client;

/**
 * Tests the Request_Handler constructor.
 *
 * @group ai-http-request
 *
 * @covers Yoast\WP\SEO\AI_HTTP_Request\Application\Request_Handler::__construct
 */
final class Constructor_Test extends Abstract_Request_Handler_Test {

	/**
	 * Tests the constructor.
	 *
	 * @return void
	 */
	public function test_constructor() {
		$this->assertInstanceOf(
			API_Client::class,
			$this->getPropertyValue( $this->instance, 'api_client' )
		);

		$this->assertInstanceOf(
			Response_Parser::class,
			$this->getPropertyValue( $this->instance, 'response_parser' )
		);
	}
}

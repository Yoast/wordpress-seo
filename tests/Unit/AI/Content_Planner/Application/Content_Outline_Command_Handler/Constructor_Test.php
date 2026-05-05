<?php

// phpcs:disable Yoast.NamingConventions.NamespaceName.TooLong -- Needed in the folder structure.
// phpcs:disable Yoast.NamingConventions.NamespaceName.MaxExceeded
namespace Yoast\WP\SEO\Tests\Unit\AI\Content_Planner\Application\Content_Outline_Command_Handler;

use Yoast\WP\SEO\AI\Authorization\Application\Token_Manager;
use Yoast\WP\SEO\AI\Consent\Application\Consent_Handler;
use Yoast\WP\SEO\AI\Content_Planner\Infrastructure\Recent_Content\Recent_Content_Collector;
use Yoast\WP\SEO\AI\HTTP_Request\Application\Request_Handler;

/**
 * Tests the Content_Outline_Command_Handler constructor.
 *
 * @group ai-content-planner
 *
 * @covers \Yoast\WP\SEO\AI\Content_Planner\Application\Content_Outline_Command_Handler::__construct
 *
 * @phpcs:disable Yoast.NamingConventions.ObjectNameDepth.MaxExceeded
 */
final class Constructor_Test extends Abstract_Content_Outline_Command_Handler_Test {

	/**
	 * Tests if the constructor sets properties correctly.
	 *
	 * @return void
	 */
	public function test_constructor() {
		$this->assertInstanceOf(
			Recent_Content_Collector::class,
			$this->getPropertyValue( $this->instance, 'recent_content_collector' ),
		);
		$this->assertInstanceOf(
			Token_Manager::class,
			$this->getPropertyValue( $this->instance, 'token_manager' ),
		);
		$this->assertInstanceOf(
			Request_Handler::class,
			$this->getPropertyValue( $this->instance, 'request_handler' ),
		);
		$this->assertInstanceOf(
			Consent_Handler::class,
			$this->getPropertyValue( $this->instance, 'consent_handler' ),
		);
	}
}

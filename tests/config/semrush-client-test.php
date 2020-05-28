<?php

namespace Yoast\WP\SEO\Tests\Config;

use League\OAuth2\Client\Provider\GenericProvider;
use Mockery;
use Yoast\WP\SEO\Config\SEMrush_Client;
use Yoast\WP\SEO\Tests\TestCase;

/**
 * Class SEMrush_Client_Test.
 *
 * @group semrush
 *
 * @coversDefaultClass \Yoast\WP\SEO\Config\SEMrush_Client
 */
class SEMrush_Client_Test extends TestCase {

	/**
	 * The breadcrumbs enabled conditional.
	 *
	 * @var SEMrush_Client
	 */
	private $instance;


	/**
	 * Does the setup for testing.
	 */
	public function setUp() {
		parent::setUp();

		$this->instance = new SEMrush_Client();
	}

	/**
	 * Tests if the needed attributes are set correctly.
	 *
	 * @covers ::__construct
	 */
	public function test_construct() {
		$this->assertAttributeInstanceOf( GenericProvider::class, 'provider', $this->instance );
	}

	public function test_get_access_token() {

	}
}

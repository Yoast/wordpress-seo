<?php

namespace Yoast\WP\SEO\Tests\Unit\Conditionals;

use Mockery;
use Yoast\WP\SEO\Conditionals\Wincher_Token_Conditional;
use Yoast\WP\SEO\Config\Wincher_Client;
use Yoast\WP\SEO\Tests\Unit\TestCase;

/**
 * Class Wincher_Token_Conditional_Test.
 *
 * @group conditionals
 *
 * @coversDefaultClass \Yoast\WP\SEO\Conditionals\Wincher_Token_Conditional
 */
class Wincher_Token_Conditional_Test extends TestCase {

	/**
	 * The Wincher token conditional.
	 *
	 * @var Wincher_Token_Conditional
	 */
	private $instance;

	/**
	 * The Wincher_Client instance.
	 *
	 * @var Mockery\LegacyMockInterface|Mockery\MockInterface|Wincher_Client
	 */
	private $wincher_client;

	/**
	 * Does the setup for testing.
	 */
	protected function set_up() {
		parent::set_up();

		$this->wincher_client = Mockery::mock( Wincher_Client::class );
		$this->instance       = new Wincher_Token_Conditional( $this->wincher_client );
	}

	/**
	 * Tests if the class attributes are set propertly.
	 *
	 * @covers ::__construct
	 */
	public function test_construct() {
		$this->assertInstanceOf(
			Wincher_Client::class,
			$this->getPropertyValue( $this->instance, 'client' )
		);
	}

	/**
	 * Tests that the conditional is not met when there is no token.
	 *
	 * @covers ::is_met
	 */
	public function test_is_not_met() {
		$this->wincher_client
			->expects( 'has_valid_tokens' )
			->once()
			->andReturnFalse();

		$this->assertEquals( false, $this->instance->is_met() );
	}

	/**
	 * Tests that the conditional is met when there is a token.
	 *
	 * @covers ::is_met
	 */
	public function test_is_met() {
		$this->wincher_client
			->expects( 'has_valid_tokens' )
			->once()
			->andReturnTrue();

		$this->assertEquals( true, $this->instance->is_met() );
	}
}

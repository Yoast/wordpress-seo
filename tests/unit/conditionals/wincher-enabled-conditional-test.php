<?php

namespace Yoast\WP\SEO\Tests\Unit\Conditionals;

use Mockery;
use Yoast\WP\SEO\Conditionals\Wincher_Enabled_Conditional;
use Yoast\WP\SEO\Helpers\Options_Helper;
use Yoast\WP\SEO\Tests\Unit\TestCase;

/**
 * Class Wincher_Enabled_Conditional_Test.
 *
 * @group conditionals
 *
 * @coversDefaultClass \Yoast\WP\SEO\Conditionals\Wincher_Enabled_Conditional
 */
class Wincher_Enabled_Conditional_Test extends TestCase {

	/**
	 * The Wincher enabled conditional.
	 *
	 * @var Wincher_Enabled_Conditional
	 */
	private $instance;

	/**
	 * The Options_Helper instance.
	 *
	 * @var Mockery\LegacyMockInterface|Mockery\MockInterface|Options_Helper
	 */
	private $options_helper;

	/**
	 * Does the setup for testing.
	 */
	protected function set_up() {
		parent::set_up();

		$this->options_helper = Mockery::mock( Options_Helper::class );
		$this->instance       = new Wincher_Enabled_Conditional( $this->options_helper );
	}

	/**
	 * Tests if the class attributes are set propertly.
	 *
	 * @covers ::__construct
	 */
	public function test_construct() {
		$this->assertInstanceOf(
			Options_Helper::class,
			$this->getPropertyValue( $this->instance, 'options' )
		);
	}

	/**
	 * Tests that the conditional is not met when the integration is disabled.
	 *
	 * @covers ::is_met
	 */
	public function test_is_not_met() {
		$this->options_helper
			->expects( 'get' )
			->once()
			->with( 'wincher_integration_active', false )
			->andReturnFalse();

		$this->assertEquals( false, $this->instance->is_met() );
	}

	/**
	 * Tests that the conditional is met when the integration is enabled.
	 *
	 * @covers ::is_met
	 */
	public function test_is_met() {
		$this->options_helper
			->expects( 'get' )
			->once()
			->with( 'wincher_integration_active', false )
			->andReturnTrue();

		$this->assertEquals( true, $this->instance->is_met() );
	}
}

<?php

namespace Yoast\WP\SEO\Tests\Unit\Conditionals;

use Mockery;
use Yoast\WP\SEO\Conditionals\Options_Conditional;
use Yoast\WP\SEO\Helpers\Options_Helper;
use Yoast\WP\SEO\Tests\Unit\TestCase;

/**
 * Class Options_Conditional_Test.
 *
 * @group conditionals
 *
 * @coversDefaultClass \Yoast\WP\SEO\Conditionals\Options_Conditional
 */
class Options_Conditional_Test extends TestCase {

	/**
	 * The options helper.
	 *
	 * @var Mockery\MockInterface|Options_Helper
	 */
	protected $options_helper;

	/**
	 * Does the setup for testing.
	 */
	public function set_up() {
		parent::set_up();

		$this->options_helper = Mockery::mock( Options_Helper::class );
		$this->instance       = new Options_Conditional( $this->options_helper );
	}

	/**
	 * Tests that the conditional is met when it should be.
	 *
	 * @covers ::is_met
	 *
	 * @dataProvider option_value_provider
	 *
	 * @param mixed $option_value The option value to test.
	 * @param bool  $expected     The expected output of is_met.
	 */
	public function test_is_met( $option_value, $expected ) {
		$this->options_helper->expects( 'get' )->with( 'option_name' )->andReturnTrue();

		$this->assertEquals( true, $this->instance->is_met( 'option_name' ) );
	}

	/**
	 * Dataprovider for test_is_met_for_disabled_option function.
	 *
	 * @return array Data for test_is_met_for_disabled_option function.
	 */
	public function option_value_provider() {
		return [
			[
				'option_value' => true,
				'expected'     => true,
			],
			[
				'option_value' => false,
				'expected'     => false,
			],
			[
				'option_value' => null,
				'expected'     => false,
			],
			[
				'option_value' => 'some_string',
				'expected'     => false,
			],
			[
				'option_value' => 5,
				'expected'     => false,
			],
		];
	}
}

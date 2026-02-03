<?php

// phpcs:disable Yoast.NamingConventions.NamespaceName.TooLong -- Needed in the folder structure.
namespace Yoast\WP\SEO\Tests\Unit\Initializers\Silence_Load_Textdomain_Just_In_Time_Notices;

use Generator;

/**
 * Test class for the notices silencer.
 *
 * @group Silence_Load_Textdomain_Just_In_Time_Notices
 *
 * @covers Yoast\WP\SEO\Initializers\Silence_Load_Textdomain_Just_In_Time_Notices::silence_textdomain_notices
 *
 * @phpcs:disable Yoast.NamingConventions.ObjectNameDepth.MaxExceeded
 */
final class Silence_Load_Textdomain_Just_In_Time_Notices_Silencer_Test extends Abstract_Silence_Load_Textdomain_Just_In_Time_Notices_Test {

	/**
	 * Tests silence_textdomain_notices().
	 *
	 * @dataProvider get_silence_textdomain_notices_data
	 *
	 * @param bool   $trigger       Whether to trigger the error.
	 * @param string $function_name The name of the function.
	 * @param bool   $expected      The expected result.
	 *
	 * @return void
	 */
	public function test_silence_textdomain_notices(
		$trigger,
		$function_name,
		$expected
	) {
		$this->assertEquals( $expected, $this->instance->silence_textdomain_notices( $trigger, $function_name ) );
	}

	/**
	 * Data provider for test_silence_textdomain_notices.
	 *
	 * @return Generator Test data to use.
	 */
	public static function get_silence_textdomain_notices_data() {
		yield 'Triggered _load_textdomain_just_in_time function' => [
			'trigger'       => true,
			'function_name' => '_load_textdomain_just_in_time',
			'expected'      => false,
		];
		yield 'No generation failure' => [
			'trigger'       => true,
			'function_name' => 'random_function',
			'expected'      => true,
		];
		yield 'Not triggered _load_textdomain_just_in_time function' => [
			'trigger'       => false,
			'function_name' => '_load_textdomain_just_in_time',
			'expected'      => false,
		];
		yield 'Not triggered random function' => [
			'trigger'       => false,
			'function_name' => 'random_function',
			'expected'      => false,
		];
	}
}

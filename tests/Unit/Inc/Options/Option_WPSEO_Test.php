<?php

namespace Yoast\WP\SEO\Tests\Unit\Inc\Options;

use Yoast\WP\SEO\Tests\Unit\Doubles\Inc\Options\Option_WPSEO_Double;
use Yoast\WP\SEO\Tests\Unit\TestCase;

/**
 * Unit Test Class.
 *
 * @group option-wpseo
 */
final class Option_WPSEO_Test extends TestCase {

	/**
	 * Tests that the integer options are stored as integers, also when posted as text.
	 *
	 * @dataProvider provider_validate_integers
	 * @covers       WPSEO_Option_Wpseo::validate_option
	 *
	 * @param string          $key      The option key.
	 * @param string|int|bool $dirty    The posted value.
	 * @param int|false       $expected The expected validated value.
	 *
	 * @return void
	 */
	public function test_validate_option_integers( $key, $dirty, $expected ) {
		$instance = new Option_WPSEO_Double();

		$clean = $instance->validate_option( [ $key => $dirty ], [ $key => false ], [ $key => false ] );

		$this->assertSame( $expected, $clean[ $key ] );
	}

	/**
	 * Data provider for test_validate_option_integers.
	 *
	 * @return array<string, array<string, string|int|bool>>
	 */
	public static function provider_validate_integers() {
		return [
			'first_activated_by posted as text'                 => [
				'key'      => 'first_activated_by',
				'dirty'    => '1',
				'expected' => 1,
			],
			'first_activated_by posted as zero text'            => [
				'key'      => 'first_activated_by',
				'dirty'    => '0',
				'expected' => 0,
			],
			'first_activated_by posted as an integer'           => [
				'key'      => 'first_activated_by',
				'dirty'    => 2,
				'expected' => 2,
			],
			'first_activated_by posted as false'                => [
				'key'      => 'first_activated_by',
				'dirty'    => false,
				'expected' => false,
			],
			'first_activated_by posted as other text'           => [
				'key'      => 'first_activated_by',
				'dirty'    => 'abc',
				'expected' => false,
			],
			'first_activated_on posted as text'                 => [
				'key'      => 'first_activated_on',
				'dirty'    => '1792506295',
				'expected' => 1_792_506_295,
			],
			'first_activated_on posted as zero text'            => [
				'key'      => 'first_activated_on',
				'dirty'    => '0',
				'expected' => false,
			],
			'activation_redirect_timestamp_free posted as text' => [
				'key'      => 'activation_redirect_timestamp_free',
				'dirty'    => '1792506296',
				'expected' => 1_792_506_296,
			],
		];
	}
}

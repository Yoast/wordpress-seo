<?php

namespace Yoast\WP\SEO\Tests;

use Brain\Monkey;
use Yoast\WP\SEO\Tests\TestCase;

/**
 * Unit Test Class.
 *
 * @coversDefaultClass \WPSEO_Alert
 */
class WPSEO_Alert_Test extends TestCase {

	/**
	 * Test when the Alert is of type 'error'.
	 *
	 * @covers ::render()
	 * @covers ::__toString()
	 */
	function test_error_alert() {
		Monkey\Functions\expect( 'wp_enqueue_style' )->once();

		$test = new \WPSEO_Alert(\WPSEO_Alert::ERROR, 'content' );

		$expected = '<div class="wpseo-alert wpseo-alert__error">'
			. '<span><img class="icon" src="images/alert-error-icon.svg""></span>'
			. '<span>content</span>'
			. '</div>';

		Monkey\Functions\expect( 'esc_url' )->andReturn( '' );
		Monkey\Functions\expect( 'plugin_dir_url' )->andReturn( '' );

		$this->assertEquals( $expected, (string) $test );
	}

	/**
	 * Test when the Alert is of type 'info'.
	 *
	 * @covers ::render()
	 * @covers ::__toString()
	 */
	function test_info_alert() {
		Monkey\Functions\expect( 'wp_enqueue_style' );
		$test = new \WPSEO_Alert(\WPSEO_Alert::INFO, 'content' );

		$expected = '<div class="wpseo-alert wpseo-alert__info">'
			. '<span><img class="icon" src="images/alert-info-icon.svg""></span>'
			. '<span>content</span>'
			. '</div>';

		Monkey\Functions\expect( 'esc_url' )->andReturn( '' );
		Monkey\Functions\expect( 'plugin_dir_url' )->andReturn( '' );

		$this->assertEquals( $expected, (string) $test );
	}

	/**
	 * Test when the Alert is of type 'success'.
	 *
	 * @covers ::render()
	 * @covers ::__toString()
	 */
	function test_success_alert() {
		Monkey\Functions\expect( 'wp_enqueue_style' );
		$test = new \WPSEO_Alert(\WPSEO_Alert::SUCCESS, 'content' );

		$expected = '<div class="wpseo-alert wpseo-alert__success">'
			. '<span><img class="icon" src="images/alert-success-icon.svg""></span>'
			. '<span>content</span>'
			. '</div>';

		Monkey\Functions\expect( 'esc_url' )->andReturn( '' );
		Monkey\Functions\expect( 'plugin_dir_url' )->andReturn( '' );

		$this->assertEquals( $expected, (string) $test );
	}

	/**
	 * Test when the Alert is of type 'warning'.
	 *
	 * @covers ::render()
	 * @covers ::__toString()
	 */
	function test_warning_alert() {
		Monkey\Functions\expect( 'wp_enqueue_style' );
		$test = new \WPSEO_Alert(\WPSEO_Alert::WARNING, 'content' );

		$expected = '<div class="wpseo-alert wpseo-alert__warning">'
			. '<span><img class="icon" src="images/alert-warning-icon.svg""></span>'
			. '<span>content</span>'
			. '</div>';

		Monkey\Functions\expect( 'esc_url' )->andReturn( '' );
		Monkey\Functions\expect( 'plugin_dir_url' )->andReturn( '' );

		$this->assertEquals( $expected, (string) $test );
	}


}


<?php

namespace Yoast\WP\SEO\Tests;

use Brain\Monkey;
use Yoast\WP\SEO\Tests\TestCase;

/**
 * Unit Test Class.
 *
 * @coversDefaultClass \Alert_Presenter
 */
class Alert_Presenter_Test extends TestCase {

	/**
	 * Test when the Alert is of type 'error'.
	 *
	 * @covers ::present()
	 */
	function test_error_alert() {
		Monkey\Functions\expect( 'wp_enqueue_style' )->once();

		$test = new \Alert_Presenter(\Alert_Presenter::ERROR, 'content' );

		$expected = '<div class="yoast-alert yoast-alert--error">'
			. '<span><img class="icon" src="images/alert-error-icon.svg" alt=""/></span>'
			. '<span>content</span>'
			. '</div>';

		Monkey\Functions\expect( 'esc_url' )->andReturn( '' );
		Monkey\Functions\expect( 'plugin_dir_url' )->andReturn( '' );

		$this->assertEquals( $expected, (string) $test );
	}

	/**
	 * Test when the Alert is of type 'info'.
	 *
	 * @covers ::present()
	 */
	function test_info_alert() {
		Monkey\Functions\expect( 'wp_enqueue_style' );
		$test = new \Alert_Presenter(\Alert_Presenter::INFO, 'content' );

		$expected = '<div class="yoast-alert yoast-alert--info">'
			. '<span><img class="icon" src="images/alert-info-icon.svg" alt=""/></span>'
			. '<span>content</span>'
			. '</div>';

		Monkey\Functions\expect( 'esc_url' )->andReturn( '' );
		Monkey\Functions\expect( 'plugin_dir_url' )->andReturn( '' );

		$this->assertEquals( $expected, (string) $test );
	}

	/**
	 * Test when the Alert is of type 'success'.
	 *
	 * @covers ::present()
	 */
	function test_success_alert() {
		Monkey\Functions\expect( 'wp_enqueue_style' );
		$test = new \Alert_Presenter(\Alert_Presenter::SUCCESS, 'content' );

		$expected = '<div class="yoast-alert yoast-alert--success">'
			. '<span><img class="icon" src="images/alert-success-icon.svg" alt=""/></span>'
			. '<span>content</span>'
			. '</div>';

		Monkey\Functions\expect( 'esc_url' )->andReturn( '' );
		Monkey\Functions\expect( 'plugin_dir_url' )->andReturn( '' );

		$this->assertEquals( $expected, (string) $test );
	}

	/**
	 * Test when the Alert is of type 'warning'.
	 *
	 * @covers ::present()
	 */
	function test_warning_alert() {
		Monkey\Functions\expect( 'wp_enqueue_style' );
		$test = new \Alert_Presenter(\Alert_Presenter::WARNING, 'content' );

		$expected = '<div class="yoast-alert yoast-alert--warning">'
			. '<span><img class="icon" src="images/alert-warning-icon.svg" alt=""/></span>'
			. '<span>content</span>'
			. '</div>';

		Monkey\Functions\expect( 'esc_url' )->andReturn( '' );
		Monkey\Functions\expect( 'plugin_dir_url' )->andReturn( '' );

		$this->assertEquals( $expected, (string) $test );
	}


}


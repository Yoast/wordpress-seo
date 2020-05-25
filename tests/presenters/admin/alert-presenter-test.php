<?php
/**
 * WPSEO plugin test file.
 */

namespace Yoast\WP\SEO\Tests\Presenters\Admin;

use Brain\Monkey;
use WPSEO_Admin_Asset_Manager;
use Yoast\WP\SEO\Presenters\Admin\Alert_Presenter;
use Yoast\WP\SEO\Tests\TestCase;

/**
 * Class Alert_Presenter_Test
 *
 * @coversDefaultClass \Yoast\WP\SEO\Presenters\Admin\Alert_Presenter
 *
 * @group presenters
 */
class Alert_Presenter_Test extends TestCase {

	/**
	 * Test constructor
	 *
	 * @covers ::__construct
	 */
	public function test_construct() {
		Monkey\Functions\expect( 'wp_enqueue_style' )->once();

		$test = new Alert_Presenter( 'content', 'error' );

		$this->assertAttributeSame( 'content', 'content', $test );
		$this->assertAttributeSame( 'error', 'type', $test );

		$this->assertAttributeInstanceOf( WPSEO_Admin_Asset_Manager::class, 'asset_manager', $test );
	}

	/**
	 * Test when the Alert is of type 'error'.
	 *
	 * @covers ::present
	 */
	public function test_error_alert() {
		Monkey\Functions\expect( 'wp_enqueue_style' )->once();

		$test = new Alert_Presenter( 'content', 'error' );

		$expected = '<div class="yoast-alert yoast-alert--error">'
			. '<span><img class="yoast-alert__icon" src="images/alert-error-icon.svg" alt="" /></span>'
			. '<span>content</span>'
			. '</div>';

		Monkey\Functions\expect( 'esc_url' )->andReturn( '' );
		Monkey\Functions\expect( 'plugin_dir_url' )->andReturn( '' );

		$this->assertEquals( $expected, (string) $test );
	}

	/**
	 * Test when the Alert is of type 'info'.
	 *
	 * @covers ::present
	 */
	public function test_info_alert() {
		Monkey\Functions\expect( 'wp_enqueue_style' );
		$test = new Alert_Presenter( 'content', 'info' );

		$expected = '<div class="yoast-alert yoast-alert--info">'
			. '<span><img class="yoast-alert__icon" src="images/alert-info-icon.svg" alt="" /></span>'
			. '<span>content</span>'
			. '</div>';

		Monkey\Functions\expect( 'esc_url' )->andReturn( '' );
		Monkey\Functions\expect( 'plugin_dir_url' )->andReturn( '' );

		$this->assertEquals( $expected, (string) $test );
	}

	/**
	 * Test when the Alert is of type 'success'.
	 *
	 * @covers ::present
	 */
	public function test_success_alert() {
		Monkey\Functions\expect( 'wp_enqueue_style' );
		$test = new Alert_Presenter( 'content', 'success' );

		$expected = '<div class="yoast-alert yoast-alert--success">'
			. '<span><img class="yoast-alert__icon" src="images/alert-success-icon.svg" alt="" /></span>'
			. '<span>content</span>'
			. '</div>';

		Monkey\Functions\expect( 'esc_url' )->andReturn( '' );
		Monkey\Functions\expect( 'plugin_dir_url' )->andReturn( '' );

		$this->assertEquals( $expected, (string) $test );
	}

	/**
	 * Test when the Alert is of type 'warning'.
	 *
	 * @covers ::present
	 */
	public function test_warning_alert() {
		Monkey\Functions\expect( 'wp_enqueue_style' );
		$test = new Alert_Presenter( 'content', 'warning' );

		$expected = '<div class="yoast-alert yoast-alert--warning">'
			. '<span><img class="yoast-alert__icon" src="images/alert-warning-icon.svg" alt="" /></span>'
			. '<span>content</span>'
			. '</div>';

		Monkey\Functions\expect( 'esc_url' )->andReturn( '' );
		Monkey\Functions\expect( 'plugin_dir_url' )->andReturn( '' );

		$this->assertEquals( $expected, (string) $test );
	}

	/**
	 * Test when the Alert has default type ('warning').
	 *
	 * @covers ::present
	 */
	public function test_default_alert() {
		Monkey\Functions\expect( 'wp_enqueue_style' );
		$test = new Alert_Presenter( 'content' );

		$expected = '<div class="yoast-alert yoast-alert--warning">'
			. '<span><img class="yoast-alert__icon" src="images/alert-warning-icon.svg" alt="" /></span>'
			. '<span>content</span>'
			. '</div>';

		Monkey\Functions\expect( 'esc_url' )->andReturn( '' );
		Monkey\Functions\expect( 'plugin_dir_url' )->andReturn( '' );

		$this->assertEquals( $expected, (string) $test );
	}
}

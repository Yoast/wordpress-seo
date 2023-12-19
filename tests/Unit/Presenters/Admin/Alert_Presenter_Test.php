<?php

namespace Yoast\WP\SEO\Tests\Unit\Presenters\Admin;

use Brain\Monkey;
use WPSEO_Admin_Asset_Manager;
use Yoast\WP\SEO\Presenters\Admin\Alert_Presenter;
use Yoast\WP\SEO\Tests\Unit\TestCase;

/**
 * Class Alert_Presenter_Test.
 *
 * @coversDefaultClass \Yoast\WP\SEO\Presenters\Admin\Alert_Presenter
 *
 * @group presenters
 */
final class Alert_Presenter_Test extends TestCase {

	/**
	 * Set up function stubs.
	 *
	 * @return void
	 */
	protected function set_up() {
		parent::set_up();

		$this->stubEscapeFunctions();
	}

	/**
	 * Test constructor
	 *
	 * @covers ::__construct
	 *
	 * @return void
	 */
	public function test_construct() {
		Monkey\Functions\expect( 'wp_enqueue_style' )->once();

		$test = new Alert_Presenter( 'content', 'error' );

		$this->assertSame( 'content', $this->getPropertyValue( $test, 'content' ) );
		$this->assertSame( 'error', $this->getPropertyValue( $test, 'type' ) );

		$this->assertInstanceOf(
			WPSEO_Admin_Asset_Manager::class,
			$this->getPropertyValue( $test, 'asset_manager' )
		);
	}

	/**
	 * Test when the Alert is of type 'error'.
	 *
	 * @covers ::present
	 *
	 * @return void
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
	 *
	 * @return void
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
	 *
	 * @return void
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
	 *
	 * @return void
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
	 *
	 * @return void
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

<?php

namespace Yoast\WP\SEO\Tests\Unit\Presenters\Admin;

use Brain\Monkey;
use WPSEO_Admin_Asset_Manager;
use Yoast\WP\SEO\Presenters\Admin\Badge_Presenter;
use Yoast\WP\SEO\Tests\Unit\TestCase;

/**
 * Class Badge_Presenter_Test.
 *
 * @coversDefaultClass \Yoast\WP\SEO\Presenters\Admin\Badge_Presenter
 *
 * @group presenters
 */
class Badge_Presenter_Test extends TestCase {

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
	 */
	public function test_construct() {
		Monkey\Functions\expect( 'wp_enqueue_style' )->once();

		$test = new Badge_Presenter( 'test-id', 'http://example.com/' );

		$this->assertSame( 'test-id', $this->getPropertyValue( $test, 'id' ) );
		$this->assertSame( 'http://example.com/', $this->getPropertyValue( $test, 'link' ) );

		$this->assertInstanceOf(
			WPSEO_Admin_Asset_Manager::class,
			$this->getPropertyValue( $test, 'asset_manager' )
		);
	}

	/**
	 * Tests when the badge is initialized with a link.
	 *
	 * @covers ::present
	 */
	public function test_badge_with_link() {
		Monkey\Functions\expect( 'wp_enqueue_style' )->once();
		$test = new Badge_Presenter( 'test1', 'http://example.com/' );

		$expected = '&nbsp;&nbsp;<span class="yoast-badge yoast-badge__has-link yoast-new-badge" id="test1-new-badge"><a href="http://example.com/">NEW</a></span>';
		Monkey\Functions\expect( 'esc_url' )->andReturn( '' );

		$this->assertEquals( $expected, (string) $test );
	}

	/**
	 * Tests when the badge is initialized without a link.
	 *
	 * @covers ::present
	 */
	public function test_badge_without_link() {
		Monkey\Functions\expect( 'wp_enqueue_style' )->once();
		$test = new Badge_Presenter( 'test2' );

		$expected = '&nbsp;&nbsp;<span class="yoast-badge yoast-new-badge" id="test2-new-badge">NEW</span>';
		Monkey\Functions\expect( 'esc_url' )->andReturn( '' );

		$this->assertEquals( $expected, (string) $test );
	}
}

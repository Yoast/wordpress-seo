<?php

namespace Yoast\WP\SEO\Tests\Unit\Presenters\Admin;

use Brain\Monkey;
use WPSEO_Admin_Asset_Manager;
use Yoast\WP\SEO\Presenters\Admin\Help_Link_Presenter;
use Yoast\WP\SEO\Tests\Unit\TestCase;

/**
 * Class Help_Link_Presenter_Test.
 *
 * @coversDefaultClass \Yoast\WP\SEO\Presenters\Admin\Help_Link_Presenter
 *
 * @group presenters
 */
final class Help_Link_Presenter_Test extends TestCase {

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

		$test = new Help_Link_Presenter( 'http://example.com/', 'Link text' );

		$this->assertSame( 'http://example.com/', $this->getPropertyValue( $test, 'link' ) );
		$this->assertSame( 'Link text', $this->getPropertyValue( $test, 'link_text' ) );
		$this->assertSame( true, $this->getPropertyValue( $test, 'opens_in_new_browser_tab' ) );

		$this->assertInstanceOf(
			WPSEO_Admin_Asset_Manager::class,
			$this->getPropertyValue( $test, 'asset_manager' )
		);
	}

	/**
	 * Tests when the Help link opens in a new browser tab.
	 *
	 * @covers ::present
	 *
	 * @return void
	 */
	public function test_help_link_opens_in_new_browser_tab() {
		Monkey\Functions\expect( 'wp_enqueue_style' )->once();
		$test = new Help_Link_Presenter( 'http://example.com/', 'Link text' );

		$expected = '<a href="http://example.com/" target="_blank" class="yoast_help yoast-help-link dashicons"><span class="yoast-help-icon" aria-hidden="true"></span><span class="screen-reader-text">Link text (Opens in a new browser tab)</span></a>';
		Monkey\Functions\expect( 'esc_url' )->andReturn( '' );
		Monkey\Functions\expect( '__' )->once()->andReturn( '(Opens in a new browser tab)' );

		$this->assertEquals( $expected, (string) $test );
	}

	/**
	 * Tests when the Help link does not open in a new browser tab.
	 *
	 * @covers ::present
	 *
	 * @return void
	 */
	public function test_help_link_does_not_open_in_new_browser_tab() {
		Monkey\Functions\expect( 'wp_enqueue_style' )->once();
		$test = new Help_Link_Presenter( 'http://example.com/', 'Link text', false );

		$expected = '<a href="http://example.com/" class="yoast_help yoast-help-link dashicons"><span class="yoast-help-icon" aria-hidden="true"></span><span class="screen-reader-text">Link text</span></a>';
		Monkey\Functions\expect( 'esc_url' )->andReturn( '' );

		$this->assertEquals( $expected, (string) $test );
	}
}

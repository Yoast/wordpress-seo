<?php

namespace Yoast\WP\SEO\Tests\Unit\Presenters\Admin;

use Brain\Monkey;
use WPSEO_Admin_Asset_Manager;
use Yoast\WP\SEO\Presenters\Admin\Notice_Presenter;
use Yoast\WP\SEO\Tests\Unit\TestCase;

/**
 * Class Notice_Presenter_Test.
 *
 * @coversDefaultClass \Yoast\WP\SEO\Presenters\Admin\Notice_Presenter
 *
 * @group presenters
 */
class Notice_Presenter_Test extends TestCase {

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
	 * Test constructor.
	 *
	 * @covers ::__construct
	 */
	public function test_construct() {
		Monkey\Functions\expect( 'wp_enqueue_style' )->once();

		$test = new Notice_Presenter( 'title', 'content', 'image.png', null, true );

		$this->assertSame( 'title', $this->getPropertyValue( $test, 'title' ) );
		$this->assertSame( 'content', $this->getPropertyValue( $test, 'content' ) );
		$this->assertSame( 'image.png', $this->getPropertyValue( $test, 'image_filename' ) );
		$this->assertSame( true, $this->getPropertyValue( $test, 'is_dismissible' ) );

		$this->assertInstanceOf(
			WPSEO_Admin_Asset_Manager::class,
			$this->getPropertyValue( $test, 'asset_manager' )
		);
	}

	/**
	 * Test the default Notice, without image and not dismissible.
	 *
	 * @covers ::present
	 */
	public function test_default_notice() {
		Monkey\Functions\expect( 'wp_enqueue_style' )->once();

		$test = new Notice_Presenter( 'title', 'content' );

		$expected = '<div class="notice notice-yoast yoast"><div class="notice-yoast__container">'
			. '<div>'
			. '<div class="notice-yoast__header">'
			. '<span class="yoast-icon"></span>'
			. '<h2 class="notice-yoast__header-heading">title</h2>'
			. '</div>'
			. '<p>content</p>'
			. '</div>'
			. '</div></div>';

		Monkey\Functions\expect( 'esc_html' )->andReturn( 'title' );
		Monkey\Functions\expect( 'plugin_dir_url' )->never();

		$this->assertEquals( $expected, (string) $test );
	}

	/**
	 * Test when the Notice has an image.
	 *
	 * @covers ::present
	 */
	public function test_notice_with_image() {
		Monkey\Functions\expect( 'wp_enqueue_style' )->once();

		$test = new Notice_Presenter( 'title', 'content', 'image.png' );

		$expected = '<div class="notice notice-yoast yoast"><div class="notice-yoast__container">'
			. '<div>'
			. '<div class="notice-yoast__header">'
			. '<span class="yoast-icon"></span>'
			. '<h2 class="notice-yoast__header-heading">title</h2>'
			. '</div>'
			. '<p>content</p>'
			. '</div>'
			. '<img src="images/image.png" alt="" height="60" width="75"/>'
			. '</div></div>';

		Monkey\Functions\expect( 'esc_html' )->andReturn( '' );
		Monkey\Functions\expect( 'esc_url' )->andReturn( '' );
		Monkey\Functions\expect( 'plugin_dir_url' )->andReturn( '' );

		$this->assertEquals( $expected, (string) $test );
	}

	/**
	 * Test when the Notice is dismissible.
	 *
	 * @covers ::present
	 */
	public function test_dismissble_notice() {
		Monkey\Functions\expect( 'wp_enqueue_style' )->once();

		$test = new Notice_Presenter( 'title', 'content', null, null, true );

		$expected = '<div class="notice notice-yoast yoast is-dismissible"><div class="notice-yoast__container">'
			. '<div>'
			. '<div class="notice-yoast__header">'
			. '<span class="yoast-icon"></span>'
			. '<h2 class="notice-yoast__header-heading">title</h2>'
			. '</div>'
			. '<p>content</p>'
			. '</div>'
			. '</div></div>';

		Monkey\Functions\expect( 'esc_html' )->andReturn( '' );
		Monkey\Functions\expect( 'esc_url' )->andReturn( '' );
		Monkey\Functions\expect( 'plugin_dir_url' )->andReturn( '' );

		$this->assertEquals( $expected, (string) $test );
	}

	/**
	 * Test when the Notice is dismissible and has an image.
	 *
	 * @covers ::present
	 */
	public function test_dismissble_notice_with_image() {
		Monkey\Functions\expect( 'wp_enqueue_style' )->once();

		$test = new Notice_Presenter( 'title', 'content', 'image.png', null, true );

		$expected = '<div class="notice notice-yoast yoast is-dismissible"><div class="notice-yoast__container">'
			. '<div>'
			. '<div class="notice-yoast__header">'
			. '<span class="yoast-icon"></span>'
			. '<h2 class="notice-yoast__header-heading">title</h2>'
			. '</div>'
			. '<p>content</p>'
			. '</div>'
			. '<img src="images/image.png" alt="" height="60" width="75"/>'
			. '</div></div>';

		Monkey\Functions\expect( 'esc_html' )->andReturn( '' );
		Monkey\Functions\expect( 'esc_url' )->andReturn( '' );
		Monkey\Functions\expect( 'plugin_dir_url' )->andReturn( '' );

		$this->assertEquals( $expected, (string) $test );
	}

	/**
	 * Test when the Notice is dismissible and has an image and a button.
	 *
	 * @covers ::present
	 */
	public function test_dismissble_notice_with_image_and_button() {
		Monkey\Functions\expect( 'wp_enqueue_style' )->once();

		$button = '<a class="yoast-button yoast-button-upsell" href="https://yoa.st/somewhere">Some text</a>';

		$test = new Notice_Presenter( 'title', 'content', 'image.png', $button, true );

		$expected = '<div class="notice notice-yoast yoast is-dismissible"><div class="notice-yoast__container">'
			. '<div>'
			. '<div class="notice-yoast__header">'
			. '<span class="yoast-icon"></span>'
			. '<h2 class="notice-yoast__header-heading">title</h2>'
			. '</div>'
			. '<p>content</p>'
			. '<p><a class="yoast-button yoast-button-upsell" href="https://yoa.st/somewhere">Some text</a></p>'
			. '</div>'
			. '<img src="images/image.png" alt="" height="60" width="75"/>'
			. '</div></div>';

		Monkey\Functions\expect( 'esc_html' )->andReturn( '' );
		Monkey\Functions\expect( 'esc_url' )->andReturn( '' );
		Monkey\Functions\expect( 'plugin_dir_url' )->andReturn( '' );

		$this->assertEquals( $expected, (string) $test );
	}
}

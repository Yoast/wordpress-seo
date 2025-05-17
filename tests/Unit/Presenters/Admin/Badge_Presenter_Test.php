<?php

namespace Yoast\WP\SEO\Tests\Unit\Presenters\Admin;

use Brain\Monkey;
use Mockery;
use Yoast\WP\SEO\Presenters\Admin\Badge_Presenter;
use Yoast\WP\SEO\Tests\Unit\TestCase;

/**
 * Class Badge_Presenter_Test.
 *
 * @coversDefaultClass \Yoast\WP\SEO\Presenters\Admin\Badge_Presenter
 *
 * @group presenters
 */
final class Badge_Presenter_Test extends TestCase {

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
		$test = new Badge_Presenter( 'test-id', 'http://example.com/' );

		$this->assertSame( 'test-id', $this->getPropertyValue( $test, 'id' ) );
		$this->assertSame( 'http://example.com/', $this->getPropertyValue( $test, 'link' ) );
	}

	/**
	 * Test constructor with a group.
	 *
	 * @covers ::__construct
	 *
	 * @return void
	 */
	public function test_construct_with_group() {
		$test = new Badge_Presenter( 'test-id', 'http://example.com/', 'test-group' );

		$this->assertSame( 'test-id', $this->getPropertyValue( $test, 'id' ) );
		$this->assertSame( 'http://example.com/', $this->getPropertyValue( $test, 'link' ) );
		$this->assertSame( 'test-group', $this->getPropertyValue( $test, 'group' ) );
	}

	/**
	 * Tests when the badge is initialized with a link.
	 *
	 * @covers ::present
	 *
	 * @return void
	 */
	public function test_badge_with_link() {
		$test = new Badge_Presenter( 'test1', 'http://example.com/' );

		$expected = '<a class="yoast-badge yoast-badge__is-link yoast-new-badge" id="test1-new-badge" href="http://example.com/">New</a>';
		Monkey\Functions\expect( 'esc_url' )->andReturn( '' );
		Monkey\Functions\expect( 'esc_html__' )->once()->andReturn( 'New' );

		$this->assertEquals( $expected, (string) $test );
	}

	/**
	 * Tests when the badge is initialized without a link.
	 *
	 * @covers ::present
	 *
	 * @return void
	 */
	public function test_badge_without_link() {
		$test = new Badge_Presenter( 'test2' );

		$expected = '<span class="yoast-badge yoast-new-badge" id="test2-new-badge">New</span>';
		Monkey\Functions\expect( 'esc_url' )->andReturn( '' );
		Monkey\Functions\expect( 'esc_html__' )->once()->andReturn( 'New' );

		$this->assertEquals( $expected, (string) $test );
	}

	/**
	 * Tests when the badge is in an expired group.
	 *
	 * @covers ::present
	 *
	 * @return void
	 */
	public function test_badge_with_expired_group() {
		$test = Mockery::mock( Badge_Presenter::class )->makePartial();

		$test->expects( 'is_group_still_new' )
			->once()
			->andReturnFalse();

		$test->__construct( 'test2', '', 'test-group' );

		$expected = '';

		$this->assertEquals( $expected, (string) $test );
	}
}

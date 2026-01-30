<?php

namespace Yoast\WP\SEO\Tests\Unit\Introductions\Application;

use Mockery;
use Yoast\WP\SEO\Helpers\Current_Page_Helper;
use Yoast\WP\SEO\Introductions\Application\Schema_Aggregator_Announcement;
use Yoast\WP\SEO\Tests\Unit\TestCase;

/**
 * Tests the Schema aggregator introduction modal.
 *
 * @group introductions
 *
 * @coversDefaultClass \Yoast\WP\SEO\Introductions\Application\Schema_Aggregator_Announcement
 *
 * @phpcs:disable Yoast.NamingConventions.ObjectNameDepth.MaxExceeded
 */
final class Schema_Aggregator_Announcement_Test extends TestCase {

	/**
	 * Holds the instance.
	 *
	 * @var Schema_Aggregator_Announcement
	 */
	private $instance;

	/**
	 * Holds the current page helper.
	 *
	 * @var Mockery\MockInterface|Current_Page_Helper
	 */
	private $current_page_helper;

	/**
	 * Sets up the test fixtures.
	 *
	 * @return void
	 */
	protected function set_up() {
		parent::set_up();

		$this->current_page_helper = Mockery::mock( Current_Page_Helper::class );

		$this->instance = new Schema_Aggregator_Announcement( $this->current_page_helper );
	}

	/**
	 * Tests if the needed attributes are set correctly.
	 *
	 * @covers ::__construct
	 *
	 * @return void
	 */
	public function test_constructor() {
		$this->assertInstanceOf(
			Current_Page_Helper::class,
			$this->getPropertyValue( $this->instance, 'current_page_helper' )
		);
	}

	/**
	 * Tests getting the ID.
	 *
	 * @covers ::get_id
	 *
	 * @return void
	 */
	public function test_get_id() {
		$this->assertSame( 'schema-aggregator-announcement', $this->instance->get_id() );
	}

	/**
	 * Tests getting the priority.
	 *
	 * @covers ::get_priority
	 *
	 * @return void
	 */
	public function test_get_priority() {
		$this->assertSame( 20, $this->instance->get_priority() );
	}

	/**
	 * Tests the conditional `should_show`.
	 *
	 * @covers ::should_show
	 *
	 * @dataProvider should_show_data
	 *
	 * @param bool $is_yoast_seo_page Whether on a Yoast SEO page.
	 * @param bool $expected          The expected result.
	 *
	 * @return void
	 */
	public function test_should_show( bool $is_yoast_seo_page, bool $expected ) {
		$this->current_page_helper->expects( 'is_yoast_seo_page' )
			->withNoArgs()
			->andReturn( $is_yoast_seo_page );

		$this->assertSame( $expected, $this->instance->should_show() );
	}

	/**
	 * Provides the data for `test_should_show`.
	 *
	 * @return array<string, array<string, bool>>
	 */
	public static function should_show_data(): array {
		return [
			'on a Yoast admin page'     => [
				'is_yoast_seo_page' => true,
				'expected'          => true,
			],
			'not on a Yoast admin page' => [
				'is_yoast_seo_page' => false,
				'expected'          => false,
			],
		];
	}
}

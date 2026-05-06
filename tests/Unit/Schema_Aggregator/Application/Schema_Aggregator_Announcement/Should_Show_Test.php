<?php
// phpcs:disable Yoast.NamingConventions.NamespaceName.TooLong -- Needed in the folder structure.
// phpcs:disable Yoast.NamingConventions.NamespaceName.MaxExceeded
namespace Yoast\WP\SEO\Tests\Unit\Schema_Aggregator\Application\Schema_Aggregator_Announcement;

use Brain\Monkey;

/**
 * Tests for the Schema_Aggregator_Announcement::should_show method.
 *
 * @covers \Yoast\WP\SEO\Schema_Aggregator\Application\Schema_Aggregator_Announcement::should_show
 *
 * @group schema-aggregator
 * @group introductions
 *
 * @phpcs:disable Yoast.NamingConventions.ObjectNameDepth.MaxExceeded
 */
final class Should_Show_Test extends Abstract_Schema_Aggregator_Announcement_Test {

	/**
	 * Tests the conditional should_show.
	 *
	 * @dataProvider should_show_data
	 *
	 * @param bool $is_yoast_seo_page  Whether on a Yoast SEO page.
	 * @param bool $can_manage_options Whether the user has the `wpseo_manage_options` capability.
	 * @param int  $can_manage_times   How many times the capability check is expected to run.
	 * @param bool $expected           The expected result.
	 *
	 * @return void
	 */
	public function test_should_show( bool $is_yoast_seo_page, bool $can_manage_options, int $can_manage_times, bool $expected ): void {
		$this->current_page_helper->expects( 'is_yoast_seo_page' )
			->withNoArgs()
			->andReturn( $is_yoast_seo_page );
		Monkey\Functions\expect( 'current_user_can' )
			->times( $can_manage_times )
			->with( 'wpseo_manage_options' )
			->andReturn( $can_manage_options );

		$this->assertSame( $expected, $this->instance->should_show() );
	}

	/**
	 * Provides the data for test_should_show.
	 *
	 * @return array<string, array<string, bool|int>>
	 */
	public static function should_show_data(): array {
		return [
			'on a Yoast admin page with the required capability'    => [
				'is_yoast_seo_page'  => true,
				'can_manage_options' => true,
				'can_manage_times'   => 1,
				'expected'           => true,
			],
			'on a Yoast admin page without the required capability' => [
				'is_yoast_seo_page'  => true,
				'can_manage_options' => false,
				'can_manage_times'   => 1,
				'expected'           => false,
			],
			'not on a Yoast admin page'                             => [
				'is_yoast_seo_page'  => false,
				'can_manage_options' => true,
				'can_manage_times'   => 0,
				'expected'           => false,
			],
		];
	}
}

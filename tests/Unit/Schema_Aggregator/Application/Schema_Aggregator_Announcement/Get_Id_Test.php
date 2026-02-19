<?php
// phpcs:disable Yoast.NamingConventions.NamespaceName.TooLong -- Needed in the folder structure.
// phpcs:disable Yoast.NamingConventions.NamespaceName.MaxExceeded
namespace Yoast\WP\SEO\Tests\Unit\Schema_Aggregator\Application\Schema_Aggregator_Announcement;

/**
 * Tests for the Schema_Aggregator_Announcement::get_id method.
 *
 * @covers \Yoast\WP\SEO\Schema_Aggregator\Application\Schema_Aggregator_Announcement::get_id
 *
 * @group schema-aggregator
 * @group introductions
 *
 * @phpcs:disable Yoast.NamingConventions.ObjectNameDepth.MaxExceeded
 */
final class Get_Id_Test extends Abstract_Schema_Aggregator_Announcement_Test {

	/**
	 * Tests getting the ID.
	 *
	 * @return void
	 */
	public function test_get_id(): void {
		$this->assertSame( 'schema-aggregator-announcement', $this->instance->get_id() );
	}
}

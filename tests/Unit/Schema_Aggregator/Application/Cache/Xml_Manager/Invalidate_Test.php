<?php
// phpcs:disable Yoast.NamingConventions.NamespaceName.TooLong -- Needed in the folder structure.
// phpcs:disable Yoast.NamingConventions.NamespaceName.MaxExceeded
namespace Yoast\WP\SEO\Tests\Unit\Schema_Aggregator\Application\Cache\Xml_Manager;

use Brain\Monkey;

/**
 * Tests the Xml_Manager invalidate method.
 *
 * @group schema-aggregator
 *
 * @covers Yoast\WP\SEO\Schema_Aggregator\Application\Cache\Xml_Manager::invalidate
 * @covers Yoast\WP\SEO\Schema_Aggregator\Application\Cache\Xml_Manager::get_cache_key
 */
final class Invalidate_Test extends Abstract_Xml_Manager_Test {

	/**
	 * Tests invalidate() deletes cache successfully.
	 *
	 * @return void
	 */
	public function test_invalidate_deletes_cache() {
		Monkey\Functions\expect( 'delete_transient' )
			->once()
			->with( 'yoast_schema_aggregator_xml_sitemap_v1' )
			->andReturn( true );

		$result = $this->instance->invalidate();

		$this->assertTrue( $result );
	}

	/**
	 * Tests invalidate() returns false when deletion fails.
	 *
	 * @return void
	 */
	public function test_invalidate_returns_false_when_deletion_fails() {
		Monkey\Functions\expect( 'delete_transient' )
			->once()
			->with( 'yoast_schema_aggregator_xml_sitemap_v1' )
			->andReturn( false );

		$result = $this->instance->invalidate();

		$this->assertFalse( $result );
	}
}

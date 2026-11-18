<?php
// phpcs:disable Yoast.NamingConventions.NamespaceName.TooLong -- Needed in the folder structure.
// phpcs:disable Yoast.NamingConventions.NamespaceName.MaxExceeded
namespace Yoast\WP\SEO\Tests\Unit\Schema_Aggregator\Application\Schema_Map\Schema_Map_Xml_Provider;

use Mockery;
use Yoast\WP\SEO\Schema_Aggregator\Application\Aggregate_Site_Schema_Map_Command;

/**
 * Tests the Schema_Map_Xml_Provider get_xml method.
 *
 * @group schema-aggregator
 *
 * @covers Yoast\WP\SEO\Schema_Aggregator\Application\Schema_Map\Schema_Map_Xml_Provider::get_xml
 */
final class Get_Xml_Test extends Abstract_Schema_Map_Xml_Provider_Test {

	/**
	 * Tests that the cached XML is returned without building it again.
	 *
	 * @return void
	 */
	public function test_get_xml_returns_the_cached_xml() {
		$cached_xml = '<?xml version="1.0" encoding="UTF-8"?><urlset></urlset>';

		$this->xml_cache_manager->expects( 'get' )->once()->andReturn( $cached_xml );
		$this->aggregator_config->expects( 'get_allowed_post_types' )->never();
		$this->command_handler->expects( 'handle' )->never();
		$this->xml_cache_manager->expects( 'set' )->never();

		$this->assertSame( $cached_xml, $this->instance->get_xml() );
	}

	/**
	 * Tests that the XML is built and cached when there is no cached XML.
	 *
	 * @return void
	 */
	public function test_get_xml_builds_and_caches_on_a_cache_miss() {
		$built_xml = '<?xml version="1.0" encoding="UTF-8"?><urlset><url></url></urlset>';

		$this->xml_cache_manager->expects( 'get' )->once()->andReturn( null );
		$this->aggregator_config->expects( 'get_allowed_post_types' )->once()->andReturn( [ 'post', 'page' ] );

		$this->command_handler->expects( 'handle' )
			->once()
			->with(
				Mockery::on(
					static function ( $command ) {
						return $command instanceof Aggregate_Site_Schema_Map_Command
							&& $command->get_post_types() === [ 'post', 'page' ];
					},
				),
			)
			->andReturn( $built_xml );

		$this->xml_cache_manager->expects( 'set' )->once()->with( $built_xml )->andReturn( true );

		$this->assertSame( $built_xml, $this->instance->get_xml() );
	}
}

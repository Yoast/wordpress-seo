<?php
// phpcs:disable Yoast.NamingConventions.NamespaceName.TooLong -- Needed in the folder structure.
// phpcs:disable Yoast.NamingConventions.NamespaceName.MaxExceeded
namespace Yoast\WP\SEO\Tests\Unit\Schema_Aggregator\User_Interface\Site_Schema_Robots_Txt_Integration;

use Brain\Monkey\Functions;
use Generator;
use Mockery;
use Yoast\WP\SEO\Helpers\Robots_Txt_Helper;
use Yoast\WP\SEO\Main;
use Yoast\WP\SEO\Schema_Aggregator\User_Interface\Site_Schema_Aggregator_Xml_Route;

/**
 * Test class for the maybe_add_xml_schema_map method.
 *
 * @group Site_Schema_Robots_Txt_Integration
 *
 * @covers Yoast\WP\SEO\Schema_Aggregator\User_Interface\Site_Schema_Robots_Txt_Integration::maybe_add_xml_schema_map
 *
 * @phpcs:disable Yoast.NamingConventions.ObjectNameDepth.MaxExceeded
 */
final class Site_Schema_Robots_Txt_Integration_Maybe_Add_Xml_Schema_Map_Test extends Abstract_Site_Schema_Robots_Txt_Integration_Test {

	/**
	 * Tests maybe adding the XML schema map to robots.txt.
	 *
	 * @dataProvider maybe_add_xml_schema_map_data
	 *
	 * @param string $blog_public       The blog_public option value.
	 * @param bool   $should_add_schema Whether add_schemamap should be called.
	 *
	 * @return void
	 */
	public function test_maybe_add_xml_schema_map( $blog_public, $should_add_schema ) {
		$robots_txt_helper = Mockery::mock( Robots_Txt_Helper::class );

		Functions\expect( 'get_option' )
			->once()
			->with( 'blog_public' )
			->andReturn( $blog_public );

		if ( $should_add_schema ) {
			$expected_url = 'http://example.com/wp-json/yoast/v1/schema-aggregator/get-xml';

			Functions\expect( 'rest_url' )
				->once()
				->with( Main::API_V1_NAMESPACE . '/' . Site_Schema_Aggregator_Xml_Route::ROUTE_PREFIX . '/get-xml' )
				->andReturn( $expected_url );

			Functions\expect( 'esc_url' )
				->once()
				->with( $expected_url )
				->andReturn( $expected_url );

			$robots_txt_helper
				->expects( 'add_schemamap' )
				->with( $expected_url )
				->once();
		}
		else {
			$robots_txt_helper
				->expects( 'add_schemamap' )
				->never();
		}

		$this->instance->maybe_add_xml_schema_map( $robots_txt_helper );
	}

	/**
	 * Data provider for the maybe_add_xml_schema_map test.
	 *
	 * @return Generator Test data to use.
	 */
	public static function maybe_add_xml_schema_map_data() {
		yield 'Blog is private (0)' => [
			'blog_public'       => '0',
			'should_add_schema' => false,
		];
		yield 'Blog is public (1)' => [
			'blog_public'       => '1',
			'should_add_schema' => true,
		];
		yield 'Blog is public (empty string treated as public)' => [
			'blog_public'       => '',
			'should_add_schema' => true,
		];
	}
}

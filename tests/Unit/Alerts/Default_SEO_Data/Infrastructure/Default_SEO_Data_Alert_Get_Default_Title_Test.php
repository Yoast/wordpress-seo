<?php
// phpcs:disable Yoast.NamingConventions.NamespaceName.TooLong -- Needed in the folder structure.
namespace Yoast\WP\SEO\Tests\Unit\Alerts\Default_SEO_Data\Infrastructure;

/**
 * Test class getting the types with default SEO title.
 *
 * @group Default_SEO_Data_Alert
 *
 * @covers Yoast\WP\SEO\Alerts\Infrastructure\Default_SEO_Data\Default_SEO_Data_Collector::get_types_with_default_seo_title
 *
 * @phpcs:disable Yoast.NamingConventions.ObjectNameDepth.MaxExceeded
 */
final class Default_SEO_Data_Alert_Get_Default_Title_Test extends Abstract_Default_SEO_Data_Collector_Test {

	/**
	 * Tests the get_types_with_default_seo_title method.
	 *
	 * @return void
	 */
	public function test_get_types_with_default_seo_title() {

		$this->options_helper
			->expects( 'get' )
			->once()
			->with( 'default_seo_title', [] )
			->andReturn( [ 'post' ] );

		$this->assertEquals( [ 'post' ], $this->instance->get_types_with_default_seo_title() );
	}

	/**
	 * Tests the get_types_with_default_seo_title method, returning no such types.
	 *
	 * @return void
	 */
	public function test_get_no_types_with_default_seo_title() {

		$this->options_helper
			->expects( 'get' )
			->once()
			->with( 'default_seo_title', [] )
			->andReturn( [] );

		$this->assertEquals( [], $this->instance->get_types_with_default_seo_title() );
	}
}

<?php

// phpcs:disable Yoast.NamingConventions.NamespaceName.TooLong -- Needed in the folder structure.
namespace Yoast\WP\SEO\Tests\Unit\Alerts\Infrastructure\Default_SEO_Data;

/**
 * Test class getting the posts with default SEO description.
 *
 * @group Default_SEO_Data_Alert
 *
 * @covers Yoast\WP\SEO\Alerts\Infrastructure\Default_SEO_Data\Default_SEO_Data_Collector::get_posts_with_default_seo_description
 *
 * @phpcs:disable Yoast.NamingConventions.ObjectNameDepth.MaxExceeded
 */
final class Default_SEO_Data_Alert_Get_Default_Description_Test extends Abstract_Default_SEO_Data_Collector_Test {

	/**
	 * Tests the get_posts_with_default_seo_description method.
	 *
	 * @return void
	 */
	public function test_get_posts_with_default_seo_description() {

		$this->options_helper
			->expects( 'get' )
			->once()
			->with( 'default_seo_meta_desc', [] )
			->andReturn( [ 1, 2, 3 ] );

		$this->assertEquals( [ 1, 2, 3 ], $this->instance->get_posts_with_default_seo_description() );
	}

	/**
	 * Tests the get_posts_with_default_seo_description method, returning no such types.
	 *
	 * @return void
	 */
	public function test_get_no_posts_with_default_seo_description() {

		$this->options_helper
			->expects( 'get' )
			->once()
			->with( 'default_seo_meta_desc', [] )
			->andReturn( [] );

		$this->assertEquals( [], $this->instance->get_posts_with_default_seo_description() );
	}
}

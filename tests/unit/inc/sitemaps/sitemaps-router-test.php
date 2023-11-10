<?php

namespace Yoast\WP\SEO\Tests\Unit\Inc\Sitemaps;

use Brain\Monkey\Functions;
use Mockery;
use WPSEO_Sitemaps_Router;
use Yoast\WP\SEO\Conditionals\Deactivating_Yoast_Seo_Conditional;
use Yoast\WP\SEO\Tests\Unit\TestCase;

/**
 * Unit Test Class.
 *
 * @group sitemaps
 *
 * @coversDefaultClass WPSEO_Sitemaps_Router
 */
class Sitemaps_Router_Test extends TestCase {

	/**
	 * Class instance to use for the test.
	 *
	 * @var WPSEO_Sitemaps_Router
	 */
	protected $instance;

	/**
	 * Set up the class which will be tested.
	 *
	 * @return void
	 */
	protected function set_up() {

		parent::set_up();

		$deacrivating_yoast_conditional = Mockery::mock( Deactivating_Yoast_Seo_Conditional::class );

		$container = $this->create_container_with(
			[
				Deactivating_Yoast_Seo_Conditional::class => $deacrivating_yoast_conditional,
			]
		);

		$deacrivating_yoast_conditional->expects( 'is_met' )
			->once()
			->andReturnFalse();


		Functions\expect( 'YoastSEO' )
			->once()
			->andReturn( (object) [ 'classes' => $this->create_classes_surface( $container ) ] );


		$this->instance = new WPSEO_Sitemaps_Router();
	}

	/**
	 * Tests add_query_vars method.
	 *
	 * @covers ::add_query_vars
	 */
	public function test_add_query_vars() {
		$this->instance->add_query_vars( [] );

		$this->assertContains( 'sitemap', $this->instance->add_query_vars( [] ), 'sitemap is not in the query vars' );
		$this->assertContains( 'sitemap_n', $this->instance->add_query_vars( [] ), 'sitemap_n is not in the query vars' );
		$this->assertContains( 'yoast-sitemap-xsl', $this->instance->add_query_vars( [] ), 'yoast-sitemap-xsl is not in the query vars' );
	}
}

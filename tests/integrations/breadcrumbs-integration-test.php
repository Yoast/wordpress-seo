<?php

namespace Yoast\WP\SEO\Tests\Integrations;

use \Mockery;
use Brain\Monkey;
use WPSEO_Replace_Vars;
use Yoast\WP\SEO\Conditionals\Breadcrumbs_Enabled_Conditional;
use Yoast\WP\SEO\Integrations\Breadcrumbs_Integration;
use Yoast\WP\SEO\Main;
use Yoast\WP\SEO\Presentations\Indexable_Presentation;
use Yoast\WP\SEO\Presenters\Breadcrumbs_Presenter;
use Yoast\WP\SEO\Surfaces\Current_Page_Surface;
use Yoast\WP\SEO\Surfaces\Helpers_Surface;
use Yoast\WP\SEO\Tests\TestCase;

/**
 * Unit Test Class.
 *
 * @coversDefaultClass \Yoast\WP\SEO\Integrations\Breadcrumbs_Integration
 *
 * @group integrations
 */
class Breadcrumbs_Integration_Test extends TestCase {

	/**
	 * Holds the instance of the class being tested.
	 *
	 * @var Breadcrumbs_Integration
	 */
	protected $instance;

	/**
	 * The breadcrumbs presenter.
	 *
	 * @var Breadcrumbs_Presenter
	 */
	protected $presenter;

	/**
	 * Set up the class which will be tested.
	 */
	public function setUp() {
		parent::setUp();

		$this->instance = new Breadcrumbs_Integration( Mockery::mock( Helpers_Surface::class ), Mockery::mock( WPSEO_Replace_Vars::class ) );
	}

	/**
	 * Tests the get_conditionals functions.
	 *
	 * @covers ::get_conditionals
	 */
	public function test_get_conditionals() {
		$this->assertEquals( [ Breadcrumbs_Enabled_Conditional::class ], Breadcrumbs_Integration::get_conditionals() );
	}

	/**
	 * Tests the render function.
	 *
	 * @covers ::render
	 */
	public function test_render() {
		$current_page_surface   = Mockery::mock( Current_Page_Surface::class );
		$indexable_presentation = Mockery::mock( Indexable_Presentation::class );
		$indexable_presentation->breadcrumbs = [];

		$current_page_surface
			->expects( 'get_presentation' )
			->andReturn( $indexable_presentation );

		$mock = Mockery::mock( Main::class );
		$mock->current_page = $current_page_surface;

		Monkey\Functions\expect( 'YoastSEO' )->once()->andReturn( $mock );

		$this->assertEquals( '', $this->instance->render() );
	}
}

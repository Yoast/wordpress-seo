<?php

namespace Yoast\WP\SEO\Tests\Integrations;

use \Mockery;
use Brain\Monkey;
use Yoast\WP\SEO\Conditionals\Breadcrumbs_Enabled_Conditional;
use Yoast\WP\SEO\Integrations\Breadcrumbs_Integration;
use Yoast\WP\SEO\Main;
use Yoast\WP\SEO\Presentations\Indexable_Presentation;
use Yoast\WP\SEO\Presenters\Breadcrumbs_Presenter;
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

		$this->presenter = Mockery::mock( Breadcrumbs_Presenter::class );

		$this->instance = new Breadcrumbs_Integration( $this->presenter );
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
		$indexable_presentation = new Indexable_Presentation();

		$mock = Mockery::mock( Main::class );
		$mock
			->expects( 'get_current_page_presentation' )
			->andReturn( $indexable_presentation );

		Monkey\Functions\expect( 'yoastseo' )->once()->andReturn( $mock );

		$this->presenter
			->expects( 'present' )
			->once()
			->with( $indexable_presentation )
			->andReturn( 'breadcrumbs html' );

		$this->assertEquals( 'breadcrumbs html', $this->instance->render() );
	}
}

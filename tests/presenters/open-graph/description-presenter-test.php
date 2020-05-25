<?php

namespace Yoast\WP\SEO\Tests\Presenters\Open_Graph;

use Brain\Monkey;
use Mockery;
use WPSEO_Replace_Vars;
use Yoast\WP\SEO\Presentations\Indexable_Presentation;
use Yoast\WP\SEO\Presenters\Open_Graph\Description_Presenter;
use Yoast\WP\SEO\Tests\TestCase;

/**
 * Class \Yoast\WP\SEO\Presenters\Open_Graph\Description_Presenter_Test
 *
 * @coversDefaultClass \Yoast\WP\SEO\Presenters\Open_Graph\Description_Presenter
 *
 * @group presenters
 * @group open-graph
 */
class Description_Presenter_Test extends TestCase {

	/**
	 * The description presenter instance.
	 *
	 * @var Description_Presenter
	 */
	protected $instance;

	/**
	 * The indexable presentation.
	 *
	 * @var Indexable_Presentation
	 */
	protected $presentation;

	/**
	 * The WPSEO Replace Vars object.
	 *
	 * @var WPSEO_Replace_Vars|Mockery\MockInterface
	 */
	protected $replace_vars;

	/**
	 * Sets up the test class.
	 */
	public function setUp() {
		parent::setUp();

		$this->instance     = new Description_Presenter();
		$this->presentation = new Indexable_Presentation();
		$this->replace_vars = Mockery::mock( WPSEO_Replace_Vars::class );

		$this->instance->presentation = $this->presentation;
		$this->instance->replace_vars = $this->replace_vars;

		$this->presentation->source = [];

		$this->replace_vars
			->expects( 'replace' )
			->once()
			->andReturnUsing(
				function ( $string ) {
					return $string;
				}
			);
	}

	/**
	 * Tests whether the presenter returns the correct description.
	 *
	 * @covers ::present
	 */
	public function test_present() {
		$this->presentation->open_graph_description = 'My description';

		$expected = '<meta property="og:description" content="My description" />';
		$actual   = $this->instance->present();

		$this->assertEquals( $expected, $actual );
	}

	/**
	 * Tests the presenter with an empty description.
	 *
	 * @covers ::present
	 */
	public function test_present_empty_description() {
		$this->presentation->open_graph_description = '';

		$expected = '';
		$actual   = $this->instance->present();

		$this->assertEquals( $expected, $actual );
	}

	/**
	 * Tests whether the `wpseo_opengraph_desc` filter is used.
	 *
	 * @covers ::present
	 * @covers ::get
	 */
	public function test_present_filter() {
		$this->presentation->open_graph_description = 'My description';

		Monkey\Filters\expectApplied( 'wpseo_opengraph_desc' )
			->once()
			->with( 'My description', $this->presentation )
			->andReturn( 'My filtered description' );

		$expected = '<meta property="og:description" content="My filtered description" />';
		$actual   = $this->instance->present();

		$this->assertEquals( $expected, $actual );
	}
}

<?php

namespace Yoast\WP\SEO\Tests\Presenters\Open_Graph;

use Mockery;
use Brain\Monkey;
use Yoast\WP\SEO\Helpers\String_Helper;
use Yoast\WP\SEO\Presentations\Indexable_Presentation;
use Yoast\WP\SEO\Presenters\Open_Graph\Title_Presenter;
use Yoast\WP\SEO\Tests\TestCase;

/**
 * Class Title_Presenter_Test
 *
 * @coversDefaultClass \Yoast\WP\SEO\Presenters\Open_Graph\Title_Presenter
 *
 * @group presenters
 * @group open-graph
 */
class Title_Presenter_Test extends TestCase {
	/**
	 * @var Indexable_Presentation
	 */
	protected $indexable_presentation;

	/**
	 * @var Title_Presenter
	 */
	protected $instance;

	/**
	 * @var \WPSEO_Replace_Vars|Mockery\MockInterface
	 */
	protected $replace_vars;

	/**
	 * @var Mockery\MockInterface
	 */
	protected $string;

	/**
	 * Sets up the test class.
	 */
	public function setUp() {
		parent::setUp();

		$this->replace_vars = Mockery::mock( \WPSEO_Replace_Vars::class );
		$this->string       = Mockery::mock( String_Helper::class );

		$this->instance = new Title_Presenter( $this->string );
		$this->instance->set_replace_vars( $this->replace_vars );

		$this->indexable_presentation         = new Indexable_Presentation();
		$this->indexable_presentation->source = [];

		$this->string
			->expects( 'strip_all_tags' )
			->withAnyArgs()
			->once()
			->andReturnUsing( function( $string ) {
				return $string;
			} );
	}

	/**
	 * Tests whether the presenter returns the correct title.
	 *
	 * @covers ::present
	 */
	public function test_present() {
		$this->indexable_presentation->open_graph_title = 'example_title';

		$this->replace_vars
			->expects( 'replace' )
			->andReturnUsing( function ( $str ) {
				return $str;
			} );

		$expected = '<meta property="og:title" content="example_title" />';
		$actual   = $this->instance->present( $this->indexable_presentation );

		$this->assertEquals( $expected, $actual );
	}

	/**
	 * Tests whether the presenter returns an empty string when the title is empty.
	 *
	 * @covers ::present
	 */
	public function test_present_title_is_empty() {
		$this->indexable_presentation->open_graph_title = '';

		$this->replace_vars
			->expects( 'replace' )
			->andReturnUsing( function ( $str ) {
				return $str;
			} );

		$actual = $this->instance->present( $this->indexable_presentation );

		$this->assertEmpty( $actual );
	}

	/**
	 * Tests whether the presenter returns the correct title, when the `wpseo_opengraph_title` filter is applied.
	 *
	 * @covers ::present
	 * @covers ::filter
	 */
	public function test_present_filter() {
		$this->indexable_presentation->open_graph_title = 'example_title';

		$this->replace_vars
			->expects( 'replace' )
			->andReturnUsing( function ( $str ) {
				return $str;
			} );

		Monkey\Filters\expectApplied( 'wpseo_opengraph_title' )
			->once()
			->with( 'example_title', $this->indexable_presentation )
			->andReturn( 'exampletitle' );

		$expected = '<meta property="og:title" content="exampletitle" />';
		$actual   = $this->instance->present( $this->indexable_presentation );

		$this->assertEquals( $expected, $actual );
	}
}

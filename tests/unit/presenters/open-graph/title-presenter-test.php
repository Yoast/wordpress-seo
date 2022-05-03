<?php

namespace Yoast\WP\SEO\Tests\Unit\Presenters\Open_Graph;

use Brain\Monkey;
use Mockery;
use WPSEO_Replace_Vars;
use Yoast\WP\SEO\Helpers\String_Helper;
use Yoast\WP\SEO\Presentations\Indexable_Presentation;
use Yoast\WP\SEO\Presenters\Open_Graph\Title_Presenter;
use Yoast\WP\SEO\Tests\Unit\TestCase;

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
	 * The indexable presentation.
	 *
	 * @var Indexable_Presentation
	 */
	protected $presentation;

	/**
	 * The title presenter instance.
	 *
	 * @var Title_Presenter
	 */
	protected $instance;

	/**
	 * The WPSEO Replace Vars object.
	 *
	 * @var WPSEO_Replace_Vars|Mockery\MockInterface
	 */
	protected $replace_vars;

	/**
	 * The string helper.
	 *
	 * @var String_Helper|Mockery\MockInterface
	 */
	protected $string;

	/**
	 * Sets up the test class.
	 */
	protected function set_up() {
		parent::set_up();

		$this->stubEscapeFunctions();

		$this->replace_vars = Mockery::mock( WPSEO_Replace_Vars::class );
		$this->string       = Mockery::mock( String_Helper::class );

		$this->instance               = new Title_Presenter();
		$this->instance->replace_vars = $this->replace_vars;
		$this->instance->helpers      = (object) [ 'string' => $this->string ];

		$this->presentation         = new Indexable_Presentation();
		$this->presentation->source = [];

		$this->instance->presentation = $this->presentation;

		$this->string
			->expects( 'strip_all_tags' )
			->withAnyArgs()
			->once()
			->andReturnUsing(
				static function( $str ) {
					return $str;
				}
			);
	}

	/**
	 * Tests whether the presenter returns the correct title.
	 *
	 * @covers ::present
	 */
	public function test_present() {
		$this->presentation->open_graph_title = 'example_title';

		$this->replace_vars
			->expects( 'replace' )
			->andReturnUsing(
				static function ( $str ) {
					return $str;
				}
			);

		$expected = '<meta property="og:title" content="example_title" />';
		$actual   = $this->instance->present();

		$this->assertEquals( $expected, $actual );
	}

	/**
	 * Tests whether the presenter returns an empty string when the title is empty.
	 *
	 * @covers ::present
	 */
	public function test_present_title_is_empty() {
		$this->presentation->open_graph_title = '';

		$this->replace_vars
			->expects( 'replace' )
			->andReturnUsing(
				static function ( $str ) {
					return $str;
				}
			);

		$actual = $this->instance->present();

		$this->assertEmpty( $actual );
	}

	/**
	 * Tests whether the presenter returns the correct title, when the `wpseo_opengraph_title` filter is applied.
	 *
	 * @covers ::present
	 * @covers ::get
	 */
	public function test_present_filter() {
		$this->presentation->open_graph_title = 'example_title';

		$this->replace_vars
			->expects( 'replace' )
			->andReturnUsing(
				static function ( $str ) {
					return $str;
				}
			);

		Monkey\Filters\expectApplied( 'wpseo_opengraph_title' )
			->once()
			->with( 'example_title', $this->presentation )
			->andReturn( 'exampletitle' );

		$expected = '<meta property="og:title" content="exampletitle" />';
		$actual   = $this->instance->present();

		$this->assertEquals( $expected, $actual );
	}
}

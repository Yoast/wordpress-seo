<?php

namespace Yoast\WP\SEO\Tests\Unit\Presenters;

use Brain\Monkey;
use Mockery;
use WPSEO_Replace_Vars;
use Yoast\WP\SEO\Helpers\String_Helper;
use Yoast\WP\SEO\Presentations\Indexable_Presentation;
use Yoast\WP\SEO\Presenters\Title_Presenter;
use Yoast\WP\SEO\Tests\Unit\TestCase;

/**
 * Class Title_Presenter_Test
 *
 * @coversDefaultClass \Yoast\WP\SEO\Presenters\Title_Presenter
 *
 * @group presenters
 * @group title-presenter
 */
class Title_Presenter_Test extends TestCase {

	/**
	 * The indexable presentation.
	 *
	 * @var Indexable_Presentation
	 */
	protected $indexable_presentation;

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

		$this->instance               = new Title_Presenter( $this->string );
		$this->instance->replace_vars = $this->replace_vars;
		$this->instance->helpers      = (object) [
			'string' => $this->string,
		];

		$this->indexable_presentation         = new Indexable_Presentation();
		$this->indexable_presentation->source = [];

		$this->instance->presentation = $this->indexable_presentation;

		$this->string
			->expects( 'strip_all_tags' )
			->withAnyArgs()
			->once()
			->andReturnUsing(
				static function ( $str ) {
					return $str;
				}
			);

		Monkey\Functions\expect( 'wp_get_document_title' )
			->andReturnUsing(
				function() {
					return $this->instance->get_title();
				}
			);
	}

	/**
	 * Tests whether the presenter returns the correct title.
	 *
	 * @covers ::present
	 */
	public function test_present() {
		$this->indexable_presentation->title = 'example_title';

		$this->replace_vars
			->expects( 'replace' )
			->andReturnUsing(
				static function ( $str ) {
					return $str;
				}
			);

		$expected = '<title>example_title</title>';
		$actual   = $this->instance->present();

		$this->assertEquals( $expected, $actual );
	}

	/**
	 * Tests whether the presenter returns an empty string when the title is empty.
	 *
	 * @covers ::present
	 */
	public function test_present_title_is_empty() {
		$this->indexable_presentation->title = '';

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
	 * Tests whether the presenter returns the correct title, when the `wpseo_title` filter is applied.
	 *
	 * @covers ::present
	 * @covers ::get
	 */
	public function test_present_filter() {
		$this->indexable_presentation->title = 'example_title';

		$this->replace_vars
			->expects( 'replace' )
			->andReturnUsing(
				static function ( $str ) {
					return $str;
				}
			);

		Monkey\Filters\expectApplied( 'wpseo_title' )
			->once()
			->with( 'example_title', Mockery::type( Indexable_Presentation::class ) )
			->andReturn( 'example_title' );

		$expected = '<title>example_title</title>';
		$actual   = $this->instance->present();

		$this->assertEquals( $expected, $actual );
	}
}

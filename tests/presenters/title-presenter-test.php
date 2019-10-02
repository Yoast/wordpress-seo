<?php

namespace Yoast\WP\Free\Tests\Presenters;

use Mockery;
use Brain\Monkey;
use Yoast\WP\Free\Presentations\Indexable_Presentation;
use Yoast\WP\Free\Presenters\Title_Presenter;
use Yoast\WP\Free\Tests\TestCase;

/**
 * Class Title_Presenter_Test
 *
 * @coversDefaultClass \Yoast\WP\Free\Presenters\Title_Presenter
 *
 * @group title-presenter
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
	 * Sets up the test class.
	 */
	public function setUp() {
		$this->replace_vars = Mockery::mock( \WPSEO_Replace_Vars::class );

		$this->instance = new Title_Presenter();
		$this->instance->set_replace_vars_helper( $this->replace_vars );

		$this->indexable_presentation = new Indexable_Presentation();
		$this->indexable_presentation->replace_vars_object = [];

		return parent::setUp();
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
			->andReturnUsing( function( $str ) {
				return $str;
			} );

		Monkey\Functions\expect( 'wp_strip_all_tags' )
			->andReturn( 'example_title' );

		$expected = '<title>example_title</title>';
		$actual = $this->instance->present( $this->indexable_presentation );

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
			->andReturnUsing( function( $str ) {
				return $str;
			} );

		Monkey\Functions\expect( 'wp_strip_all_tags' )
			->andReturn( '' );

		$actual = $this->instance->present( $this->indexable_presentation );

		$this->assertEmpty( $actual );
	}

	/**
	 * Tests whether the presenter returns the correct title, when the `wpseo_title` filter is applied.
	 *
	 * @covers ::present
	 * @covers ::filter
	 */
	public function test_present_filter() {
		$this->indexable_presentation->title = 'example_title';

		$this->replace_vars
			->expects( 'replace' )
			->andReturnUsing( function( $str ) {
				return $str;
			} );

		Monkey\Filters\expectApplied( 'wpseo_title' )
			->once()
			->with( 'example_title' )
			->andReturn( 'exampletitle' );

		Monkey\Functions\expect( 'wp_strip_all_tags' )
			->andReturn( 'exampletitle' );

		$expected = '<title>exampletitle</title>';
		$actual = $this->instance->present( $this->indexable_presentation );

		$this->assertEquals( $expected, $actual );
	}
}

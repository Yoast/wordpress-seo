<?php

namespace Yoast\WP\SEO\Tests\Unit\Presenters\Open_Graph;

use Brain\Monkey;
use Yoast\WP\SEO\Presentations\Indexable_Presentation;
use Yoast\WP\SEO\Presenters\Open_Graph\Type_Presenter;
use Yoast\WP\SEO\Tests\Unit\TestCase;

/**
 * Class Type_Presenter_Test
 *
 * @coversDefaultClass \Yoast\WP\SEO\Presenters\Open_Graph\Type_Presenter
 *
 * @group presenters
 * @group open-graph
 * @group type-presenter
 */
class Type_Presenter_Test extends TestCase {

	/**
	 * The indexable presentation.
	 *
	 * @var Indexable_Presentation
	 */
	protected $presentation;

	/**
	 * The type presenter instance.
	 *
	 * @var Type_Presenter
	 */
	protected $instance;

	/**
	 * Sets up the test class.
	 */
	protected function set_up() {
		parent::set_up();

		$this->stubEscapeFunctions();

		$this->instance     = new Type_Presenter();
		$this->presentation = new Indexable_Presentation();

		$this->instance->presentation = $this->presentation;
	}

	/**
	 * Tests whether the presenter returns the correct open graph type.
	 *
	 * @covers ::present
	 */
	public function test_present() {
		$this->presentation->open_graph_type = 'article';

		Monkey\Functions\expect( 'is_admin_bar_showing' )->andReturn( false );

		$expected = '<meta property="og:type" content="article" />';
		$actual   = $this->instance->present();

		$this->assertEquals( $expected, $actual );
	}

	/**
	 * Tests whether the presenter returns an empty string when the open graph type is empty.
	 *
	 * @covers ::present
	 */
	public function test_present_type_is_empty() {
		$this->presentation->open_graph_type = '';

		$actual = $this->instance->present();

		$this->assertEmpty( $actual );
	}

	/**
	 * Tests whether the presenter returns the correct type, when the `wpseo_opengraph_type` filter
	 * is applied.
	 *
	 * @covers ::present
	 * @covers ::get
	 */
	public function test_present_filter() {
		$this->presentation->open_graph_type = 'website';

		Monkey\Filters\expectApplied( 'wpseo_opengraph_type' )
			->once()
			->with( 'website', $this->presentation )
			->andReturn( 'article' );
		Monkey\Functions\expect( 'is_admin_bar_showing' )->andReturn( false );

		$expected = '<meta property="og:type" content="article" />';
		$actual   = $this->instance->present();

		$this->assertEquals( $expected, $actual );
	}

	/**
	 * Tests whether the presenter returns the correct open graph type when the admin bar is showing a class is added.
	 *
	 * @covers ::present
	 */
	public function test_present_with_class() {
		$this->presentation->open_graph_type = 'article';

		Monkey\Functions\expect( 'is_admin_bar_showing' )->andReturn( true );

		$expected = '<meta property="og:type" content="article" class="yoast-seo-meta-tag" />';
		$actual   = $this->instance->present();

		$this->assertEquals( $expected, $actual );
	}
}

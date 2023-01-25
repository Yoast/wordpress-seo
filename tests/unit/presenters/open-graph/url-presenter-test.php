<?php

namespace Yoast\WP\SEO\Tests\Unit\Presenters\Open_Graph;

use Brain\Monkey;
use Yoast\WP\SEO\Presentations\Indexable_Presentation;
use Yoast\WP\SEO\Presenters\Open_Graph\Url_Presenter;
use Yoast\WP\SEO\Tests\Unit\TestCase;

/**
 * Class Url_Presenter_Test
 *
 * @coversDefaultClass \Yoast\WP\SEO\Presenters\Open_Graph\Url_Presenter
 *
 * @group presenters
 * @group open-graph
 */
class Url_Presenter_Test extends TestCase {

	/**
	 * The URL presenter instance.
	 *
	 * @var Url_Presenter
	 */
	protected $instance;

	/**
	 * The indexable presentation.
	 *
	 * @var Indexable_Presentation
	 */
	protected $presentation;

	/**
	 * Sets up the test class.
	 */
	protected function set_up() {
		parent::set_up();

		$this->stubEscapeFunctions();

		$this->instance     = new Url_Presenter();
		$this->presentation = new Indexable_Presentation();

		$this->instance->presentation = $this->presentation;
	}

	/**
	 * Tests whether the presenter returns the correct URL.
	 *
	 * @covers ::present
	 */
	public function test_present() {
		$this->presentation->open_graph_url = 'www.example.com';

		Monkey\Functions\expect( 'is_admin_bar_showing' )->andReturn( false );

		$expected = '<meta property="og:url" content="www.example.com" />';
		$actual   = $this->instance->present();

		$this->assertEquals( $expected, $actual );
	}

	/**
	 * Tests the presenter with an empty URL.
	 *
	 * @covers ::present
	 */
	public function test_present_empty_url() {
		$this->presentation->open_graph_url = '';

		$this->assertEmpty( $this->instance->present() );
	}

	/**
	 * Tests whether the presenter returns the correct URL, when the `wpseo_opengraph_url` filter is applied.
	 *
	 * @covers ::present
	 * @covers ::get
	 */
	public function test_present_filter() {
		$this->presentation->open_graph_url = 'www.example.com';

		Monkey\Filters\expectApplied( 'wpseo_opengraph_url' )
			->once()
			->with( 'www.example.com', $this->presentation )
			->andReturn( 'www.example.com' );
		Monkey\Functions\expect( 'is_admin_bar_showing' )->andReturn( false );

		$expected = '<meta property="og:url" content="www.example.com" />';
		$actual   = $this->instance->present();

		$this->assertEquals( $expected, $actual );
	}

	/**
	 * Tests whether the presenter returns the correct URL when the admin bar is showing a class is added.
	 *
	 * @covers ::present
	 */
	public function test_present_with_class() {
		$this->presentation->open_graph_url = 'www.example.com';

		Monkey\Functions\expect( 'is_admin_bar_showing' )->andReturn( true );

		$expected = '<meta property="og:url" content="www.example.com" class="yoast-seo-meta-tag" />';
		$actual   = $this->instance->present();

		$this->assertEquals( $expected, $actual );
	}
}

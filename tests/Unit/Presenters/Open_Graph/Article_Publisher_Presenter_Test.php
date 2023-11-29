<?php

namespace Yoast\WP\SEO\Tests\Unit\Presenters\Open_Graph;

use Brain\Monkey;
use Yoast\WP\SEO\Presentations\Indexable_Presentation;
use Yoast\WP\SEO\Presenters\Open_Graph\Article_Publisher_Presenter;
use Yoast\WP\SEO\Tests\Unit\TestCase;

/**
 * Class Article_Publisher_Presenter_Test
 *
 * @coversDefaultClass \Yoast\WP\SEO\Presenters\Open_Graph\Article_Publisher_Presenter
 *
 * @group presenters
 * @group open-graph
 */
class Article_Publisher_Presenter_Test extends TestCase {

	/**
	 * The article publisher presenter test.
	 *
	 * @var Article_Publisher_Presenter
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

		$this->instance     = new Article_Publisher_Presenter();
		$this->presentation = new Indexable_Presentation();

		$this->instance->presentation = $this->presentation;
	}

	/**
	 * Tests whether the presenter returns the correct title.
	 *
	 * @covers ::present
	 */
	public function test_present() {
		$this->presentation->open_graph_article_publisher = 'https://example.com';

		Monkey\Functions\expect( 'is_admin_bar_showing' )->andReturn( false );

		$expected = '<meta property="article:publisher" content="https://example.com" />';
		$actual   = $this->instance->present();

		$this->assertEquals( $expected, $actual );
	}

	/**
	 * Tests the presenter with an empty site name.
	 *
	 * @covers ::present
	 */
	public function test_present_empty_article_publisher() {
		$this->presentation->open_graph_article_publisher = '';

		$expected = '';
		$actual   = $this->instance->present();

		$this->assertEquals( $expected, $actual );
	}

	/**
	 * Tests whether the presenter returns the correct publisher, when the `wpseo_og_article_publisher` filter is applied.
	 *
	 * @covers ::present
	 * @covers ::get
	 */
	public function test_present_filter() {
		$this->presentation->open_graph_article_publisher = 'https://example.com';

		Monkey\Filters\expectApplied( 'wpseo_og_article_publisher' )
			->once()
			->with( 'https://example.com', $this->presentation )
			->andReturn( 'https://otherpublisher.com' );
		Monkey\Functions\expect( 'is_admin_bar_showing' )->andReturn( false );

		$expected = '<meta property="article:publisher" content="https://otherpublisher.com" />';
		$actual   = $this->instance->present();

		$this->assertEquals( $expected, $actual );
	}

	/**
	 * Tests whether the presenter returns the correct title when the admin bar is showing a class is added.
	 *
	 * @covers ::present
	 */
	public function test_present_with_class() {
		$this->presentation->open_graph_article_publisher = 'https://example.com';

		Monkey\Functions\expect( 'is_admin_bar_showing' )->andReturn( true );

		$expected = '<meta property="article:publisher" content="https://example.com" class="yoast-seo-meta-tag" />';
		$actual   = $this->instance->present();

		$this->assertEquals( $expected, $actual );
	}
}

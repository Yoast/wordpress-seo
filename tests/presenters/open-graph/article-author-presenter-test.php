<?php

namespace Yoast\WP\SEO\Tests\Presenters\Open_Graph;

use Brain\Monkey;
use Yoast\WP\SEO\Presentations\Indexable_Presentation;
use Yoast\WP\SEO\Presenters\Open_Graph\Article_Author_Presenter;
use Yoast\WP\SEO\Tests\TestCase;

/**
 * Class Article_Author_Presenter_Test
 *
 * @coversDefaultClass \Yoast\WP\SEO\Presenters\Open_Graph\Article_Author_Presenter
 *
 * @group presenters
 * @group open-graph
 */
class Article_Author_Presenter_Test extends TestCase {

	/**
	 * The article author presenter instance.
	 *
	 * @var Article_Author_Presenter
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
	public function setUp() {
		$this->instance     = new Article_Author_Presenter();
		$this->presentation = new Indexable_Presentation();

		$this->instance->presentation = $this->presentation;

		return parent::setUp();
	}

	/**
	 * Tests whether the presenter returns the correct title.
	 *
	 * @covers ::present
	 */
	public function test_present() {
		$this->presentation->open_graph_article_author = 'https://facebook.com/author';

		$expected = '<meta property="article:author" content="https://facebook.com/author" />';
		$actual   = $this->instance->present();

		$this->assertEquals( $expected, $actual );
	}

	/**
	 * Tests the presenter with an empty site name.
	 *
	 * @covers ::present
	 */
	public function test_present_empty_article_author() {
		$this->presentation->open_graph_article_author = '';

		$expected = '';
		$actual   = $this->instance->present();

		$this->assertEquals( $expected, $actual );
	}

	/**
	 * Tests whether the presenter returns the correct publisher, when the `wpseo_opengraph_author_facebook` filter is applied.
	 *
	 * @covers ::present
	 * @covers ::get
	 */
	public function test_present_filter() {
		$this->presentation->open_graph_article_author = 'https://facebook.com/author';

		Monkey\Filters\expectApplied( 'wpseo_opengraph_author_facebook' )
			->once()
			->with( 'https://facebook.com/author', $this->presentation )
			->andReturn( 'https://facebook.com/newauthor' );

		$expected = '<meta property="article:author" content="https://facebook.com/newauthor" />';
		$actual   = $this->instance->present();

		$this->assertEquals( $expected, $actual );
	}
}

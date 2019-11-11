<?php

namespace Yoast\WP\Free\Tests\Presenters;

use Brain\Monkey;
use Yoast\WP\Free\Presentations\Indexable_Presentation;
use Yoast\WP\Free\Presenters\Open_Graph\Article_Author_Presenter;
use Yoast\WP\Free\Tests\TestCase;

/**
 * Class Article_Author_Presenter_Test
 *
 * @coversDefaultClass \Yoast\WP\Free\Presenters\Open_Graph\Article_Author_Presenter
 *
 * @group presenters
 * @group opengraph
 */
class Article_Author_Presenter_Test extends TestCase {

	/**
	 * @var Article_Author_Presenter
	 */
	protected $instance;

	/**
	 * @var Indexable_Presentation
	 */
	protected $presentation;

	/**
	 * Sets up the test class.
	 */
	public function setUp() {
		$this->instance     = new Article_Author_Presenter();
		$this->presentation = new Indexable_Presentation();

		return parent::setUp();
	}

	/**
	 * Tests whether the presenter returns the correct title.
	 *
	 * @covers ::present
	 */
	public function test_present() {
		$this->presentation->og_article_author = 'https://facebook.com/author';

		$expected = '<meta property="article:author" content="https://facebook.com/author" />';
		$actual   = $this->instance->present( $this->presentation );

		$this->assertEquals( $expected, $actual );
	}

	/**
	 * Tests the presenter with an empty site name.
	 *
	 * @covers ::present
	 */
	public function test_present_empty_article_author() {
		$this->presentation->og_article_author = '';

		$expected = '';
		$actual   = $this->instance->present( $this->presentation );

		$this->assertEquals( $expected, $actual );
	}

	/**
	 * Tests whether the presenter returns the correct publisher, when the `wpseo_opengraph_author_facebook` filter is applied.
	 *
	 * @covers ::present
	 * @covers ::filter
	 */
	public function test_present_filter() {
		$this->presentation->og_article_author = 'https://facebook.com/author';

		Monkey\Filters\expectApplied( 'wpseo_opengraph_author_facebook' )
			->once()
			->with( 'https://facebook.com/author' )
			->andReturn( 'https://facebook.com/newauthor' );

		$expected = '<meta property="article:author" content="https://facebook.com/newauthor" />';
		$actual   = $this->instance->present( $this->presentation );

		$this->assertEquals( $expected, $actual );
	}
}

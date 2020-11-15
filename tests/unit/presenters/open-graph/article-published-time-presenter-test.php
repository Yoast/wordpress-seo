<?php

namespace Yoast\WP\SEO\Tests\Unit\Presenters\Open_Graph;

use Yoast\WP\SEO\Presentations\Indexable_Presentation;
use Yoast\WP\SEO\Presenters\Open_Graph\Article_Published_Time_Presenter;
use Yoast\WP\SEO\Tests\Unit\TestCase;

/**
 * Class Article_Published_Time_Presenter_Test
 *
 * @coversDefaultClass \Yoast\WP\SEO\Presenters\Open_Graph\Article_Published_Time_Presenter
 *
 * @group presenters
 * @group open-graph
 */
class Article_Published_Time_Presenter_Test extends TestCase {

	/**
	 * The article published time presenter instance.
	 *
	 * @var Article_Published_Time_Presenter
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

		$this->instance     = new Article_Published_Time_Presenter();
		$this->presentation = new Indexable_Presentation();

		$this->instance->presentation = $this->presentation;
	}

	/**
	 * Tests whether the presenter returns the correct published time tag.
	 *
	 * @covers ::present
	 */
	public function test_present() {
		$this->presentation->open_graph_article_published_time = '2019-10-08T12:26:31+00:00';

		$expected = '<meta property="article:published_time" content="2019-10-08T12:26:31+00:00" />';
		$actual   = $this->instance->present();

		$this->assertEquals( $expected, $actual );
	}

	/**
	 * Tests the presenter with an empty published time.
	 *
	 * @covers ::present
	 */
	public function test_present_empty_published_time() {
		$this->presentation->open_graph_article_published_time = '';

		$actual = $this->instance->present();

		$this->assertEmpty( $actual );
	}

	/**
	 * Tests the retrieval of the raw value.
	 *
	 * @covers ::get
	 */
	public function test_get() {
		$this->presentation->open_graph_article_published_time = '2019-10-08T12:26:31+00:00';

		$this->assertSame( '2019-10-08T12:26:31+00:00', $this->instance->get() );
	}
}

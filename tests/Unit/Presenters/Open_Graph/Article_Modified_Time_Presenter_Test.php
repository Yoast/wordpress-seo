<?php

namespace Yoast\WP\SEO\Tests\Unit\Presenters\Open_Graph;

use Brain\Monkey;
use Yoast\WP\SEO\Presentations\Indexable_Presentation;
use Yoast\WP\SEO\Presenters\Open_Graph\Article_Modified_Time_Presenter;
use Yoast\WP\SEO\Tests\Unit\TestCase;

/**
 * Class Article_Modified_Time_Presenter_Test
 *
 * @coversDefaultClass \Yoast\WP\SEO\Presenters\Open_Graph\Article_Modified_Time_Presenter
 *
 * @group presenters
 * @group open-graph
 */
final class Article_Modified_Time_Presenter_Test extends TestCase {

	/**
	 * The article modified time presenter instance.
	 *
	 * @var Article_Modified_Time_Presenter
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
	 *
	 * @return void
	 */
	protected function set_up() {
		parent::set_up();

		$this->instance     = new Article_Modified_Time_Presenter();
		$this->presentation = new Indexable_Presentation();

		$this->instance->presentation = $this->presentation;
	}

	/**
	 * Tests whether the presenter returns the correct modified time tag.
	 *
	 * @covers ::present
	 *
	 * @return void
	 */
	public function test_present() {
		$this->stubEscapeFunctions();

		$this->presentation->open_graph_article_modified_time = '2019-10-08T12:26:31+00:00';

		Monkey\Functions\expect( 'is_admin_bar_showing' )->andReturn( false );

		$expected = '<meta property="article:modified_time" content="2019-10-08T12:26:31+00:00" />';
		$actual   = $this->instance->present();

		$this->assertEquals( $expected, $actual );
	}

	/**
	 * Tests the presenter with an empty modified time.
	 *
	 * @covers ::present
	 *
	 * @return void
	 */
	public function test_present_empty_modified_time() {
		$this->presentation->open_graph_article_modified_time = '';

		$actual = $this->instance->present();

		$this->assertEmpty( $actual );
	}

	/**
	 * Tests the retrieval of the raw value.
	 *
	 * @covers ::get
	 *
	 * @return void
	 */
	public function test_get() {
		$this->presentation->open_graph_article_modified_time = '2019-10-08T12:26:31+00:00';

		$this->assertSame( '2019-10-08T12:26:31+00:00', $this->instance->get() );
	}

	/**
	 * Tests whether the presenter returns the correct modified time tag when the admin bar is showing a class is added.
	 *
	 * @covers ::present
	 *
	 * @return void
	 */
	public function test_present_with_class() {
		$this->stubEscapeFunctions();

		$this->presentation->open_graph_article_modified_time = '2019-10-08T12:26:31+00:00';

		Monkey\Functions\expect( 'is_admin_bar_showing' )->andReturn( true );

		$expected = '<meta property="article:modified_time" content="2019-10-08T12:26:31+00:00" class="yoast-seo-meta-tag" />';
		$actual   = $this->instance->present();

		$this->assertEquals( $expected, $actual );
	}
}

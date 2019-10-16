<?php

namespace Yoast\WP\Free\Tests\Presenters;

use Yoast\WP\Free\Presentations\Indexable_Presentation;
use Yoast\WP\Free\Presenters\Open_Graph\Article_Modified_Time_Presenter;
use Yoast\WP\Free\Tests\TestCase;

/**
 * Class Article_Modified_Time_Presenter_Test
 *
 * @coversDefaultClass \Yoast\WP\Free\Presenters\Open_Graph\Article_Modified_Time_Presenter
 *
 * @group presenters
 * @group open-graph
 * @group testing
 */
class Article_Modified_Time_Presenter_Test extends TestCase {

	/**
	 * @var Article_Modified_Time_Presenter
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
		$this->instance     = new Article_Modified_Time_Presenter();
		$this->presentation = new Indexable_Presentation();


		return parent::setUp();
	}

	/**
	 * Tests whether the presenter returns the correct title.
	 *
	 * @covers ::present
	 */
	public function test_present() {
		$this->presentation->og_article_modified_time = '2019-10-08T12:26:31+00:00';

		$expected = '<meta property="article:modified_time" content="2019-10-08T12:26:31+00:00" />';
		$actual   = $this->instance->present( $this->presentation );

		$this->assertEquals( $expected, $actual );
	}

	/**
	 * Tests the presenter with an empty published tiem.
	 *
	 * @covers ::present
	 */
	public function test_present_empty_published_time() {
		$this->presentation->og_article_modified_time = '';

		$actual   = $this->instance->present( $this->presentation );

		$this->assertEmpty( $actual );
	}
}

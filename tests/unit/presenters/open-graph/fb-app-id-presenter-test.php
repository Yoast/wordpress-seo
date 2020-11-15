<?php

namespace Yoast\WP\SEO\Tests\Unit\Presenters\Open_Graph;

use Yoast\WP\SEO\Presentations\Indexable_Presentation;
use Yoast\WP\SEO\Presenters\Open_Graph\FB_App_ID_Presenter;
use Yoast\WP\SEO\Tests\Unit\TestCase;

/**
 * Class FB_App_ID_Presenter_Test
 *
 * @coversDefaultClass \Yoast\WP\SEO\Presenters\Open_Graph\FB_App_ID_Presenter
 *
 * @group presenters
 * @group open-graph
 */
class FB_App_ID_Presenter_Test extends TestCase {

	/**
	 * The FB app ID presenter instance.
	 *
	 * @var FB_App_ID_Presenter
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

		$this->instance     = new FB_App_ID_Presenter();
		$this->presentation = new Indexable_Presentation();

		$this->instance->presentation = $this->presentation;
	}

	/**
	 * Tests whether the presenter returns the correct FB app ID tag.
	 *
	 * @covers ::present
	 */
	public function test_present() {
		$this->stubEscapeFunctions();

		$this->presentation->open_graph_fb_app_id = '12345';

		$expected = '<meta property="fb:app_id" content="12345" />';
		$actual   = $this->instance->present();

		$this->assertEquals( $expected, $actual );
	}

	/**
	 * Tests the presenter with an empty FB app ID.
	 *
	 * @covers ::present
	 */
	public function test_present_empty_fb_app_id() {
		$this->presentation->open_graph_fb_app_id = '';

		$actual = $this->instance->present();

		$this->assertEmpty( $actual );
	}

	/**
	 * Tests the retrieval of the raw value.
	 *
	 * @covers ::get
	 */
	public function test_get() {
		$this->presentation->open_graph_fb_app_id = '12345';

		$this->assertSame( '12345', $this->instance->get() );
	}
}

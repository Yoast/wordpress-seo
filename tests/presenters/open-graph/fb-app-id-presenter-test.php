<?php

namespace Yoast\WP\Free\Tests\Presenters;

use Yoast\WP\Free\Presentations\Indexable_Presentation;
use Yoast\WP\Free\Presenters\Open_Graph\FB_App_ID_Presenter;
use Yoast\WP\Free\Tests\TestCase;

/**
 * Class FB_App_ID_Presenter_Test
 *
 * @coversDefaultClass \Yoast\WP\Free\Presenters\Open_Graph\FB_App_ID_Presenter
 *
 * @group presentations2
 * @group opengraph
 */
class FB_App_ID_Presenter_Test extends TestCase {

	/**
	 * @var FB_App_ID_Presenter
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
		$this->instance     = new FB_App_ID_Presenter();
		$this->presentation = new Indexable_Presentation();

		return parent::setUp();
	}

	/**
	 * Tests whether the presenter returns the correct FB app ID tag.
	 *
	 * @covers ::present
	 */
	public function test_present() {
		$this->presentation->og_fb_app_id = '12345';

		$expected = '<meta property="fb:app_id" content="12345" />';
		$actual   = $this->instance->present( $this->presentation );

		$this->assertEquals( $expected, $actual );
	}

	/**
	 * Tests the presenter with an empty FB app ID.
	 *
	 * @covers ::present
	 */
	public function test_present_empty_fb_app_id() {
		$this->presentation->og_fb_app_id = '';

		$actual = $this->instance->present( $this->presentation );

		$this->assertEmpty( $actual );
	}
}

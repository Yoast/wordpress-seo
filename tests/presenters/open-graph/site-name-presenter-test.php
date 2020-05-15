<?php

namespace Yoast\WP\SEO\Tests\Presenters\Open_Graph;

use Brain\Monkey;
use Yoast\WP\SEO\Presentations\Indexable_Presentation;
use Yoast\WP\SEO\Presenters\Open_Graph\Site_Name_Presenter;
use Yoast\WP\SEO\Tests\TestCase;

/**
 * Class Site_Name_Presenter_Test
 *
 * @coversDefaultClass \Yoast\WP\SEO\Presenters\Open_Graph\Site_Name_Presenter
 *
 * @group presenters
 * @group open-graph
 */
class Site_Name_Presenter_Test extends TestCase {

	/**
	 * The site name presenter instance.
	 *
	 * @var Site_Name_Presenter
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
		$this->instance     = new Site_Name_Presenter();
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
		$this->presentation->open_graph_site_name = 'My Site';

		$expected = '<meta property="og:site_name" content="My Site" />';
		$actual   = $this->instance->present();

		$this->assertEquals( $expected, $actual );
	}

	/**
	 * Tests the presenter with an empty site name.
	 *
	 * @covers ::present
	 */
	public function test_present_empty_site_name() {
		$this->presentation->open_graph_site_name = '';

		$expected = '';
		$actual   = $this->instance->present();

		$this->assertEquals( $expected, $actual );
	}

	/**
	 * Tests whether the presenter returns the correct title, when the `wpseo_title` filter is applied.
	 *
	 * @covers ::present
	 * @covers ::filter
	 */
	public function test_present_filter() {
		$this->presentation->open_graph_site_name = 'My Site';

		Monkey\Filters\expectApplied( 'wpseo_opengraph_site_name' )
			->once()
			->with( 'My Site', $this->presentation )
			->andReturn( 'My Site' );

		$expected = '<meta property="og:site_name" content="My Site" />';
		$actual   = $this->instance->present();

		$this->assertEquals( $expected, $actual );
	}
}

<?php

namespace Yoast\WP\SEO\Tests\Unit\Presenters\Open_Graph;

use Brain\Monkey;
use Yoast\WP\SEO\Presentations\Indexable_Presentation;
use Yoast\WP\SEO\Presenters\Open_Graph\Locale_Presenter;
use Yoast\WP\SEO\Tests\Unit\TestCase;

/**
 * Class Locale_Presenter_Test
 *
 * @coversDefaultClass \Yoast\WP\SEO\Presenters\Open_Graph\Locale_Presenter
 *
 * @group presenters
 * @group open-graph
 */
class Locale_Presenter_Test extends TestCase {

	/**
	 * The locale presenter instance.
	 *
	 * @var Locale_Presenter
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

		$this->instance     = new Locale_Presenter();
		$this->presentation = new Indexable_Presentation();

		$this->instance->presentation = $this->presentation;
	}

	/**
	 * Tests whether the presenter returns the correct locale.
	 *
	 * @covers ::present
	 */
	public function test_present() {
		$this->presentation->open_graph_locale = 'nl_BE';

		Monkey\Functions\expect( 'is_admin_bar_showing' )->andReturn( false );

		$expected = '<meta property="og:locale" content="nl_BE" />';
		$actual   = $this->instance->present();

		$this->assertEquals( $expected, $actual );
	}

	/**
	 * Tests whether the presenter returns the correct locale, when the `wpseo_og_locale` filter is applied.
	 *
	 * @covers ::present
	 * @covers ::get
	 */
	public function test_present_filter() {
		$this->presentation->open_graph_locale = 'nl_BE';

		Monkey\Filters\expectApplied( 'wpseo_og_locale' )
			->once()
			->with( 'nl_BE', $this->presentation )
			->andReturn( 'nl_BE' );
		Monkey\Functions\expect( 'is_admin_bar_showing' )->andReturn( false );

		$expected = '<meta property="og:locale" content="nl_BE" />';
		$actual   = $this->instance->present();

		$this->assertEquals( $expected, $actual );
	}

	/**
	 * Tests whether the presenter returns the correct locale when the admin bar is showing a class is added.
	 *
	 * @covers ::present
	 */
	public function test_present_with_class() {
		$this->presentation->open_graph_locale = 'nl_BE';

		Monkey\Functions\expect( 'is_admin_bar_showing' )->andReturn( true );

		$expected = '<meta property="og:locale" content="nl_BE" class="yoast-seo-meta-tag" />';
		$actual   = $this->instance->present();

		$this->assertEquals( $expected, $actual );
	}
}

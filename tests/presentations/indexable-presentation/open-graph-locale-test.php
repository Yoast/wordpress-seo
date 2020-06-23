<?php

namespace Yoast\WP\SEO\Tests\Presentations\Indexable_Presentation;

use Brain\Monkey;
use Yoast\WP\SEO\Tests\TestCase;

/**
 * Class Open_Graph_Locale_Test
 *
 * @coversDefaultClass \Yoast\WP\SEO\Presentations\Indexable_Presentation
 *
 * @group presentations
 * @group open-graph
 */
class Open_Graph_Locale_Test extends TestCase {
	use Presentation_Instance_Builder;

	/**
	 * Sets up the test class.
	 */
	public function setUp() {
		parent::setUp();

		$this->set_instance();
	}

	/**
	 * Tests whether the locale is returned.
	 *
	 * @covers ::generate_open_graph_locale
	 */
	public function test_generate_open_graph_locale() {
		Monkey\Functions\expect( 'get_locale' )
			->andReturn( 'en_US' );

		$this->assertEquals( 'en_US', $this->instance->generate_open_graph_locale() );
	}

	/**
	 * Tests whether the wpseo_locale filter is applied.
	 *
	 * @covers ::generate_open_graph_locale
	 */
	public function test_generate_open_graph_locale_with_filter() {
		Monkey\Functions\expect( 'get_locale' )
			->once()
			->andReturn( 'en_US' );

		Monkey\Functions\expect( 'apply_filters' )
			->once()
			->andReturn( 'en_GB' );

		$this->assertEquals( 'en_GB', $this->instance->generate_open_graph_locale() );
	}

	/**
	 * Tests whether the locale is returned after fixing the locale.
	 *
	 * @covers ::generate_open_graph_locale
	 */
	public function test_generate_open_graph_locale_when_fix_locales_is_set() {
		Monkey\Functions\expect( 'get_locale' )
			->andReturn( 'uk' );

		$this->assertEquals( 'uk_UA', $this->instance->generate_open_graph_locale() );
	}

	/**
	 * Tests whether the locale is returned after it is converted.
	 *
	 * @covers ::generate_open_graph_locale
	 */
	public function test_generate_open_graph_locale_when_converting() {
		Monkey\Functions\expect( 'get_locale' )
			->andReturn( 'es' );

		$this->assertEquals( 'es_ES', $this->instance->generate_open_graph_locale() );
	}

	/**
	 * Tests whether en_US is used as a fallback.
	 *
	 * @covers ::generate_open_graph_locale
	 */
	public function test_generate_open_graph_locale_with_fallback() {
		Monkey\Functions\expect( 'get_locale' )
			->andReturn( 'xx' );

		$this->assertEquals( 'en_US', $this->instance->generate_open_graph_locale() );
	}
}

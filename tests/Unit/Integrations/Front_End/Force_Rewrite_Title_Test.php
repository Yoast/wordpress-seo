<?php

namespace Yoast\WP\SEO\Tests\Unit\Integrations\Front_End;

use Brain\Monkey;
use Mockery;
use Yoast\WP\SEO\Conditionals\Front_End_Conditional;
use Yoast\WP\SEO\Helpers\Options_Helper;
use Yoast\WP\SEO\Integrations\Front_End\Force_Rewrite_Title;
use Yoast\WP\SEO\Tests\Unit\TestCase;
use Yoast\WP\SEO\Wrappers\WP_Query_Wrapper;

/**
 * Class Force_Rewrite_Title_Test.
 *
 * @coversDefaultClass \Yoast\WP\SEO\Integrations\Front_End\Force_Rewrite_Title
 *
 * @group integrations
 * @group front-end
 */
final class Force_Rewrite_Title_Test extends TestCase {

	/**
	 * The options helper.
	 *
	 * @var Mockery\MockInterface|Options_Helper
	 */
	private $options;

	/**
	 * The wp query wrapper.
	 *
	 * @var Mockery\MockInterface|WP_Query_Wrapper
	 */
	private $wp_query;

	/**
	 * The instance to test.
	 *
	 * @var Force_Rewrite_Title
	 */
	private $instance;

	/**
	 * Sets an instance for test purposes.
	 *
	 * @return void
	 */
	protected function set_up() {
		parent::set_up();

		$this->options  = Mockery::mock( Options_Helper::class );
		$this->wp_query = Mockery::mock( WP_Query_Wrapper::class );
		$this->instance = Mockery::mock( Force_Rewrite_Title::class, [ $this->options, $this->wp_query ] )
			->makePartial()
			->shouldAllowMockingProtectedMethods();
	}

	/**
	 * Tests if the expected conditionals are in place.
	 *
	 * @covers ::get_conditionals
	 *
	 * @return void
	 */
	public function test_get_conditionals() {
		$this->assertEquals(
			[ Front_End_Conditional::class ],
			Force_Rewrite_Title::get_conditionals()
		);
	}

	/**
	 * Tests flushing of the output buffer where the buffering isn't started yet.
	 *
	 * @covers ::flush_cache
	 *
	 * @return void
	 */
	public function test_flush_cache_where_buffering_is_not_started() {
		$this->assertFalse( $this->instance->flush_cache() );
	}

	/**
	 * Tests flushing of the output buffer with no debug markers set.
	 *
	 * @covers ::flush_cache
	 *
	 * @return void
	 */
	public function test_flush_cache_where_buffering_with_no_matched_debug_markers() {
		$this->instance->force_rewrite_output_buffer();

		$this->wp_query
			->expects( 'get_query' )
			->once()
			->andReturn( [] );

		Monkey\Functions\expect( 'wp_reset_query' )->once()->andReturnNull();

		$this->assertTrue( $this->instance->flush_cache() );
	}

	/**
	 * Tests flushing of the output buffer with replacing the titles before the debug marker.
	 *
	 * @covers ::flush_cache
	 * @covers ::replace_titles_from_content
	 * @covers ::replace_title
	 *
	 * @return void
	 */
	public function test_flush_cache_with_replacing_the_titles_before() {
		$this->instance
			->expects( 'start_output_buffering' )
			->once()
			->andReturnNull();
		$this->instance->force_rewrite_output_buffer();

		$this->wp_query
			->expects( 'get_query' )
			->once()
			->andReturn( [] );

		$output  = '<title>This is a before title</title>';
		$output .= '<!-- This site is optimized with the Yoast SEO plugin v1.0 -->';
		$output .= '<meta rel="yoast" value="meta" />';
		$output .= '<!-- / Yoast SEO plugin. -->';

		$this->instance
			->expects( 'get_buffered_output' )
			->once()
			->andReturn( $output );

		Monkey\Functions\expect( 'wp_reset_query' )
			->once()
			->andReturnNull();

		$expected_output  = '<!-- This site is optimized with the Yoast SEO plugin v1.0 -->';
		$expected_output .= '<meta rel="yoast" value="meta" />';
		$expected_output .= '<!-- / Yoast SEO plugin. -->';

		$this->instance->flush_cache();

		$this->expectOutputString( $expected_output );
	}

	/**
	 * Tests flushing of the output buffer with replacing the titles after the debug marker.
	 *
	 * @covers ::flush_cache
	 * @covers ::replace_titles_from_content
	 * @covers ::replace_title
	 *
	 * @return void
	 */
	public function test_flush_cache_with_replacing_the_titles_after() {
		$this->instance
			->expects( 'start_output_buffering' )
			->once()
			->andReturnNull();
		$this->instance->force_rewrite_output_buffer();

		$this->wp_query
			->expects( 'get_query' )
			->once()
			->andReturn( [] );

		$output  = '<!-- This site is optimized with the Yoast SEO plugin v1.0 -->';
		$output .= '<meta rel="yoast" value="meta" />';
		$output .= '<!-- / Yoast SEO plugin. -->';
		$output .= '<title>This is an after title</title>';

		$this->instance
			->expects( 'get_buffered_output' )
			->once()
			->andReturn( $output );

		Monkey\Functions\expect( 'wp_reset_query' )
			->once()
			->andReturnNull();

		$this->instance->flush_cache();

		$expected_output  = '<!-- This site is optimized with the Yoast SEO plugin v1.0 -->';
		$expected_output .= '<meta rel="yoast" value="meta" />';
		$expected_output .= '<!-- / Yoast SEO plugin. -->';

		$this->expectOutputString( $expected_output );
	}

	/**
	 * Tests flushing of the output buffer with replacing the titles outside of the debug marker.
	 *
	 * @covers ::flush_cache
	 * @covers ::replace_titles_from_content
	 * @covers ::replace_title
	 *
	 * @return void
	 */
	public function test_flush_cache_with_replacing_the_titles_everywhere() {
		$this->instance
			->expects( 'start_output_buffering' )
			->once()
			->andReturnNull();
		$this->instance->force_rewrite_output_buffer();

		$this->wp_query
			->expects( 'get_query' )
			->once()
			->andReturn( [] );

		$output  = '<title>This is a before title</title>';
		$output .= '<!-- This site is optimized with the Yoast SEO plugin v1.0 -->';
		$output .= '<meta rel="yoast" value="meta" />';
		$output .= '<!-- / Yoast SEO plugin. -->';
		$output .= '<title>This is an after title</title>';

		$this->instance
			->expects( 'get_buffered_output' )
			->once()
			->andReturn( $output );

		Monkey\Functions\expect( 'wp_reset_query' )
			->once()
			->andReturnNull();

		$this->instance->flush_cache();

		$expected_output  = '<!-- This site is optimized with the Yoast SEO plugin v1.0 -->';
		$expected_output .= '<meta rel="yoast" value="meta" />';
		$expected_output .= '<!-- / Yoast SEO plugin. -->';

		$this->expectOutputString( $expected_output );
	}

	/**
	 * Tests if the output buffering is started.
	 *
	 * @covers ::force_rewrite_output_buffer
	 *
	 * @return void
	 */
	public function test_force_rewrite_output_buffer() {
		$this->instance
			->expects( 'start_output_buffering' )
			->once()
			->andReturnNull();

		$this->instance->force_rewrite_output_buffer();
	}
}

<?php

namespace Yoast\WP\SEO\Tests\Unit\Integrations\Third_Party;

use Brain\Monkey;
use Mockery;
use Yoast\WP\SEO\Conditionals\Web_Stories_Conditional;
use Yoast\WP\SEO\Integrations\Front_End_Integration;
use Yoast\WP\SEO\Integrations\Third_Party\Web_Stories;
use Yoast\WP\SEO\Tests\Unit\TestCase;

class Story_Post_Type_Stub {
	const POST_TYPE_SLUG = 'web-story';
}

/**
 * Web Stories integration test.
 *
 * @coversDefaultClass \Yoast\WP\SEO\Integrations\Third_Party\Web_Stories
 * @covers ::<!public>
 *
 * @group integrations
 * @group third-party
 */
class Web_Stories_Test extends TestCase {

	/**
	 * The Web Stories integration.
	 *
	 * @var Web_Stories
	 */
	protected $instance;

	/**
	 * The front end integration.
	 *
	 * @var Front_End_Integration
	 */
	protected $front_end;

	/**
	 * Sets an instance for test purposes.
	 */
	public function setUp() {
		parent::setUp();

		$this->front_end = Mockery::mock( Front_End_Integration::class );
		$this->instance  = new Web_Stories( $this->front_end );
	}

	/**
	 * Tests if the expected conditionals are in place.
	 *
	 * @covers ::get_conditionals
	 */
	public function test_get_conditionals() {
		$this->assertEquals(
			[ Web_Stories_Conditional::class ],
			Web_Stories::get_conditionals()
		);
	}

	/**
	 * Tests register hooks.
	 *
	 * @covers ::register_hooks
	 */
	public function test_register_hooks() {
		$this->instance->register_hooks();

		$this->assertNotFalse( \has_action( 'web_stories_story_head', [ $this->instance, 'remove_web_stories_meta_output' ] ), 'The remove Web Stories meta output function is registered.' );
		$this->assertNotFalse( \has_action( 'web_stories_story_head', [ $this->front_end, 'call_wpseo_head' ] ), 'The wpseo head action is registered.' );
		$this->assertNotFalse( \has_filter( 'wpseo_schema_article_post_types', [ $this->instance, 'filter_schema_article_post_types' ] ), 'The filter schema article post types function is registered.' );
		$this->assertNotFalse( \has_action( 'admin_enqueue_scripts', [ $this->instance, 'dequeue_admin_assets' ] ), 'The admin_enqueue_scripts action is registered.' );
	}

	/**
	 * Tests remove web stories meta output.
	 *
	 * @covers ::remove_web_stories_meta_output
	 */
	public function test_remove_web_stories_meta_output() {
		$instance = Mockery::mock( '\Google\Web_Stories\Discovery' );
		Monkey\Functions\expect( '\Google\Web_Stories\get_plugin_instance' )
			->once()
			->andReturn( (object) [ 'discovery' => $instance ] );

		\add_action( 'web_stories_story_head', [ $instance, 'print_metadata' ] );
		\add_action( 'web_stories_story_head', [ $instance, 'print_schemaorg_metadata' ] );
		\add_action( 'web_stories_story_head', [ $instance, 'print_open_graph_metadata' ] );
		\add_action( 'web_stories_story_head', [ $instance, 'print_twitter_metadata' ] );
		\add_action( 'web_stories_story_head', 'rel_canonical' );

		$this->instance->remove_web_stories_meta_output();

		$this->assertFalse( \has_action( 'web_stories_story_head', [ $instance, 'print_metadata' ] ), 'The Web Stories print metadata action is not registered' );
		$this->assertFalse( \has_action( 'web_stories_story_head', [ $instance, 'print_schemaorg_metadata' ] ), 'The Web Stories print schema metadata action is not registered' );
		$this->assertFalse( \has_action( 'web_stories_story_head', [ $instance, 'print_open_graph_metadata' ] ), 'The Web Stories print open graph metadata action is not registered' );
		$this->assertFalse( \has_action( 'web_stories_story_head', [ $instance, 'print_twitter_metadata' ] ), 'The Web Stories print twitter metadata action is not registered' );
		$this->assertFalse( \has_action( 'web_stories_story_head', 'rel_canonical' ), 'The rel canonical action is not registered' );
	}

	/**
	 * Tests dequeue admin assets
	 *
	 * @covers ::dequeue_admin_assets
	 */
	public function test_dequeue_admin_assets() {
		$current_screen            = Mockery::mock( '\WP_Screen' );
		$current_screen->base      = 'foo';
		$current_screen->post_type = 'bar';

		Monkey\Functions\expect( '\get_current_screen' )
			->once()
			->andReturn( $current_screen );

		Mockery::namedMock( '\Google\Web_Stories\Story_Post_Type', Story_Post_Type_Stub::class );

		Monkey\Functions\expect( '\wp_dequeue_script' )
			->never();
		Monkey\Functions\expect( '\wp_dequeue_style' )
			->never();

		$this->instance->dequeue_admin_assets();
	}

	/**
	 * Tests dequeue admin assets
	 *
	 * @covers ::dequeue_admin_assets
	 */
	public function test_dequeue_admin_assets_with_screen() {
		$current_screen            = Mockery::mock( '\WP_Screen' );
		$current_screen->base      = 'post';
		$current_screen->post_type = 'web-story';

		Monkey\Functions\expect( '\get_current_screen' )
			->once()
			->andReturn( $current_screen );

		Mockery::namedMock( '\Google\Web_Stories\Story_Post_Type', Story_Post_Type_Stub::class );

		Monkey\Functions\expect( '\wp_dequeue_script' )
			->times( 4 );
		Monkey\Functions\expect( '\wp_dequeue_style' )
			->times( 8 );

		$this->instance->dequeue_admin_assets();
	}

	/**
	 * Tests filter schema article post types.
	 *
	 * @covers ::filter_schema_article_post_types
	 */
	public function test_filter_schema_article_post_types() {
		Mockery::namedMock( '\Google\Web_Stories\Story_Post_Type', Story_Post_Type_Stub::class );

		$actual = $this->instance->filter_schema_article_post_types( [ 'post' ] );
		$this->assertEquals( [ 'post', 'web-story' ], $actual );
	}
}

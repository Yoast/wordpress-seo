<?php

namespace Yoast\WP\SEO\Tests\Unit\Integrations\Front_End;

use Brain\Monkey;
use Mockery;
use Yoast\WP\SEO\Conditionals\Front_End_Conditional;
use Yoast\WP\SEO\Helpers\Options_Helper;
use Yoast\WP\SEO\Integrations\Front_End\RSS_Footer_Embed;
use Yoast\WP\SEO\Tests\Unit\TestCase;

/**
 * Class RSS_Footer_Embed_Test.
 *
 * @coversDefaultClass \Yoast\WP\SEO\Integrations\Front_End\RSS_Footer_Embed
 *
 * @group integrations
 * @group front-end
 */
class RSS_Footer_Embed_Test extends TestCase {

	/**
	 * The instance to test against.
	 *
	 * @var Mockery\MockInterface|RSS_Footer_Embed
	 */
	protected $instance;

	/**
	 * The options helper.
	 *
	 * @var Mockery\MockInterface|Options_Helper
	 */
	protected $options;

	/**
	 * Setup the class instance.
	 */
	protected function set_up() {
		parent::set_up();

		$this->options  = Mockery::mock( Options_Helper::class );
		$this->instance = Mockery::mock( RSS_Footer_Embed::class, [ $this->options ] )
			->makePartial()
			->shouldAllowMockingProtectedMethods();
	}

	/**
	 * Tests if the expected conditionals are in place.
	 *
	 * @covers ::get_conditionals
	 */
	public function test_get_conditionals() {
		$this->assertEquals(
			[ Front_End_Conditional::class ],
			RSS_Footer_Embed::get_conditionals()
		);
	}

	/**
	 * Tests if the expected hooks are registered.
	 *
	 * @covers ::register_hooks
	 */
	public function test_register_hooks() {
		$this->instance->register_hooks();

		$this->assertNotFalse( Monkey\Filters\has( 'the_content_feed', [ $this->instance, 'embed_rssfooter' ] ) );
		$this->assertNotFalse( Monkey\Filters\has( 'the_excerpt_rss', [ $this->instance, 'embed_rssfooter_excerpt' ] ) );
	}

	/**
	 * Tests embedding of the RSS footer when not on a feed page.
	 *
	 * @covers ::embed_rssfooter
	 * @covers ::include_rss_footer
	 */
	public function test_embed_rssfooter_not_on_feed_page() {
		Monkey\Functions\expect( 'is_feed' )->andReturn( false );

		$this->assertEquals(
			'Not on feed page',
			$this->instance->embed_rssfooter( 'Not on feed page' )
		);
	}

	/**
	 * Tests embedding the RSS footer when disabled by filter.
	 *
	 * @covers ::embed_rssfooter
	 * @covers ::include_rss_footer
	 */
	public function test_embed_rssfooter_disabled_by_filter() {
		Monkey\Functions\expect( 'is_feed' )->andReturn( true );
		Monkey\Filters\expectApplied( 'wpseo_include_rss_footer' )
			->with( true, 'full' )
			->once()
			->andReturn( false );

		$this->assertEquals(
			'Disabled feature by filter.',
			$this->instance->embed_rssfooter( 'Disabled feature by filter.' )
		);
	}

	/**
	 * Tests embedding of the RSS footer when no options for it are set.
	 *
	 * @covers ::embed_rssfooter
	 * @covers ::include_rss_footer
	 * @covers ::is_configured
	 */
	public function test_embed_rss_footer_with_no_set_option_values() {
		Monkey\Functions\expect( 'is_feed' )->andReturn( true );
		Monkey\Filters\expectApplied( 'wpseo_include_rss_footer' )
			->with( true, 'full' )
			->once()
			->andReturn( true );

		$this->options->expects( 'get' )->with( 'rssbefore', '' )->once()->andReturn( '' );
		$this->options->expects( 'get' )->with( 'rssafter', '' )->once()->andReturn( '' );

		$this->assertEquals(
			'No options set',
			$this->instance->embed_rssfooter( 'No options set' )
		);
	}

	/**
	 * Tests the embedding of the RSS footer the happy path.
	 *
	 * @covers ::embed_rssfooter
	 * @covers ::rss_replace_vars
	 * @covers ::get_link_template
	 */
	public function test_embed_rss_footer() {
		$post = (object) [ 'post_author' => 'Yoast' ];

		Monkey\Functions\expect( 'get_post' )->andReturn( $post );
		Monkey\Functions\when( 'wpautop' )->returnArg( 1 );
		Monkey\Filters\expectApplied( 'nofollow_rss_links' )
			->with( true )
			->once()
			->andReturn( false );

		$this->instance->expects( 'include_rss_footer' )->once()->andReturnTrue();
		$this->instance
			->expects( 'get_replace_vars' )
			->with( '<a href="%1$s">%2$s</a>', $post )
			->once()
			->andReturn(
				[
					'%%AUTHORLINK%%'   => '<a href="#">author_link</a>',
					'%%POSTLINK%%'     => 'post_link',
					'%%BLOGLINK%%'     => 'blog_link',
					'%%BLOGDESCLINK%%' => 'blog_description_link',
				]
			);

		$this->options->expects( 'get' )->with( 'rssbefore', '' )->once()->andReturn( '%%authorlink%%' );
		$this->options->expects( 'get' )->with( 'rssafter', '' )->once()->andReturn( '' );

		$this->assertEquals(
			'<a href="#">author_link</a>No options set',
			$this->instance->embed_rssfooter( 'No options set' )
		);
	}

	/**
	 * Tests the embedding of the RSS footer excerpt with disabled feature.
	 *
	 * @covers ::embed_rssfooter_excerpt
	 */
	public function test_embed_rss_footer_excerpt_is_disabled() {
		$this->instance->expects( 'include_rss_footer' )->once()->andReturnFalse();

		$this->assertEquals(
			'Feature is disabled',
			$this->instance->embed_rssfooter_excerpt( 'Feature is disabled' )
		);
	}

	/**
	 * Tests the embedding of the RSS footer excerpt the happy path.
	 *
	 * @covers ::embed_rssfooter_excerpt
	 * @covers ::get_link_template
	 * @covers ::rss_replace_vars
	 */
	public function test_embed_rss_footer_excerpt() {
		$post = (object) [ 'post_author' => 'Yoast' ];

		Monkey\Functions\expect( 'get_post' )->andReturn( $post );
		Monkey\Functions\when( 'wpautop' )->returnArg( 1 );
		Monkey\Filters\expectApplied( 'nofollow_rss_links' )
			->with( true )
			->once()
			->andReturn( true );

		$this->instance
			->expects( 'include_rss_footer' )
			->once()
			->andReturnTrue();

		$this->instance
			->expects( 'get_replace_vars' )
			->with( '<a rel="nofollow" href="%1$s">%2$s</a>', $post )
			->once()
			->andReturn(
				[
					'%%AUTHORLINK%%'   => '<a rel="nofollow" href="#">author_link</a>',
					'%%POSTLINK%%'     => 'post_link',
					'%%BLOGLINK%%'     => 'blog_link',
					'%%BLOGDESCLINK%%' => 'blog_description_link',
				]
			);

		$this->options->expects( 'get' )->with( 'rssbefore', '' )->once()->andReturn( '%%authorlink%%' );
		$this->options->expects( 'get' )->with( 'rssafter', '' )->once()->andReturn( '' );

		$this->assertEquals(
			'<a rel="nofollow" href="#">author_link</a>No options set',
			$this->instance->embed_rssfooter_excerpt( 'No options set' )
		);
	}
}

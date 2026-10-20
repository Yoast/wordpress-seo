<?php

// phpcs:disable Yoast.NamingConventions.NamespaceName.TooLong -- Needed in the folder structure.
namespace Yoast\WP\SEO\Tests\Unit\Abilities\Infrastructure\Template_Targets;

use Brain\Monkey;
use Mockery;
use WP_Rewrite;
use Yoast\WP\SEO\Abilities\Infrastructure\Template_Targets\Search_Page_Template_Target;
use Yoast\WP\SEO\Tests\Unit\TestCase;

/**
 * Tests the Search_Page_Template_Target class.
 *
 * @group abilities
 *
 * @coversDefaultClass \Yoast\WP\SEO\Abilities\Infrastructure\Template_Targets\Search_Page_Template_Target
 */
final class Search_Page_Template_Target_Test extends TestCase {

	/**
	 * Tears down the test fixtures.
	 *
	 * @return void
	 */
	protected function tear_down() {
		unset( $GLOBALS['wp_rewrite'] );

		parent::tear_down();
	}

	/**
	 * Tests the name, sharing and URL pattern of the search results pages.
	 *
	 * @covers ::get_name
	 * @covers ::is_shared
	 * @covers ::get_url
	 *
	 * @return void
	 */
	public function test_target() {
		$wp_rewrite = Mockery::mock( WP_Rewrite::class );
		$wp_rewrite->expects( 'get_search_permastruct' )->once()->andReturn( '/search/%search%' );

		$GLOBALS['wp_rewrite'] = $wp_rewrite;

		Monkey\Functions\expect( 'user_trailingslashit' )->once()->andReturnFirstArg();
		Monkey\Functions\expect( 'home_url' )->once()->with( '/search/%search%' )->andReturn( 'https://example.com/search/%search%' );

		$instance = new Search_Page_Template_Target();

		$this->assertSame( 'search_page', $instance->get_name() );
		$this->assertTrue( $instance->is_shared() );
		$this->assertSame( 'https://example.com/search/%search%', $instance->get_url() );
	}
}

<?php

namespace Yoast\WP\SEO\Tests\Unit\Integrations\Front_End;

use Brain\Monkey;
use Generator;
use Mockery;
use WP_Query;
use Yoast\WP\SEO\Conditionals\Front_End_Conditional;
use Yoast\WP\SEO\Helpers\Options_Helper;
use Yoast\WP\SEO\Helpers\Redirect_Helper;
use Yoast\WP\SEO\Integrations\Front_End\Crawl_Cleanup_Searches;
use Yoast\WP\SEO\Tests\Unit\TestCase;

/**
 * Class Crawl_Cleanup_Searches_Test.
 *
 * @coversDefaultClass \Yoast\WP\SEO\Integrations\Front_End\Crawl_Cleanup_Searches
 *
 * @group integrations
 * @group front-end
 */
final class Crawl_Cleanup_Searches_Test extends TestCase {

	/**
	 * Robots helper.
	 *
	 * @var Mockery\MockInterface|Options_Helper
	 */
	private $options_helper;

	/**
	 * Redirect helper.
	 *
	 * @var Mockery\MockInterface|Redirect_Helper
	 */
	private $redirect_helper;

	/**
	 * The test instance.
	 *
	 * @var Crawl_Cleanup_Searches|Mockery\MockInterface
	 */
	private $instance;

	/**
	 * Sets an instance for test purposes.
	 *
	 * @return void
	 */
	protected function set_up() {
		parent::set_up();
		$this->stubEscapeFunctions();

		$this->options_helper  = Mockery::mock( Options_Helper::class );
		$this->redirect_helper = Mockery::mock( Redirect_Helper::class );
		$this->instance        = new Crawl_Cleanup_Searches( $this->options_helper, $this->redirect_helper );
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
			Crawl_Cleanup_Searches::get_conditionals()
		);
	}

	/**
	 * Tests if the expected hooks are registered.
	 *
	 * @covers ::register_hooks
	 *
	 * @return void
	 */
	public function test_register_hooks() {
		$this->options_helper
			->expects( 'get' )
			->once()
			->with( 'search_cleanup' )
			->andReturn( true );

		$this->options_helper
			->expects( 'get' )
			->once()
			->with( 'redirect_search_pretty_urls' )
			->andReturn( true );

		Monkey\Functions\expect( 'get_option' )
			->with( 'permalink_structure' )
			->andReturn( '/%year%/%monthnum%/%postname%/' );

		$this->instance->register_hooks();

		$this->assertNotFalse( Monkey\Filters\has( 'pre_get_posts', [ $this->instance, 'validate_search' ] ) );
		$this->assertNotFalse(
			Monkey\Actions\has(
				'template_redirect',
				[
					$this->instance,
					'maybe_redirect_searches',
				]
			)
		);
	}

	/**
	 * Tests that nothing happens on a non search page.
	 *
	 * @covers ::validate_search
	 *
	 * @return void
	 */
	public function test_validate_search_not_search() {
		$query = Mockery::mock( WP_Query::class );
		$query->shouldReceive( 'is_search' )
			->andReturnFalse();

		$this->assertEquals( $query, $this->instance->validate_search( $query ) );
	}

	/**
	 * Tests if there is a redirect when there is an emoji in the search query when they are disabled.
	 *
	 * @covers ::validate_search
	 * @return void
	 */
	public function test_validate_search_has_emoji() {
		$search_query_string = 'search_query_with_😀';
		$this->options_helper
			->expects( 'get' )
			->once()
			->with( 'search_cleanup_emoji' )
			->andReturn( true );

		$this->options_helper
			->expects( 'get' )
			->once()
			->with( 'search_cleanup_patterns' )
			->andReturn( false );
		$this->options_helper
			->expects( 'get' )
			->once()
			->with( 'search_character_limit' )
			->andReturn( 200 );

		/**
		 * This check makes sure that the redirect is being called. Everything under this is just to make the function do all the other things (which will not happen in a real scenario).
		 */
		$this->redirect_helper
			->expects( 'do_safe_redirect' )
			->once()
			->with( 'home', 301, 'Yoast Search Filtering: We don\'t allow searches with emojis and other special characters.' );

		Monkey\Functions\expect( 'get_home_url' )
			->with()
			->andReturn( 'home' );

		Monkey\Functions\expect( 'get_search_query' )
			->with()
			->andReturn( $search_query_string );

		$query = Mockery::mock( WP_Query::class );
		$query->shouldReceive( 'is_search' )
			->andReturnTrue();

		$query->query_vars['s'] = $search_query_string;
		$this->assertEquals( $query, $this->instance->validate_search( $query ) );
	}

	/**
	 * Tests if there is no redirect when the string is valid.
	 *
	 * @covers ::validate_search
	 * @return void
	 */
	public function test_validate_search_valid_query() {
		$search_query_string = 'this_is_way_longer_than_the_limit';
		$this->options_helper
			->expects( 'get' )
			->once()
			->with( 'search_cleanup_emoji' )
			->andReturn( true );

		$this->options_helper
			->expects( 'get' )
			->once()
			->with( 'search_cleanup_patterns' )
			->andReturn( true );
		$this->options_helper
			->expects( 'get' )
			->once()
			->with( 'search_character_limit' )
			->andReturn( 200 );

		$this->redirect_helper
			->expects( 'do_safe_redirect' )
			->never();

		Monkey\Functions\expect( 'get_home_url' )
			->with()
			->andReturn( 'home' );

		Monkey\Functions\expect( 'get_search_query' )
			->with()
			->andReturn( $search_query_string );

		$query = Mockery::mock( WP_Query::class );
		$query->shouldReceive( 'is_search' )
			->andReturnTrue();

		$query->query_vars['s'] = $search_query_string;
		$this->assertEquals( $query, $this->instance->validate_search( $query ) );
	}

	/**
	 * Tests whether the function do_safe_redirect gets the proper URL to redirect to.
	 *
	 * @covers ::validate_search
	 *
	 * @dataProvider provide_query_string_parameters
	 *
	 * @param string $input_query_string  The input query string to a user wants to search for.
	 * @param string $output_query_string The input query string that we redirect to.
	 * @param int    $limit               The max character length.
	 *
	 * @return void
	 */
	public function test_validate_search_over_character_limit( $input_query_string, $output_query_string, $limit ) {
		$this->options_helper
			->expects( 'get' )
			->once()
			->with( 'search_cleanup_emoji' )
			->andReturn( false );

		$this->options_helper
			->expects( 'get' )
			->once()
			->with( 'search_cleanup_patterns' )
			->andReturn( false );
		$this->options_helper
			->expects( 'get' )
			->twice()
			->with( 'search_character_limit' )
			->andReturn( $limit );

		Monkey\Functions\expect( 'get_home_url' )
			->with()
			->andReturn( 'home' );

		Monkey\Functions\expect( 'get_search_query' )
			->with()
			->andReturn( $input_query_string );

		Monkey\Functions\expect( 'set_query_var' )
			->with( 's', $output_query_string )
			->andReturn( $input_query_string );

		$query = Mockery::mock( WP_Query::class );
		$query->shouldReceive( 'is_search' )
			->andReturnTrue();

		$query->query_vars['s'] = $input_query_string;
		$this->assertEquals( $query, $this->instance->validate_search( $query ) );
	}

	/**
	 * Provides test data for the redirect length test.
	 *
	 * @return Generator
	 */
	public static function provide_query_string_parameters() {
		yield 'Redirects because there are more then 5 characters' => [
			'input_query_string'  => 'this_is_longer_then_5',
			'output_query_string' => 'this_',
			'limit'               => 5,
		];

		yield 'Redirects to encoded version of special char' => [
			'input_query_string'  => 'this%26is_longer_then_5',
			'output_query_string' => 'this%25',
			'limit'               => 5,
		];
		yield 'Redirects to correct Japanese character' => [
			'input_query_string'  => 'this治クツワ警',
			'output_query_string' => 'this%E6%B2%BB',
			'limit'               => 5,
		];

		yield 'Redirects to correct encoded space character for space' => [
			'input_query_string'  => 'This is',
			'output_query_string' => 'This%20',
			'limit'               => 5,
		];

		yield 'Redirects to correct encoded space character for quote' => [
			'input_query_string'  => 'This\'is',
			'output_query_string' => 'This%27',
			'limit'               => 5,
		];
		yield 'Redirects to correct encoded space character for backslash' => [
			'input_query_string'  => 'This\"is',
			'output_query_string' => 'This%22',
			'limit'               => 5,
		];
		yield 'Redirects to correct encoded space character for slash' => [
			'input_query_string'  => 'This\is',
			'output_query_string' => 'This%5C',
			'limit'               => 5,
		];
		yield 'Redirects with correctly encoded html' => [
			'input_query_string'  => 'This <b>is</b>',
			'output_query_string' => 'This%20%3Cb%3Eis',
			'limit'               => 10,
		];
	}
}

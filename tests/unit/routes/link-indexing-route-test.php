<?php

namespace Yoast\WP\SEO\Tests\Unit\Routes;

use Mockery;
use Brain\Monkey;
use Yoast\WP\SEO\Actions\Indexation\Post_Link_Indexing_Action;
use Yoast\WP\SEO\Actions\Indexation\Term_Link_Indexing_Action;
use Yoast\WP\SEO\Helpers\Options_Helper;
use Yoast\WP\SEO\Integrations\Admin\Indexing_Notification_Integration;
use Yoast\WP\SEO\Routes\Link_Indexing_Route;
use Yoast\WP\SEO\Tests\Unit\Doubles\Models\Indexable_Mock;
use Yoast\WP\SEO\Tests\Unit\TestCase;

/**
 * Class Link_Indexing_Route_Test
 *
 * @package Yoast\WP\SEO\Tests\Unit\Routes
 *
 * @coversDefaultClass \Yoast\WP\SEO\Routes\Link_Indexing_Route
 * @covers  \Yoast\WP\SEO\Routes\Link_Indexing_Route
 */
class Link_Indexing_Route_Test extends TestCase {

	/**
	 * Instance under test.
	 *
	 * @var Link_Indexing_Route
	 */
	protected $instance;

	/**
	 * Mocked post link action.
	 *
	 * @var Mockery\MockInterface|Post_Link_Indexing_Action
	 */
	protected $post_link_indexing_action;

	/**
	 * Mocked term link action.
	 *
	 * @var Mockery\MockInterface|Term_Link_Indexing_Action
	 */
	protected $term_link_indexing_action;

	/**
	 * Mocked options helper.
	 *
	 * @var Mockery\MockInterface|Options_Helper
	 */
	protected $options_helper;

	/**
	 * Sets up the tests.
	 */
	public function setUp() {
		parent::setUp();

		$this->post_link_indexing_action = Mockery::mock( Post_Link_Indexing_Action::class );
		$this->term_link_indexing_action = Mockery::mock( Term_Link_Indexing_Action::class );
		$this->options_helper            = Mockery::mock( Options_Helper::class );

		$this->instance = new Link_Indexing_Route( $this->post_link_indexing_action, $this->term_link_indexing_action, $this->options_helper );
	}

	/**
	 * Tests the index_posts method.
	 *
	 * @covers ::index_posts
	 * @covers ::run_indexation_action
	 */
	public function test_index_posts_above_limit() {
		$indexables = [
			Mockery::mock( Indexable_Mock::class ),
			Mockery::mock( Indexable_Mock::class ),
			Mockery::mock( Indexable_Mock::class ),
			Mockery::mock( Indexable_Mock::class ),
			Mockery::mock( Indexable_Mock::class ),
		];

		$this->post_link_indexing_action->expects( 'index' )->andReturn( $indexables );

		$this->post_link_indexing_action->expects( 'get_limit' )->andReturn( 3 );

		Monkey\Functions\expect( 'rest_url' )
			->with( Link_Indexing_Route::FULL_POSTS_ROUTE )
			->andReturn( 'resturl' );

		Mockery::mock( 'overload:WP_REST_Response' )
			->expects( '__construct' )
			->with( [
				'objects'  => $indexables,
				'next_url' => 'resturl',
			] );

		$this->instance->index_posts();
	}

	/**
	 * Tests the index_posts method.
	 *
	 * @covers ::index_posts
	 * @covers ::run_indexation_action
	 */
	public function test_index_posts_below_limit() {
		$indexables = [
			Mockery::mock( Indexable_Mock::class ),
			Mockery::mock( Indexable_Mock::class ),
		];

		$this->post_link_indexing_action->expects( 'index' )->andReturn( $indexables );

		$this->post_link_indexing_action->expects( 'get_limit' )->andReturn( 3 );

		Mockery::mock( 'overload:WP_REST_Response' )
			->expects( '__construct' )
			->with( [
				'objects'  => $indexables,
				'next_url' => false,
			] );

		$this->instance->index_posts();
	}

	/**
	 * Tests the index_posts method.
	 *
	 * @covers ::index_posts
	 * @covers ::run_indexation_action
	 */
	public function test_index_posts_when_error_occurs() {
		$this->post_link_indexing_action
			->expects( 'index' )
			->andThrow( new \Exception( 'An exception during indexing' ) );

		$this->options_helper
			->expects( 'set' )
			->with( 'indexables_indexation_reason', Indexing_Notification_Integration::REASON_INDEXING_FAILED );

		Mockery::mock( 'overload:WP_Error' )
			->expects( '__construct' )
			->with( 'wpseo_error_indexing', 'An exception during indexing' );

		$this->instance->index_posts();
	}

	/**
	 * Tests the index_terms method.
	 *
	 * @covers ::index_terms
	 * @covers ::run_indexation_action
	 */
	public function test_index_terms_above_limit() {
		$indexables = [
			Mockery::mock( Indexable_Mock::class ),
			Mockery::mock( Indexable_Mock::class ),
			Mockery::mock( Indexable_Mock::class ),
			Mockery::mock( Indexable_Mock::class ),
			Mockery::mock( Indexable_Mock::class ),
		];

		$this->term_link_indexing_action->expects( 'index' )->andReturn( $indexables );

		$this->term_link_indexing_action->expects( 'get_limit' )->andReturn( 3 );

		Monkey\Functions\expect( 'rest_url' )->with( Link_Indexing_Route::FULL_POSTS_ROUTE )->andReturn( 'resturl' );

		Mockery::mock( 'overload:WP_REST_Response' )->expects( '__construct' )->with( [
			'objects'  => $indexables,
			'next_url' => 'resturl',
		] );

		$this->instance->index_terms();
	}


	/**
	 * Tests the index_terms method when the nr of terms is below the limit.
	 *
	 * @covers ::index_terms
	 * @covers ::run_indexation_action
	 */
	public function test_index_terms_below_limit() {
		$indexables = [
			Mockery::mock( Indexable_Mock::class ),
			Mockery::mock( Indexable_Mock::class ),
		];

		$this->term_link_indexing_action->expects( 'index' )->andReturn( $indexables );

		$this->term_link_indexing_action->expects( 'get_limit' )->andReturn( 3 );

		Mockery::mock( 'overload:WP_REST_Response' )
			->expects( '__construct' )
			->with( [
				'objects'  => $indexables,
				'next_url' => false,
			] );

		$this->instance->index_terms();
	}

	/**
	 * Tests the index_terms method when an error occurs.
	 *
	 * @covers ::index_terms
	 * @covers ::run_indexation_action
	 */
	public function test_index_terms_when_error_occurs() {
		$this->term_link_indexing_action->expects( 'index' )->andThrow( new \Exception( 'An exception during indexing' ) );

		$this->options_helper->expects( 'set' )->with( 'indexables_indexation_reason', Indexing_Notification_Integration::REASON_INDEXING_FAILED );

		Mockery::mock( 'overload:WP_Error' )
			->expects( '__construct' )
			->with( 'wpseo_error_indexing', 'An exception during indexing' );

		$this->instance->index_terms();
	}
}

<?php

namespace Yoast\WP\SEO\Tests\Unit\User_Meta\Application;

use Mockery;
use Yoast\WP\SEO\Tests\Unit\TestCase;
use Yoast\WP\SEO\User_Meta\Application\Custom_Meta_Collector;
use Yoast\WP\SEO\User_Meta\Framework\Custom_Meta\Author_Metadesc;
use Yoast\WP\SEO\User_Meta\Framework\Custom_Meta\Noindex_Author;

/**
 * Tests the custom meta collector.
 *
 * @group user-meta
 *
 * @coversDefaultClass \Yoast\WP\SEO\User_Meta\Application\Custom_Meta_Collector
 */
final class Custom_Meta_Collector_Test extends TestCase {

	/**
	 * Holds the instance.
	 *
	 * @var Custom_Meta_Collector
	 */
	private $instance;

	/**
	 * Holds mocked Author_Metadesc class.
	 *
	 * @var Mockery\MockInterface|Author_Metadesc
	 */
	private $author_metadesc;

	/**
	 * Holds mocked Noindex_Author class.
	 *
	 * @var Mockery\MockInterface|Noindex_Author
	 */
	private $noindex_author;

	/**
	 * Sets up the test fixtures.
	 *
	 * @return void
	 */
	protected function set_up() {
		parent::set_up();

		$this->author_metadesc = Mockery::mock( Author_Metadesc::class );
		$this->noindex_author  = Mockery::mock( Noindex_Author::class );

		$this->instance = new Custom_Meta_Collector(
			$this->author_metadesc,
			$this->noindex_author
		);
	}

	/**
	 * Tests constructor.
	 *
	 * @covers ::__construct
	 *
	 * @return void
	 */
	public function test_constructor() {
		$this->assertIsArray( $this->getPropertyValue( $this->instance, 'custom_meta' ) );
	}

	/**
	 * Tests get_custom_meta.
	 *
	 * @covers ::get_custom_meta
	 *
	 * @return void
	 */
	public function test_get_custom_meta() {
		$expected_result = [
			$this->author_metadesc,
			$this->noindex_author,
		];

		$this->assertSame( $expected_result, $this->instance->get_custom_meta() );
	}

	/**
	 * Tests get_non_empty_custom_meta.
	 *
	 * @covers ::get_non_empty_custom_meta
	 *
	 * @return void
	 */
	public function test_get_non_empty_custom_meta_no_non_empty() {
		$this->author_metadesc
			->expects( 'is_empty_allowed' )
			->once()
			->andReturn( false );

		$this->noindex_author
			->expects( 'is_empty_allowed' )
			->once()
			->andReturn( false );

		$this->author_metadesc
			->expects( 'get_key' )
			->once()
			->andReturn( 'author_key' );

		$this->noindex_author
			->expects( 'get_key' )
			->once()
			->andReturn( 'noindex_key' );

		$expected_result = [
			'author_key',
			'noindex_key',
		];
		$actual_result   = $this->instance->get_non_empty_custom_meta();

		$this->assertSame( $expected_result, $actual_result );
	}

	/**
	 * Tests get_non_empty_custom_meta.
	 *
	 * @covers ::get_non_empty_custom_meta
	 *
	 * @return void
	 */
	public function test_get_non_empty_custom_meta_one_non_empty() {
		$this->author_metadesc
			->expects( 'is_empty_allowed' )
			->once()
			->andReturn( false );

		$this->noindex_author
			->expects( 'is_empty_allowed' )
			->once()
			->andReturn( true );

		$this->author_metadesc
			->expects( 'get_key' )
			->once()
			->andReturn( 'author_key' );

		$this->noindex_author
			->expects( 'get_key' )
			->never();

		$expected_result = [
			'author_key',
		];
		$actual_result   = $this->instance->get_non_empty_custom_meta();

		$this->assertSame( $expected_result, $actual_result );
	}

	/**
	 * Tests get_sorted_custom_meta.
	 *
	 * @covers ::get_sorted_custom_meta
	 *
	 * @return void
	 */
	public function test_get_sorted_custom_meta() {
		$this->author_metadesc
			->expects( 'get_render_priority' )
			->once()
			->andReturn( 200 );

		$this->noindex_author
			->expects( 'get_render_priority' )
			->once()
			->andReturn( 100 );

		$expected_result = [
			$this->noindex_author,
			$this->author_metadesc,
		];
		$actual_result   = $this->instance->get_sorted_custom_meta();

		$this->assertSame( $expected_result, $actual_result );
	}

	/**
	 * Tests get_sorted_custom_meta for conflicting priorities.
	 *
	 * @covers ::get_sorted_custom_meta
	 *
	 * @return void
	 */
	public function test_get_sorted_conflicting_custom_meta() {
		$this->author_metadesc
			->expects( 'get_render_priority' )
			->once()
			->andReturn( 100 );

		$this->noindex_author
			->expects( 'get_render_priority' )
			->once()
			->andReturn( 100 );

		$expected_result = [
			$this->author_metadesc,
			$this->noindex_author,
		];
		$actual_result   = $this->instance->get_sorted_custom_meta();

		$this->assertSame( $expected_result, $actual_result );
	}
}

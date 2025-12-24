<?php
// phpcs:disable Yoast.NamingConventions.NamespaceName.TooLong -- Needed in the folder structure.
// phpcs:disable Yoast.NamingConventions.NamespaceName.MaxExceeded
namespace Yoast\WP\SEO\Tests\Unit\Schema_Aggregator\Application\Enhancement\Article_Schema_Enhancer;

use Brain\Monkey\Functions;
use Exception;
use Mockery;
use WP_Error;
use Yoast\WP\SEO\Schema_Aggregator\Application\Enhancement\Article_Schema_Enhancer;
use Yoast\WP\SEO\Schema_Aggregator\Domain\Schema_Piece;
use Yoast\WP\SEO\Schema_Aggregator\Infrastructure\Enhancement\Article_Config;
use Yoast\WP\SEO\Tests\Unit\Doubles\Models\Indexable_Mock;
use Yoast\WP\SEO\Tests\Unit\TestCase;

/**
 * Tests the Article_Schema_Enhancer class.
 *
 * @group schema-aggregator
 *
 * @coversDefaultClass \Yoast\WP\SEO\Schema_Aggregator\Application\Enhancement\Article_Schema_Enhancer
 */
final class Article_Schema_Enhancer_Test extends TestCase {

	/**
	 * The Article_Schema_Enhancer instance under test.
	 *
	 * @var Article_Schema_Enhancer
	 */
	private $instance;

	/**
	 * The Article_Config mock.
	 *
	 * @var Article_Config|Mockery\MockInterface
	 */
	private $config;

	/**
	 * Sets up the test fixtures.
	 *
	 * @return void
	 */
	protected function set_up() {
		parent::set_up();

		$this->instance = new Article_Schema_Enhancer();
		$this->config   = Mockery::mock( Article_Config::class );
		$this->instance->set_article_config( $this->config );
	}

	/**
	 * Tests exception handling in enhance_schema_piece method.
	 *
	 * @covers ::enhance
	 * @covers ::enhance_schema_piece
	 *
	 * @return void
	 */
	public function test_enhance_schema_piece_handles_exception() {
		$indexable            = Mockery::mock( Indexable_Mock::class );
		$indexable->object_id = 123;

		$schema_data = [
			[
				'@type' => 'Article',
			],
		];

		$schema_piece = new Schema_Piece( $schema_data, 'Article' );

		$this->config
			->expects( 'is_enhancement_enabled' )
			->with( 'use_excerpt' )
			->andThrow( new Exception( 'Test exception' ) );

		$result = $this->instance->enhance( $schema_piece, $indexable );

		$enhanced_data = $result->get_data();
		$this->assertSame( $schema_data[0], $enhanced_data[0] );
	}

	/**
	 * Tests exception handling in get_article_keywords method.
	 *
	 * @covers ::enhance
	 * @covers ::enhance_schema_piece
	 * @covers ::get_article_keywords
	 *
	 * @return void
	 */
	public function test_get_article_keywords_handles_exception() {
		$indexable            = Mockery::mock( Indexable_Mock::class );
		$indexable->object_id = 123;

		$schema_data = [
			[
				'@type' => 'Article',
			],
		];

		$schema_piece = new Schema_Piece( $schema_data, 'Article' );

		Functions\expect( 'get_the_tags' )
			->with( 123 )
			->andThrow( new Exception( 'Test exception' ) );

		$this->config
			->expects( 'is_enhancement_enabled' )
			->with( 'use_excerpt' )
			->andReturn( false );

		$this->config
			->expects( 'is_enhancement_enabled' )
			->with( 'article_body' )
			->andReturn( false );

		$this->config
			->expects( 'is_enhancement_enabled' )
			->with( 'keywords' )
			->andReturn( true );

		$result = $this->instance->enhance( $schema_piece, $indexable );

		$enhanced_data = $result->get_data();
		$this->assertArrayNotHasKey( 'keywords', $enhanced_data[0] );
	}

	/**
	 * Tests exception handling in get_excerpt method.
	 *
	 * @covers ::enhance
	 * @covers ::enhance_schema_piece
	 * @covers ::get_excerpt
	 *
	 * @return void
	 */
	public function test_get_excerpt_handles_exception() {
		$indexable            = Mockery::mock( Indexable_Mock::class );
		$indexable->object_id = 123;

		$schema_data = [
			[
				'@type' => 'Article',
			],
		];

		$schema_piece = new Schema_Piece( $schema_data, 'Article' );

		Functions\expect( 'get_post_field' )
			->with( 'post_excerpt', 123 )
			->andThrow( new Exception( 'Test exception' ) );

		$this->config
			->expects( 'is_enhancement_enabled' )
			->with( 'use_excerpt' )
			->andReturn( true );

		$this->config
			->expects( 'is_enhancement_enabled' )
			->with( 'article_body' )
			->andReturn( false );

		$this->config
			->expects( 'is_enhancement_enabled' )
			->with( 'keywords' )
			->andReturn( false );

		$result = $this->instance->enhance( $schema_piece, $indexable );

		$enhanced_data = $result->get_data();
		$this->assertArrayNotHasKey( 'description', $enhanced_data[0] );
	}

	/**
	 * Tests exception handling in get_article_body method.
	 *
	 * @covers ::enhance
	 * @covers ::enhance_schema_piece
	 * @covers ::get_article_body
	 *
	 * @return void
	 */
	public function test_get_article_body_handles_exception() {
		$indexable            = Mockery::mock( Indexable_Mock::class );
		$indexable->object_id = 123;

		$schema_data = [
			[
				'@type' => 'Article',
			],
		];

		$schema_piece = new Schema_Piece( $schema_data, 'Article' );

		Functions\expect( 'get_post_field' )
			->with( 'post_content', 123 )
			->andThrow( new Exception( 'Test exception' ) );

		$this->config
			->expects( 'is_enhancement_enabled' )
			->with( 'use_excerpt' )
			->andReturn( false );

		$this->config
			->expects( 'is_enhancement_enabled' )
			->with( 'article_body' )
			->andReturn( true );

		$this->config
			->expects( 'should_include_article_body' )
			->with( false )
			->andReturn( true );

		$this->config
			->expects( 'is_enhancement_enabled' )
			->with( 'keywords' )
			->andReturn( false );

		$result = $this->instance->enhance( $schema_piece, $indexable );

		$enhanced_data = $result->get_data();
		$this->assertArrayNotHasKey( 'articleBody', $enhanced_data[0] );
	}

	/**
	 * Tests enhance() with all enhancements enabled at once.
	 *
	 * @covers ::enhance
	 * @covers ::enhance_schema_piece
	 * @covers ::get_excerpt
	 * @covers ::get_article_body
	 * @covers ::get_article_keywords
	 *
	 * @return void
	 */
	public function test_enhance_with_all_enhancements_enabled() {
		$indexable            = Mockery::mock( Indexable_Mock::class );
		$indexable->object_id = 123;

		$schema_data = [
			[
				'@type' => 'Article',
			],
		];

		$schema_piece = new Schema_Piece( $schema_data, 'Article' );

		Functions\expect( 'get_post_field' )
			->with( 'post_excerpt', 123 )
			->andReturn( 'This is an excerpt' );

		Functions\expect( 'wp_strip_all_tags' )
			->with( 'This is an excerpt' )
			->andReturn( 'This is an excerpt' );

		Functions\expect( 'get_post_field' )
			->with( 'post_content', 123 )
			->andReturn( 'This is the full article content' );

		Functions\expect( 'strip_shortcodes' )
			->with( 'This is the full article content' )
			->andReturn( 'This is the full article content' );

		Functions\expect( 'wp_strip_all_tags' )
			->with( 'This is the full article content' )
			->andReturn( 'This is the full article content' );

		$tag1       = (object) [ 'name' => 'tag1' ];
		$tags_array = [ $tag1 ];

		Functions\expect( 'get_the_tags' )
			->with( 123 )
			->andReturn( $tags_array );

		$this->config
			->expects( 'is_enhancement_enabled' )
			->with( 'use_excerpt' )
			->andReturn( true );

		$this->config
			->expects( 'get_config_value' )
			->with( 'excerpt_max_length', 0 )
			->andReturn( 0 );

		$this->config
			->expects( 'is_enhancement_enabled' )
			->with( 'article_body' )
			->andReturn( true );

		$this->config
			->expects( 'should_include_article_body' )
			->with( true )
			->andReturn( true );

		$this->config
			->expects( 'get_config_value' )
			->with( 'strip_shortcodes_from_body', true )
			->andReturn( true );

		$this->config
			->expects( 'get_config_value' )
			->with( 'strip_html_from_body', true )
			->andReturn( true );

		$this->config
			->expects( 'get_config_value' )
			->with( 'article_body_max_length', Article_Config::DEFAULT_MAX_ARTICLE_BODY_LENGTH )
			->andReturn( 500 );

		$this->config
			->expects( 'is_enhancement_enabled' )
			->with( 'keywords' )
			->andReturn( true );

		$this->config
			->expects( 'get_config_value' )
			->with( 'categories_as_keywords', false )
			->andReturn( false );

		$result = $this->instance->enhance( $schema_piece, $indexable );

		$enhanced_data = $result->get_data();
		$this->assertSame( 'This is an excerpt', $enhanced_data[0]['description'] );
		$this->assertSame( 'This is the full article content', $enhanced_data[0]['articleBody'] );
		$this->assertSame( 'tag1', $enhanced_data[0]['keywords'] );
	}

	/**
	 * Data provider for enhance_schema_piece testing.
	 *
	 * @return array<string, array<string, mixed>>
	 */
	public function data_provider_for_enhance_schema_piece() {
		return [
			'excerpt_enhancement_disabled' => [
				'config'          => [
					'use_excerpt'  => false,
					'article_body' => false,
					'keywords'     => false,
				],
				'schema_data'     => [ '@type' => 'Article' ],
				'expected_fields' => [],
				'excerpt_data'    => null,
				'body_data'       => null,
				'keywords_data'   => null,
			],
			'excerpt_enhancement_enabled_with_valid_excerpt' => [
				'config'          => [
					'use_excerpt'  => true,
					'article_body' => false,
					'keywords'     => false,
				],
				'schema_data'     => [ '@type' => 'Article' ],
				'expected_fields' => [ 'description' => 'Valid excerpt text' ],
				'excerpt_data'    => [
					'post_excerpt'       => 'Valid excerpt text',
					'excerpt_max_length' => 0,
				],
				'body_data'       => null,
				'keywords_data'   => null,
			],
			'excerpt_enhancement_with_existing_description' => [
				'config'          => [
					'use_excerpt'  => true,
					'article_body' => false,
					'keywords'     => false,
				],
				'schema_data'     => [
					'@type'       => 'Article',
					'description' => 'Existing description',
				],
				'expected_fields' => [ 'description' => 'Existing description' ],
				'excerpt_data'    => [
					'post_excerpt'       => 'Valid excerpt text',
					'excerpt_max_length' => 0,
				],
				'body_data'       => null,
				'keywords_data'   => null,
			],
			'article_body_enhancement_enabled' => [
				'config'          => [
					'use_excerpt'  => false,
					'article_body' => true,
					'keywords'     => false,
				],
				'schema_data'     => [ '@type' => 'Article' ],
				'expected_fields' => [ 'articleBody' => 'Article content' ],
				'excerpt_data'    => null,
				'body_data'       => [
					'post_content'     => 'Article content',
					'should_include'   => true,
					'strip_shortcodes' => true,
					'strip_html'       => true,
					'max_length'       => 500,
				],
				'keywords_data'   => null,
			],
			'article_body_with_existing_body' => [
				'config'          => [
					'use_excerpt'  => false,
					'article_body' => true,
					'keywords'     => false,
				],
				'schema_data'     => [
					'@type'       => 'Article',
					'articleBody' => 'Existing body',
				],
				'expected_fields' => [ 'articleBody' => 'Existing body' ],
				'excerpt_data'    => null,
				'body_data'       => [
					'post_content'     => 'Article content',
					'should_include'   => true,
					'strip_shortcodes' => true,
					'strip_html'       => true,
					'max_length'       => 500,
				],
				'keywords_data'   => null,
			],
			'keywords_enhancement_enabled' => [
				'config'          => [
					'use_excerpt'  => false,
					'article_body' => false,
					'keywords'     => true,
				],
				'schema_data'     => [ '@type' => 'Article' ],
				'expected_fields' => [ 'keywords' => 'tag1, tag2' ],
				'excerpt_data'    => null,
				'body_data'       => null,
				'keywords_data'   => [
					'tags'                   => [ (object) [ 'name' => 'tag1' ], (object) [ 'name' => 'tag2' ] ],
					'categories_as_keywords' => false,
				],
			],
			'keywords_with_existing_keywords' => [
				'config'          => [
					'use_excerpt'  => false,
					'article_body' => false,
					'keywords'     => true,
				],
				'schema_data'     => [
					'@type'    => 'Article',
					'keywords' => 'existing, keywords',
				],
				'expected_fields' => [ 'keywords' => 'existing, keywords' ],
				'excerpt_data'    => null,
				'body_data'       => null,
				'keywords_data'   => [
					'tags'                   => [ (object) [ 'name' => 'tag1' ], (object) [ 'name' => 'tag2' ] ],
					'categories_as_keywords' => false,
				],
			],
			'all_enhancements_enabled' => [
				'config'          => [
					'use_excerpt'  => true,
					'article_body' => true,
					'keywords'     => true,
				],
				'schema_data'     => [ '@type' => 'Article' ],
				'expected_fields' => [
					'description' => 'Test excerpt',
					'articleBody' => 'Test content',
					'keywords'    => 'test-tag',
				],
				'excerpt_data'    => [
					'post_excerpt'       => 'Test excerpt',
					'excerpt_max_length' => 0,
				],
				'body_data'       => [
					'post_content'     => 'Test content',
					'should_include'   => true,
					'strip_shortcodes' => true,
					'strip_html'       => true,
					'max_length'       => 500,
				],
				'keywords_data'   => [
					'tags'                   => [ (object) [ 'name' => 'test-tag' ] ],
					'categories_as_keywords' => false,
				],
			],
		];
	}

	/**
	 * Tests enhance_schema_piece method with various configurations.
	 *
	 * @dataProvider data_provider_for_enhance_schema_piece
	 *
	 * @covers ::enhance
	 * @covers ::enhance_schema_piece
	 * @covers ::get_excerpt
	 * @covers ::get_article_body
	 * @covers ::get_article_keywords
	 *
	 * @param array<string, bool>       $config          Configuration for enhancements.
	 * @param array<string, mixed>      $schema_data     Input schema data.
	 * @param array<string, string>     $expected_fields Expected output fields.
	 * @param array<string, mixed>|null $excerpt_data    Excerpt mock data.
	 * @param array<string, mixed>|null $body_data       Body mock data.
	 * @param array<string, mixed>|null $keywords_data   Keywords mock data.
	 *
	 * @return void
	 */
	public function test_enhance_schema_piece_with_different_configurations( $config, $schema_data, $expected_fields, $excerpt_data, $body_data, $keywords_data ) {
		$indexable            = Mockery::mock( Indexable_Mock::class );
		$indexable->object_id = 123;

		$schema_piece = new Schema_Piece( [ $schema_data ], 'Article' );

		foreach ( $config as $enhancement => $enabled ) {
			$this->config
				->expects( 'is_enhancement_enabled' )
				->with( $enhancement )
				->andReturn( $enabled );
		}

		if ( $excerpt_data !== null && $config['use_excerpt'] ) {
			Functions\expect( 'get_post_field' )
				->with( 'post_excerpt', 123 )
				->andReturn( $excerpt_data['post_excerpt'] );

			Functions\expect( 'wp_strip_all_tags' )
				->with( $excerpt_data['post_excerpt'] )
				->andReturn( $excerpt_data['post_excerpt'] );

			$this->config
				->expects( 'get_config_value' )
				->with( 'excerpt_max_length', 0 )
				->andReturn( $excerpt_data['excerpt_max_length'] );
		}

		if ( $body_data !== null && $config['article_body'] ) {
			$has_excerpt = $excerpt_data !== null && $config['use_excerpt'] && ! isset( $schema_data['description'] );

			$this->config
				->expects( 'should_include_article_body' )
				->with( $has_excerpt )
				->andReturn( $body_data['should_include'] );

			if ( $body_data['should_include'] && ! isset( $schema_data['articleBody'] ) ) {
				Functions\expect( 'get_post_field' )
					->with( 'post_content', 123 )
					->andReturn( $body_data['post_content'] );

				$this->config
					->expects( 'get_config_value' )
					->with( 'strip_shortcodes_from_body', true )
					->andReturn( $body_data['strip_shortcodes'] );

				if ( $body_data['strip_shortcodes'] ) {
					Functions\expect( 'strip_shortcodes' )
						->with( $body_data['post_content'] )
						->andReturn( $body_data['post_content'] );
				}

				$this->config
					->expects( 'get_config_value' )
					->with( 'strip_html_from_body', true )
					->andReturn( $body_data['strip_html'] );

				if ( $body_data['strip_html'] ) {
					Functions\expect( 'wp_strip_all_tags' )
						->with( $body_data['post_content'] )
						->andReturn( $body_data['post_content'] );
				}

				$this->config
					->expects( 'get_config_value' )
					->with( 'article_body_max_length', Article_Config::DEFAULT_MAX_ARTICLE_BODY_LENGTH )
					->andReturn( $body_data['max_length'] );
			}
		}

		if ( $keywords_data !== null && $config['keywords'] && ! isset( $schema_data['keywords'] ) ) {
			Functions\expect( 'get_the_tags' )
				->with( 123 )
				->andReturn( $keywords_data['tags'] );

			$this->config
				->expects( 'get_config_value' )
				->with( 'categories_as_keywords', false )
				->andReturn( $keywords_data['categories_as_keywords'] );
		}

		$result        = $this->instance->enhance( $schema_piece, $indexable );
		$enhanced_data = $result->get_data();

		foreach ( $expected_fields as $field => $expected_value ) {
			$this->assertSame( $expected_value, $enhanced_data[0][ $field ] );
		}

		$all_possible_fields = [ 'description', 'articleBody', 'keywords' ];
		foreach ( $all_possible_fields as $field ) {
			if ( ! isset( $expected_fields[ $field ] ) && ! isset( $schema_data[ $field ] ) ) {
				$this->assertArrayNotHasKey( $field, $enhanced_data[0] );
			}
		}
	}

	/**
	 * Data provider for testing edge cases and error conditions.
	 *
	 * @return array<string, array<string, mixed>>
	 */
	public function data_provider_for_edge_cases() {
		return [
			'empty_excerpt' => [
				'post_excerpt'          => '',
				'excerpt_prefer_manual' => false,
				'post_content'          => 'Some content',
				'expected_result'       => 'Some content',
			],
			'whitespace_only_excerpt' => [
				'post_excerpt'          => '   ',
				'excerpt_prefer_manual' => false,
				'post_content'          => 'Some content',
				'expected_result'       => 'Some content',
			],
			'empty_excerpt_prefer_manual' => [
				'post_excerpt'          => '',
				'excerpt_prefer_manual' => true,
				'post_content'          => 'Some content',
				'expected_result'       => null,
			],
			'wp_error_excerpt' => [
				'post_excerpt'          => new WP_Error( 'error', 'Error message' ),
				'excerpt_prefer_manual' => false,
				'post_content'          => 'Some content',
				'expected_result'       => 'Some content',
			],
			'wp_error_content' => [
				'post_excerpt'          => '',
				'excerpt_prefer_manual' => false,
				'post_content'          => new WP_Error( 'error', 'Error message' ),
				'expected_result'       => null,
			],
			'empty_content' => [
				'post_excerpt'          => '',
				'excerpt_prefer_manual' => false,
				'post_content'          => '',
				'expected_result'       => null,
			],
			'tags_null' => [
				'tags'                   => null,
				'categories_as_keywords' => false,
				'expected_keywords'      => [],
			],
			'tags_false' => [
				'tags'                   => false,
				'categories_as_keywords' => false,
				'expected_keywords'      => [],
			],
			'tags_without_name_property' => [
				'tags'                   => [ (object) [ 'slug' => 'tag1' ] ],
				'categories_as_keywords' => false,
				'expected_keywords'      => [],
			],
			'categories_with_uncategorized' => [
				'tags'                   => [],
				'categories_as_keywords' => true,
				'categories'             => [
					(object) [ 'name' => 'Category1' ],
					(object) [ 'name' => 'Uncategorized' ],
					(object) [ 'name' => 'Category2' ],
				],
				'expected_keywords'      => [ 'Category1', 'Category2' ],
			],
		];
	}

	/**
	 * Tests get_excerpt method with edge cases.
	 *
	 * @dataProvider data_provider_for_edge_cases
	 *
	 * @covers ::enhance
	 * @covers ::enhance_schema_piece
	 * @covers ::get_excerpt
	 *
	 * @param mixed       $post_excerpt          Post excerpt value.
	 * @param bool        $excerpt_prefer_manual Whether to prefer manual excerpts.
	 * @param mixed       $post_content          Post content value.
	 * @param string|null $expected_result       Expected result.
	 *
	 * @return void
	 */
	public function test_get_excerpt_edge_cases( $post_excerpt, $excerpt_prefer_manual, $post_content, $expected_result ) {
		if ( ! \in_array( 'expected_result', \array_keys( \func_get_args() ), true ) ) {
			$this->markTestSkipped( 'This test case is for keywords, not excerpt' );
		}

		$indexable            = Mockery::mock( Indexable_Mock::class );
		$indexable->object_id = 123;

		$schema_data  = [ [ '@type' => 'Article' ] ];
		$schema_piece = new Schema_Piece( $schema_data, 'Article' );

		$this->config
			->expects( 'is_enhancement_enabled' )
			->with( 'use_excerpt' )
			->andReturn( true );

		Functions\expect( 'get_post_field' )
			->with( 'post_excerpt', 123 )
			->andReturn( $post_excerpt );

		if ( ! \is_wp_error( $post_excerpt ) ) {
			$this->config
				->expects( 'get_config_value' )
				->with( 'excerpt_prefer_manual', false )
				->andReturn( $excerpt_prefer_manual );

			if ( ( empty( $post_excerpt ) || \trim( $post_excerpt ) === '' ) && ! $excerpt_prefer_manual ) {
				Functions\expect( 'get_post_field' )
					->with( 'post_content', 123 )
					->andReturn( $post_content );

				if ( ! \is_wp_error( $post_content ) && ! empty( $post_content ) ) {
					Functions\expect( 'wp_trim_excerpt' )
						->with( $post_content, 123 )
						->andReturn( $expected_result );
				}
			}

			if ( $expected_result !== null ) {
				Functions\expect( 'wp_strip_all_tags' )
					->with( $expected_result )
					->andReturn( $expected_result );

				$this->config
					->expects( 'get_config_value' )
					->with( 'excerpt_max_length', 0 )
					->andReturn( 0 );
			}
		}

		$this->config
			->expects( 'is_enhancement_enabled' )
			->with( 'article_body' )
			->andReturn( false );

		$this->config
			->expects( 'is_enhancement_enabled' )
			->with( 'keywords' )
			->andReturn( false );

		$result        = $this->instance->enhance( $schema_piece, $indexable );
		$enhanced_data = $result->get_data();

		if ( $expected_result !== null ) {
			$this->assertSame( $expected_result, $enhanced_data[0]['description'] );
		}
		else {
			$this->assertArrayNotHasKey( 'description', $enhanced_data[0] );
		}
	}

	/**
	 * Tests get_article_keywords method with edge cases.
	 *
	 * @dataProvider data_provider_for_edge_cases
	 *
	 * @covers ::enhance
	 * @covers ::enhance_schema_piece
	 * @covers ::get_article_keywords
	 *
	 * @param mixed              $tags                   Tags data.
	 * @param bool               $categories_as_keywords Whether to include categories.
	 * @param array<object>|null $categories             Categories data.
	 * @param array<string>      $expected_keywords      Expected keywords.
	 *
	 * @return void
	 */
	public function test_get_article_keywords_edge_cases( $tags = null, $categories_as_keywords = false, $categories = null, $expected_keywords = [] ) {
		if ( ! \in_array( 'expected_keywords', \array_keys( \func_get_args() ), true ) ) {
			$this->markTestSkipped( 'This test case is for excerpt, not keywords' );
		}

		$indexable            = Mockery::mock( Indexable_Mock::class );
		$indexable->object_id = 123;

		$schema_data  = [ [ '@type' => 'Article' ] ];
		$schema_piece = new Schema_Piece( $schema_data, 'Article' );

		$this->config
			->expects( 'is_enhancement_enabled' )
			->with( 'use_excerpt' )
			->andReturn( false );

		$this->config
			->expects( 'is_enhancement_enabled' )
			->with( 'article_body' )
			->andReturn( false );

		$this->config
			->expects( 'is_enhancement_enabled' )
			->with( 'keywords' )
			->andReturn( true );

		Functions\expect( 'get_the_tags' )
			->with( 123 )
			->andReturn( $tags );

		$this->config
			->expects( 'get_config_value' )
			->with( 'categories_as_keywords', false )
			->andReturn( $categories_as_keywords );

		if ( $categories_as_keywords && $categories !== null ) {
			Functions\expect( 'get_the_category' )
				->with( 123 )
				->andReturn( $categories );
		}

		$result        = $this->instance->enhance( $schema_piece, $indexable );
		$enhanced_data = $result->get_data();

		if ( ! empty( $expected_keywords ) ) {
			$this->assertSame( \implode( ', ', $expected_keywords ), $enhanced_data[0]['keywords'] );
		}
		else {
			$this->assertArrayNotHasKey( 'keywords', $enhanced_data[0] );
		}
	}

	/**
	 * Tests enhance_schema_piece with null and invalid indexable object_id.
	 *
	 * @covers ::enhance
	 * @covers ::enhance_schema_piece
	 *
	 * @return void
	 */
	public function test_enhance_schema_piece_with_invalid_object_id() {
		$indexable            = Mockery::mock( Indexable_Mock::class );
		$indexable->object_id = null;

		$schema_data  = [ [ '@type' => 'Article' ] ];
		$schema_piece = new Schema_Piece( $schema_data, 'Article' );

		$this->config
			->expects( 'is_enhancement_enabled' )
			->with( 'use_excerpt' )
			->andReturn( true );

		Functions\expect( 'get_post_field' )
			->with( 'post_excerpt', null )
			->andReturn( null );

		$this->config
			->expects( 'is_enhancement_enabled' )
			->with( 'article_body' )
			->andReturn( false );

		$this->config
			->expects( 'is_enhancement_enabled' )
			->with( 'keywords' )
			->andReturn( false );

		$result        = $this->instance->enhance( $schema_piece, $indexable );
		$enhanced_data = $result->get_data();

		$this->assertArrayNotHasKey( 'description', $enhanced_data[0] );
		$this->assertArrayNotHasKey( 'articleBody', $enhanced_data[0] );
		$this->assertArrayNotHasKey( 'keywords', $enhanced_data[0] );
	}
}

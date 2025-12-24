<?php
// phpcs:disable Yoast.NamingConventions.NamespaceName.TooLong -- Needed in the folder structure.
namespace Yoast\WP\SEO\Tests\Unit\Schema_Aggregator\Application\Enhancement\Article_Schema_Enhancer;

use Brain\Monkey\Functions;
use Generator;
use Mockery;
use Yoast\WP\SEO\Schema_Aggregator\Domain\Schema_Piece;
use Yoast\WP\SEO\Schema_Aggregator\Infrastructure\Enhancement\Article_Config;
use Yoast\WP\SEO\Tests\Unit\Doubles\Models\Indexable_Mock;

/**
 * Tests the Article_Schema_Enhancer class enhance method.
 *
 * @group schema-aggregator
 *
 * @coversDefaultClass \Yoast\WP\SEO\Schema_Aggregator\Application\Enhancement\Article_Schema_Enhancer
 */
final class Enhance_SchemaPiece_Test extends Abstract_Article_Schema_Enhancer_Test {

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

		$this->config = Mockery::mock( Article_Config::class );
		$this->instance->set_article_config( $this->config );
	}

	public function test_enhance_schema_piece_trigger_exception() {
		$indexable = new Indexable_Mock();
		$indexable->object_id = 123123123;
		$schema_data = [
			'@type' => 'Article',
			'@context' => 'https://schema.org',
			'headline' => 'How to Optimize Your WordPress Site for SEO',
			'author' => [
				'@type' => 'Person',
				'name' => 'John Doe'
			],
			'datePublished' => '2024-01-15T10:30:00+00:00',
			'dateModified' => '2024-01-16T14:20:00+00:00',
			'publisher' => [
				'@type' => 'Organization',
				'name' => 'My WordPress Blog',
				'logo' => [
					'@type' => 'ImageObject',
					'url' => 'https://example.com/logo.png'
				]
			],
			'mainEntityOfPage' => [
				'@type' => 'WebPage',
				'@id' => 'https://example.com/seo-optimization-guide'
			]
			];

		$schema_piece = new Schema_Piece($schema_data, 'Article');

		Functions\expect('get_post_field')
			->once()
			->with('post_excerpt', $indexable->object_id)
			->andThrow(new \Exception('Test exception'));

		$this->config->shouldReceive('is_enhancement_enabled')
			->with('use_excerpt')
			->andReturn(true);

		$result = $this->instance->enhance($schema_piece, $indexable);

		$this->assertEquals($schema_data, $result->get_data());
	}
	/**
	 * Provides data for schema type validation tests.
	 *
	 * @return Generator
	 */
	public static function schema_type_provider(): Generator {
		yield 'Article type' => [
			'schema_data' => [
				[
					'@type' => 'Article',
				],
			],
			'schema_type' => 'Article',
			'should_enhance' => true,
			'expected_type' => 'Article',
			'expected_data_unchanged' => false,
		];

		yield 'NewsArticle type' => [
			'schema_data' => [
				[
					'@type' => 'NewsArticle',
				],
			],
			'schema_type' => 'NewsArticle',
			'should_enhance' => true,
			'expected_type' => 'NewsArticle',
			'expected_data_unchanged' => false,
		];

		yield 'BlogPosting type' => [
			'schema_data' => [
				[
					'@type' => 'BlogPosting',
				],
			],
			'schema_type' => 'BlogPosting',
			'should_enhance' => true,
			'expected_type' => 'BlogPosting',
			'expected_data_unchanged' => false,
		];

		yield 'Array type containing Article' => [
			'schema_data' => [
				[
					'@type' => [ 'Article', 'WebPage' ],
				],
			],
			'schema_type' => 'Article',
			'should_enhance' => true,
			'expected_type' => 'Article',
			'expected_data_unchanged' => false,
		];

		yield 'Non-article type (WebPage)' => [
			'schema_data' => [
				[
					'@type' => 'WebPage',
				],
			],
			'schema_type' => 'WebPage',
			'should_enhance' => false,
			'expected_type' => 'WebPage',
			'expected_data_unchanged' => true,
		];

		yield 'Missing @type' => [
			'schema_data' => [
				[
					'name' => 'Some content',
				],
			],
			'schema_type' => 'Unknown',
			'should_enhance' => false,
			'expected_type' => 'Unknown',
			'expected_data_unchanged' => true,
		];
	}

	/**
	 * Data provider for enhance_schema_piece edge cases and error conditions.
	 *
	 * @return Generator
	 */
	public static function enhance_schema_piece_data_provider(): Generator {
		yield 'all_enhancements_disabled' => [
			'config' => [
				'use_excerpt' => false,
				'article_body' => false,
				'keywords' => false,
			],
			'schema_data' => [
				'@type' => 'Article',
			],
			'post_id' => 123,
			'expected_fields' => [],
		];

		yield 'excerpt_enhancement_enabled_with_valid_excerpt' => [
			'config' => [
				'use_excerpt' => true,
				'article_body' => false,
				'keywords' => false,
			],
			'schema_data' => [
				'@type' => 'Article',
			],
			'post_id' => 123,
			'expected_fields' => [
				'description' => 'Valid excerpt text',
			],
		];

		yield 'excerpt_with_existing_description_should_not_override' => [
			'config' => [
				'use_excerpt' => true,
				'article_body' => false,
				'keywords' => false,
			],
			'schema_data' => [
				'@type' => 'Article',
				'description' => 'Existing description',
			],
			'post_id' => 123,
			'expected_fields' => [
				'description' => 'Existing description',
			],
		];

		yield 'article_body_enhancement_enabled' => [
			'config' => [
				'use_excerpt' => false,
				'article_body' => true,
				'keywords' => false,
			],
			'schema_data' => [
				'@type' => 'Article',
			],
			'post_id' => 123,
			'expected_fields' => [
				'articleBody' => 'Article content without HTML',
			],
		];

		yield 'article_body_with_existing_body_should_not_override' => [
			'config' => [
				'use_excerpt' => false,
				'article_body' => true,
				'keywords' => false,
			],
			'schema_data' => [
				'@type' => 'Article',
				'articleBody' => 'Existing body',
			],
			'post_id' => 123,
			'expected_fields' => [
				'articleBody' => 'Existing body',
			],
		];

		yield 'keywords_enhancement_enabled_with_tags' => [
			'config' => [
				'use_excerpt' => false,
				'article_body' => false,
				'keywords' => true,
			],
			'schema_data' => [
				'@type' => 'Article',
			],
			'post_id' => 123,
			'expected_fields' => [
				'keywords' => 'tag1, tag2',
			],
		];

		yield 'keywords_with_existing_keywords_should_not_override' => [
			'config' => [
				'use_excerpt' => false,
				'article_body' => false,
				'keywords' => true,
			],
			'schema_data' => [
				'@type' => 'Article',
				'keywords' => 'existing, keywords',
			],
			'post_id' => 123,
			'expected_fields' => [
				'keywords' => 'existing, keywords',
			],
		];

		yield 'all_enhancements_enabled_with_no_existing_fields' => [
			'config' => [
				'use_excerpt' => true,
				'article_body' => true,
				'keywords' => true,
			],
			'schema_data' => [
				'@type' => 'Article',
			],
			'post_id' => 123,
			'expected_fields' => [
				'description' => 'Test excerpt',
				'articleBody' => 'Test content',
				'keywords' => 'test-tag',
			],
		];

		yield 'invalid_post_id_null' => [
			'config' => [
				'use_excerpt' => true,
				'article_body' => true,
				'keywords' => true,
			],
			'schema_data' => [
				'@type' => 'Article',
			],
			'post_id' => null,
			'expected_fields' => [],
		];

		yield 'invalid_post_id_zero' => [
			'config' => [
				'use_excerpt' => true,
				'article_body' => true,
				'keywords' => true,
			],
			'schema_data' => [
				'@type' => 'Article',
			],
			'post_id' => 0,
			'expected_fields' => [],
		];

		yield 'empty_excerpt_with_manual_preference' => [
			'config' => [
				'use_excerpt' => true,
				'article_body' => false,
				'keywords' => false,
			],
			'schema_data' => [
				'@type' => 'Article',
			],
			'post_id' => 123,
			'expected_fields' => [],
		];
	}

	/**
	 * Tests enhance_schema_piece method with various configurations using data provider.
	 *
	 * @dataProvider enhance_schema_piece_data_provider
	 *
	 * @covers ::enhance
	 * @covers ::enhance_schema_piece
	 * @covers ::get_excerpt
	 * @covers ::get_article_body
	 * @covers ::get_article_keywords
	 *
	 * @param array<string, bool> $config Configuration for enhancements.
	 * @param array<string, mixed> $schema_data Input schema data.
	 * @param int|null $post_id Post ID for testing.
	 * @param array<string, string> $expected_fields Expected output fields.
	 *
	 * @return void
	 */
	public function test_enhance_schema_piece_with_different_configurations( $config, $schema_data, $post_id, $expected_fields ) {
		$indexable = new Indexable_Mock();
		$indexable->object_id = $post_id;

		$schema_piece = new Schema_Piece( $schema_data, 'Article' );

		// Setup configuration mocks
		foreach ( $config as $enhancement => $enabled ) {
			$this->config->shouldReceive( 'is_enhancement_enabled' )
				->with( $enhancement )
				->andReturn( $enabled );
		}

		// Setup WordPress function mocks based on test case
		$this->setup_wordpress_mocks_for_test_case( $config, $expected_fields, $post_id );

		$result = $this->instance->enhance( $schema_piece, $indexable );
		$enhanced_data = $result->get_data();

		// Assert expected fields are present with correct values
		foreach ( $expected_fields as $field => $expected_value ) {
			$this->assertSame( $expected_value, $enhanced_data[$field], "Field {$field} should match expected value" );
		}

		// Assert fields that shouldn't be added are not present
		$all_possible_fields = [ 'description', 'articleBody', 'keywords' ];
		foreach ( $all_possible_fields as $field ) {
			if ( ! isset( $expected_fields[$field] ) && ! isset( $schema_data[$field] ) ) {
				$this->assertArrayNotHasKey( $field, $enhanced_data, "Field {$field} should not be present" );
			}
		}
	}

	/**
	 * Data provider for testing error conditions.
	 *
	 * @return Generator
	 */
	public static function error_conditions_data_provider(): Generator {
		yield 'excerpt_wp_error' => [
			'enhancement' => 'use_excerpt',
			'post_id' => 123,
			'mock_function' => 'get_post_field',
			'mock_params' => [ 'post_excerpt', 123 ],
			'mock_exception' => new \Exception( 'Database error' ),
			'expected_field_absent' => 'description',
		];

		yield 'article_body_wp_error' => [
			'enhancement' => 'article_body',
			'post_id' => 456,
			'mock_function' => 'get_post_field',
			'mock_params' => [ 'post_content', 456 ],
			'mock_exception' => new \Exception( 'Content fetch error' ),
			'expected_field_absent' => 'articleBody',
		];

		yield 'keywords_wp_error' => [
			'enhancement' => 'keywords',
			'post_id' => 789,
			'mock_function' => 'get_the_tags',
			'mock_params' => [ 789 ],
			'mock_exception' => new \Exception( 'Tags fetch error' ),
			'expected_field_absent' => 'keywords',
		];
	}

	/**
	 * Tests error handling in enhance_schema_piece method.
	 *
	 * @dataProvider error_conditions_data_provider
	 *
	 * @covers ::enhance
	 * @covers ::enhance_schema_piece
	 * @covers ::get_excerpt
	 * @covers ::get_article_body
	 * @covers ::get_article_keywords
	 *
	 * @param string $enhancement Enhancement to test.
	 * @param int $post_id Post ID for testing.
	 * @param string $mock_function Function to mock.
	 * @param array<mixed> $mock_params Parameters for the mock function.
	 * @param \Exception $mock_exception Exception to throw.
	 * @param string $expected_field_absent Field that should not be present.
	 *
	 * @return void
	 */
	public function test_enhance_schema_piece_error_handling( $enhancement, $post_id, $mock_function, $mock_params, $mock_exception, $expected_field_absent ) {
		$indexable = new Indexable_Mock();
		$indexable->object_id = $post_id;

		$schema_data = [
			'@type' => 'Article',
		];

		$schema_piece = new Schema_Piece( $schema_data, 'Article' );

		// Setup config to only enable the enhancement being tested
		$enhancements = [ 'use_excerpt', 'article_body', 'keywords' ];
		foreach ( $enhancements as $enh ) {
			$this->config->shouldReceive( 'is_enhancement_enabled' )
				->with( $enh )
				->andReturn( $enh === $enhancement );
		}

		// Setup the failing WordPress function
		Functions\expect( $mock_function )
			->with( ...$mock_params )
			->andThrow( $mock_exception );

		// Setup additional mocks for article body enhancement
		if ( $enhancement === 'article_body' ) {
			$this->config->shouldReceive( 'should_include_article_body' )
				->with( false )
				->andReturn( true );
		}

		$result = $this->instance->enhance( $schema_piece, $indexable );
		$enhanced_data = $result->get_data();

		// Assert the field is not added due to the error
		$this->assertArrayNotHasKey( $expected_field_absent, $enhanced_data );
		// Assert original schema data is preserved
		$this->assertSame( 'Article', $enhanced_data['@type'] );
	}

	/**
	 * Sets up WordPress function mocks for specific test cases.
	 *
	 * @param array<string, bool> $config Configuration settings.
	 * @param array<string, string> $expected_fields Expected output fields.
	 * @param int|null $post_id Post ID.
	 *
	 * @return void
	 */
	private function setup_wordpress_mocks_for_test_case( $config, $expected_fields, $post_id ) {
		// Handle excerpt mocks
		if ( $config['use_excerpt'] && isset( $expected_fields['description'] ) ) {
			Functions\expect( 'get_post_field' )
				->with( 'post_excerpt', $post_id )
				->andReturn( $expected_fields['description'] );

			Functions\expect( 'wp_strip_all_tags' )
				->with( $expected_fields['description'] )
				->andReturn( $expected_fields['description'] );

			$this->config->shouldReceive( 'get_config_value' )
				->with( 'excerpt_max_length', 0 )
				->andReturn( 0 );
		} elseif ( $config['use_excerpt'] && ! isset( $expected_fields['description'] ) ) {
			if ( $post_id === null || $post_id === 0 ) {
				Functions\expect( 'get_post_field' )
					->with( 'post_excerpt', $post_id )
					->andReturn( null );
			} else {
				// Test case for empty excerpt with manual preference
				Functions\expect( 'get_post_field' )
					->with( 'post_excerpt', $post_id )
					->andReturn( '' );

				$this->config->shouldReceive( 'get_config_value' )
					->with( 'excerpt_prefer_manual', false )
					->andReturn( true );
			}
		}

		// Handle article body mocks
		if ( $config['article_body'] && isset( $expected_fields['articleBody'] ) ) {
			$has_excerpt = isset( $expected_fields['description'] );

			$this->config->shouldReceive( 'should_include_article_body' )
				->with( $has_excerpt )
				->andReturn( true );

			Functions\expect( 'get_post_field' )
				->with( 'post_content', $post_id )
				->andReturn( 'Article content with <p>HTML</p>' );

			$this->config->shouldReceive( 'get_config_value' )
				->with( 'strip_shortcodes_from_body', true )
				->andReturn( true );

			Functions\expect( 'strip_shortcodes' )
				->with( 'Article content with <p>HTML</p>' )
				->andReturn( 'Article content with <p>HTML</p>' );

			$this->config->shouldReceive( 'get_config_value' )
				->with( 'strip_html_from_body', true )
				->andReturn( true );

			Functions\expect( 'wp_strip_all_tags' )
				->with( 'Article content with <p>HTML</p>' )
				->andReturn( $expected_fields['articleBody'] );

			$this->config->shouldReceive( 'get_config_value' )
				->with( 'article_body_max_length', Article_Config::DEFAULT_MAX_ARTICLE_BODY_LENGTH )
				->andReturn( 500 );
		} elseif ( $config['article_body'] && ! isset( $expected_fields['articleBody'] ) ) {
			$has_excerpt = isset( $expected_fields['description'] );

			$this->config->shouldReceive( 'should_include_article_body' )
				->with( $has_excerpt )
				->andReturn( true );

			if ( $post_id === null || $post_id === 0 ) {
				Functions\expect( 'get_post_field' )
					->with( 'post_content', $post_id )
					->andReturn( null );
			}
		}

		// Handle keywords mocks
		if ( $config['keywords'] && isset( $expected_fields['keywords'] ) ) {
			$keywords = explode( ', ', $expected_fields['keywords'] );
			$tag_objects = [];
			foreach ( $keywords as $keyword ) {
				$tag_objects[] = (object) [ 'name' => $keyword ];
			}

			Functions\expect( 'get_the_tags' )
				->with( $post_id )
				->andReturn( $tag_objects );

			$this->config->shouldReceive( 'get_config_value' )
				->with( 'categories_as_keywords', false )
				->andReturn( false );
		} elseif ( $config['keywords'] && ! isset( $expected_fields['keywords'] ) ) {
			if ( $post_id === null || $post_id === 0 ) {
				Functions\expect( 'get_the_tags' )
					->with( $post_id )
					->andReturn( null );

				$this->config->shouldReceive( 'get_config_value' )
					->with( 'categories_as_keywords', false )
					->andReturn( false );
			}
		}
	}
}

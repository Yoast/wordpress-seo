<?php
// phpcs:disable Yoast.NamingConventions.NamespaceName.TooLong -- Needed in the folder structure.
// phpcs:disable Yoast.NamingConventions.NamespaceName.MaxExceeded
namespace Yoast\WP\SEO\Tests\Unit\Schema_Aggregator\Application\Enhancement\Article_Schema_Enhancer;

use Brain\Monkey\Functions;
use Exception;
use Mockery;
use Yoast\WP\SEO\Schema_Aggregator\Infrastructure\Enhancement\Article_Config;
use Yoast\WP\SEO\Tests\Unit\Doubles\Models\Indexable_Mock;
use Yoast\WP\SEO\Tests\Unit\Doubles\Schema_Aggregator\Article_Schema_Enhancer_Double;

/**
 * Tests the Article_Schema_Enhancer class enhance method.
 *
 * @group schema-aggregator
 *
 * @coversDefaultClass \Yoast\WP\SEO\Schema_Aggregator\Application\Enhancement\Article_Schema_Enhancer
 */
final class Enhance_Schema_Piece_Test extends Abstract_Article_Schema_Enhancer_Test {

	/**
	 * The Article_Schema_Enhancer_Double
	 *
	 * @var Article_Schema_Enhancer_Double
	 */
	private $article_schema_enhancer_double;

	/**
	 * Sets up the test fixtures.
	 *
	 * @return void
	 */
	protected function set_up() {
		parent::set_up();
		$this->article_schema_enhancer_double = new Article_Schema_Enhancer_Double();
		$this->article_schema_enhancer_double->set_article_config( $this->config );
	}

	/**
	 * Tests that enhance_schema_piece correctly handles exceptions.
	 *
	 * @covers ::enhance_schema_piece
	 *
	 * @return void
	 */
	public function test_enhance_schema_piece_handles_exception() {
		$schema_data = [
			'@context'           => 'https://schema.org',
			'@type'              => 'Article',
			'@id'                => 'http://example.com/vision-oriented-systematic-toolset/#article',
			'author'             => [
				'name' => 'Myron Welch',
				'@id'  => 'http://example.com/#/schema/person/16d528091339c598c98aa254707c9b6b',
			],
			'headline'           => 'Vision-oriented systematic toolset',
			'datePublished'      => '2025-08-31T14:47:54+00:00',
			'wordCount'          => 184,
			'commentCount'       => 0,
			'publisher'          => [
				'@id' => 'http://example.com/#organization',
			],
			'image'              => [
				'@id' => 'http://example.com/vision-oriented-systematic-toolset/#primaryimage',
			],
			'thumbnailUrl'       => 'http://example.com/wp-content/uploads/2026/01/WordPress1.jpg',
			'keywords'           => [
				'Focused executive artificial intelligence',
				'Open-source bifurcated matrix',
			],
			'articleSection'     => [
				'Assimilated disintermediate moratorium',
				'Organized needs-based circuit',
			],
			'inLanguage'         => 'en-US',
			'description'        => 'Test description',
		];

		$indexable            = Mockery::mock( Indexable_Mock::class );
		$indexable->object_id = 123;

		$this->config
			->expects( 'is_enhancement_enabled' )
			->with( 'use_excerpt' )
			->andReturn( true );

		Functions\expect( 'get_post_field' )
			->with( 'post_excerpt', $indexable->object_id )
			->andThrow( new Exception( 'Dummy exception' ) );

		$data = $this->article_schema_enhancer_double->enhance_schema_piece( $schema_data, $indexable );

		$this->assertEquals( $schema_data, $data );
	}

	/**
	 * Tests the enhance_schema_piece method in case use_excerpt is true.
	 *
	 * @covers ::enhance_schema_piece
	 *
	 * @dataProvider enhance_schema_piece_use_excerpt_data_provider
	 *
	 * @param array<string, mixed> $schema_data     The schema piece data.
	 * @param string               $expected_result The expected behavior.
	 * @param string               $post_excerpt    The post excerpt.
	 *
	 * @return void
	 */
	public function test_enhance_schema_piece_use_excerpt( array $schema_data, string $expected_result, string $post_excerpt ) {

		$indexable            = Mockery::mock( Indexable_Mock::class );
		$indexable->object_id = 123;

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

		Functions\expect( 'get_post_field' )
			->with( 'post_excerpt', $indexable->object_id )
			->andReturn( $post_excerpt );

		Functions\expect( 'wp_strip_all_tags' )
			->with( 'The post excerpt' )
			->andReturn( $post_excerpt );

		$this->config
			->expects( 'get_config_value' )
			->with( 'excerpt_max_length', 0 )
			->andReturn( 0 );

		$data = $this->article_schema_enhancer_double->enhance_schema_piece( $schema_data, $indexable );
			$this->assertSame( $expected_result, $data );
	}

	/**
	 * Data provider for test_enhance_schema_piece_use_excerpt
	 *
	 * @return array<string, array<string, mixed>>
	 */
	public function enhance_schema_piece_use_excerpt_data_provider(): array {
		return [
			'with_existing_description' => [
				'schema_data'     => [
					'@context'           => 'https://schema.org',
					'@type'              => 'Article',
					'@id'                => 'https://example.com/article/#article',
					'headline'           => 'Test Article',
					'datePublished'      => '2025-08-31T14:47:54+00:00',
					'description'        => 'Existing description',
				],
				'expected_result' => [
					'@context'           => 'https://schema.org',
					'@type'              => 'Article',
					'@id'                => 'https://example.com/article/#article',
					'headline'           => 'Test Article',
					'datePublished'      => '2025-08-31T14:47:54+00:00',
					'description'        => 'Existing description',
				],
				'post_excerpt'    => 'The post excerpt',
			],
			'without_existing_description' => [
				'schema_data'     => [
					'@context'           => 'https://schema.org',
					'@type'              => 'Article',
					'@id'                => 'https://example.com/article/#article',
					'headline'           => 'Test Article',
					'datePublished'      => '2025-08-31T14:47:54+00:00',
				],
				'expected_result' => [
					'@context'           => 'https://schema.org',
					'@type'              => 'Article',
					'@id'                => 'https://example.com/article/#article',
					'headline'           => 'Test Article',
					'datePublished'      => '2025-08-31T14:47:54+00:00',
					'description'        => 'The post excerpt',
				],
				'post_excerpt'    => 'The post excerpt',
			],
		];
	}

	/**
	 * Tests the enhance_schema_piece method when article_body should be included.
	 *
	 * @covers ::enhance_schema_piece
	 *
	 * @return void
	 */
	public function test_enhance_schema_piece_article_body_should_include() {
		$schema_data = [
			'@context'      => 'https://schema.org',
			'@type'         => 'Article',
			'@id'           => 'https://example.com/article/#article',
			'headline'      => 'Test Article',
			'datePublished' => '2025-08-31T14:47:54+00:00',
		];

		$expected_result = [
			'@context'      => 'https://schema.org',
			'@type'         => 'Article',
			'@id'           => 'https://example.com/article/#article',
			'headline'      => 'Test Article',
			'datePublished' => '2025-08-31T14:47:54+00:00',
			'articleBody'   => 'This is the full article body content.',
		];

		$post_content = 'This is the full article body content.';

		$indexable            = Mockery::mock( Indexable_Mock::class );
		$indexable->object_id = 123;

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

		Functions\expect( 'get_post_field' )
			->with( 'post_content', $indexable->object_id )
			->andReturn( $post_content );

		$this->config
			->expects( 'get_config_value' )
			->with( 'strip_shortcodes_from_body', true )
			->andReturn( true );

		Functions\expect( 'strip_shortcodes' )
			->with( $post_content )
			->andReturn( $post_content );

		$this->config
			->expects( 'get_config_value' )
			->with( 'strip_html_from_body', true )
			->andReturn( true );

		Functions\expect( 'wp_strip_all_tags' )
			->with( $post_content )
			->andReturn( $post_content );

		$this->config
			->expects( 'get_config_value' )
			->with( 'article_body_max_length', Article_Config::DEFAULT_MAX_ARTICLE_BODY_LENGTH )
			->andReturn( 0 );

		$this->config
			->expects( 'is_enhancement_enabled' )
			->with( 'keywords' )
			->andReturn( false );

		$data = $this->article_schema_enhancer_double->enhance_schema_piece( $schema_data, $indexable );
		$this->assertSame( $expected_result, $data );
	}

	/**
	 * Tests the enhance_schema_piece method when article_body should not be included.
	 *
	 * @covers ::enhance_schema_piece
	 *
	 * @dataProvider enhance_schema_piece_article_body_skip_data_provider
	 *
	 * @param array<string, mixed> $schema_data               The schema piece data.
	 * @param array<string, mixed> $expected_result           The expected result.
	 * @param bool                 $has_existing_article_body Whether the schema already has articleBody.
	 *
	 * @return void
	 */
	public function test_enhance_schema_piece_article_body_skip( $schema_data, $expected_result, $has_existing_article_body ) {

		$indexable            = Mockery::mock( Indexable_Mock::class );
		$indexable->object_id = 123;

		$this->config
			->expects( 'is_enhancement_enabled' )
			->with( 'use_excerpt' )
			->andReturn( false );

		$this->config
			->expects( 'is_enhancement_enabled' )
			->with( 'article_body' )
			->andReturn( true );

		if ( ! $has_existing_article_body ) {
			$this->config
				->expects( 'should_include_article_body' )
				->with( false )
				->andReturn( false );
		}

		$this->config
			->expects( 'is_enhancement_enabled' )
			->with( 'keywords' )
			->andReturn( false );

		$data = $this->article_schema_enhancer_double->enhance_schema_piece( $schema_data, $indexable );
		$this->assertSame( $expected_result, $data );
	}

	/**
	 * Data provider for test_enhance_schema_piece_article_body_skip
	 *
	 * @return array<string, array<string, mixed>>
	 */
	public function enhance_schema_piece_article_body_skip_data_provider(): array {
		return [
			'with_existing_article_body' => [
				'schema_data'               => [
					'@context'      => 'https://schema.org',
					'@type'         => 'Article',
					'@id'           => 'https://example.com/article/#article',
					'headline'      => 'Test Article',
					'datePublished' => '2025-08-31T14:47:54+00:00',
					'articleBody'   => 'Existing article body',
				],
				'expected_result'           => [
					'@context'      => 'https://schema.org',
					'@type'         => 'Article',
					'@id'           => 'https://example.com/article/#article',
					'headline'      => 'Test Article',
					'datePublished' => '2025-08-31T14:47:54+00:00',
					'articleBody'   => 'Existing article body',
				],
				'has_existing_article_body' => true,
			],
			'without_existing_article_body_and_should_not_include' => [
				'schema_data'               => [
					'@context'      => 'https://schema.org',
					'@type'         => 'Article',
					'@id'           => 'https://example.com/article/#article',
					'headline'      => 'Test Article',
					'datePublished' => '2025-08-31T14:47:54+00:00',
				],
				'expected_result'           => [
					'@context'      => 'https://schema.org',
					'@type'         => 'Article',
					'@id'           => 'https://example.com/article/#article',
					'headline'      => 'Test Article',
					'datePublished' => '2025-08-31T14:47:54+00:00',
				],
				'has_existing_article_body' => false,
			],
		];
	}

	/**
	 * Tests the enhance_schema_piece method when keywords are already set.
	 *
	 * @covers ::enhance_schema_piece
	 *
	 * @return void
	 */
	public function test_enhance_schema_piece_keywords_already_set() {
		$schema_data = [
			'@context'      => 'https://schema.org',
			'@type'         => 'Article',
			'@id'           => 'https://example.com/article/#article',
			'headline'      => 'Test Article',
			'datePublished' => '2025-08-31T14:47:54+00:00',
			'keywords'      => 'Existing keywords',
		];

		$indexable            = Mockery::mock( Indexable_Mock::class );
		$indexable->object_id = 123;

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

		$data = $this->article_schema_enhancer_double->enhance_schema_piece( $schema_data, $indexable );
		$this->assertSame( $schema_data, $data );
	}

	/**
	 * Tests the enhance_schema_piece method for keywords enhancement.
	 *
	 * @covers ::enhance_schema_piece
	 *
	 * @dataProvider enhance_schema_piece_keywords_data_provider
	 *
	 * @param array<int, object>   $tags                   The tags assigned to the post.
	 * @param bool                 $categories_as_keywords Whether to include categories as keywords.
	 * @param array<int, object>   $categories             The categories assigned to the post.
	 * @param array<string, mixed> $expected_data          The expected enhanced schema data.
	 *
	 * @return void
	 */
	public function test_enhance_schema_piece_keywords( $tags, $categories_as_keywords, $categories, $expected_data ) {
		$schema_data = [
			'@context'      => 'https://schema.org',
			'@type'         => 'Article',
			'@id'           => 'https://example.com/article/#article',
			'headline'      => 'Test Article',
			'datePublished' => '2025-08-31T14:47:54+00:00',
		];

		$indexable            = Mockery::mock( Indexable_Mock::class );
		$indexable->object_id = 123;

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
			->with( $indexable->object_id )
			->andReturn( $tags );

		$this->config
			->expects( 'get_config_value' )
			->with( 'categories_as_keywords', false )
			->andReturn( $categories_as_keywords );

		if ( $categories_as_keywords ) {
			Functions\expect( 'get_the_category' )
				->with( $indexable->object_id )
				->andReturn( $categories );
		}

		$data = $this->article_schema_enhancer_double->enhance_schema_piece( $schema_data, $indexable );
		$this->assertSame( $expected_data, $data );
	}

	/**
	 * Data provider for test_enhance_schema_piece_keywords
	 *
	 * @return array<string, array<string, mixed>>
	 */
	public function enhance_schema_piece_keywords_data_provider(): array {
		return [
			'with_tags_and_categories_as_keywords'         => [
				'tags'                   => [
					(object) [ 'name' => 'Tag1' ],
					(object) [ 'name' => 'Tag2' ],
				],
				'categories_as_keywords' => true,
				'categories'             => [
					(object) [ 'name' => 'Category1' ],
					(object) [ 'name' => 'Category2' ],
				],
				'expected_data'          => [
					'@context'      => 'https://schema.org',
					'@type'         => 'Article',
					'@id'           => 'https://example.com/article/#article',
					'headline'      => 'Test Article',
					'datePublished' => '2025-08-31T14:47:54+00:00',
					'keywords'      => 'Tag1, Tag2, Category1, Category2',
				],
			],
			'with_tags_and_without_categories_as_keywords' => [
				'tags'                   => [
					(object) [ 'name' => 'Tag1' ],
					(object) [ 'name' => 'Tag2' ],
				],
				'categories_as_keywords' => false,
				'categories'             => [],
				'expected_data'          => [
					'@context'      => 'https://schema.org',
					'@type'         => 'Article',
					'@id'           => 'https://example.com/article/#article',
					'headline'      => 'Test Article',
					'datePublished' => '2025-08-31T14:47:54+00:00',
					'keywords'      => 'Tag1, Tag2',
				],
			],
			'without_tags_and_with_categories_as_keywords' => [
				'tags'                   => [],
				'categories_as_keywords' => true,
				'categories'             => [
					(object) [ 'name' => 'Category1' ],
					(object) [ 'name' => 'Category2' ],
				],
				'expected_data'          => [
					'@context'      => 'https://schema.org',
					'@type'         => 'Article',
					'@id'           => 'https://example.com/article/#article',
					'headline'      => 'Test Article',
					'datePublished' => '2025-08-31T14:47:54+00:00',
					'keywords'      => 'Category1, Category2',
				],
			],
			'without_tags_and_categories_as_keywords'      => [
				'tags'                   => [],
				'categories_as_keywords' => false,
				'categories'             => [],
				'expected_data'          => [
					'@context'      => 'https://schema.org',
					'@type'         => 'Article',
					'@id'           => 'https://example.com/article/#article',
					'headline'      => 'Test Article',
					'datePublished' => '2025-08-31T14:47:54+00:00',
				],
			],
		];
	}
}

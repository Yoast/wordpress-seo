<?php

namespace Yoast\WP\SEO\Tests\Generators\Schema;

use Brain\Monkey;
use Mockery;
use stdClass;
use Yoast\WP\SEO\Generators\Schema\Article;
use Yoast\WP\SEO\Helpers\Date_Helper;
use Yoast\WP\SEO\Helpers\Post_Helper;
use Yoast\WP\SEO\Helpers\Schema\Article_Helper;
use Yoast\WP\SEO\Helpers\Schema\HTML_Helper;
use Yoast\WP\SEO\Helpers\Schema\ID_Helper;
use Yoast\WP\SEO\Helpers\Schema\Language_Helper;
use Yoast\WP\SEO\Tests\Doubles\Context\Meta_Tags_Context_Mock;
use Yoast\WP\SEO\Tests\Doubles\Generators\Schema\Article_Double;
use Yoast\WP\SEO\Tests\Doubles\Models\Indexable_Mock;
use Yoast\WP\SEO\Tests\TestCase;

/**
 * Class Article_Test
 *
 * @group generators
 * @group schema
 *
 * @coversDefaultClass \Yoast\WP\SEO\Generators\Schema\Article
 * @covers ::<!public>
 */
class Article_Test extends TestCase {

	/**
	 * The article helper.
	 *
	 * @var Mockery\MockInterface|Article_Helper
	 */
	private $article;

	/**
	 * The date helper.
	 *
	 * @var Mockery\MockInterface|Date_Helper
	 */
	private $date;

	/**
	 * The instance to test.
	 *
	 * @var Article
	 */
	private $instance;

	/**
	 * The meta tags context object.
	 *
	 * @var Meta_Tags_Context_Mock
	 */
	private $context_mock;

	/**
	 * The ID helper.
	 *
	 * @var Mockery\MockInterface|ID_Helper
	 */
	private $id;

	/**
	 * The HTML helper.
	 *
	 * @var Mockery\MockInterface|HTML_Helper
	 */
	private $html;

	/**
	 * The post helper.
	 *
	 * @var Mockery\MockInterface|Post_Helper
	 */
	private $post;

	/**
	 * The language helper.
	 *
	 * @var Mockery\MockInterface|Language_Helper
	 */
	private $language;

	/**
	 * Sets up the tests.
	 */
	public function setUp() {
		$this->id                      = Mockery::mock( ID_Helper::class );
		$this->article                 = Mockery::mock( Article_Helper::class );
		$this->date                    = Mockery::mock( Date_Helper::class );
		$this->html                    = Mockery::mock( HTML_Helper::class );
		$this->post                    = Mockery::mock( Post_Helper::class );
		$this->language                = Mockery::mock( Language_Helper::class );
		$this->instance                = Mockery::mock( Article_Double::class )
			->makePartial()
			->shouldAllowMockingProtectedMethods();
		$this->context_mock            = new Meta_Tags_Context_Mock();
		$this->context_mock->indexable = new Indexable_Mock();
		$this->context_mock->post      = new stdClass();
		$this->context_mock->id        = 5;

		$this->instance->context = $this->context_mock;
		$this->instance->helpers = (object) [
			'date'   => $this->date,
			'post'   => $this->post,
			'schema' => (object) [
				'article'  => $this->article,
				'id'       => $this->id,
				'html'     => $this->html,
				'language' => $this->language,
			],
		];

		return parent::setUp();
	}

	/**
	 * Tests the if needed method.
	 *
	 * @covers ::is_needed
	 */
	public function test_is_needed() {
		$this->context_mock->indexable->object_type     = 'post';
		$this->context_mock->indexable->object_sub_type = 'article';
		$this->context_mock->site_represents            = 'person';
		$this->context_mock->canonical                  = 'https://permalink';

		$this->article->expects( 'is_article_post_type' )->with( 'article' )->andReturn( true );

		$this->assertTrue( $this->instance->is_needed() );
		$this->assertSame( $this->context_mock->main_schema_id, 'https://permalink#article' );
	}

	/**
	 * Tests the if needed method with no post.
	 *
	 * @covers ::is_needed
	 */
	public function test_is_needed_no_post() {
		$this->context_mock->indexable->object_type = 'home-page';
		$this->context_mock->main_schema_id         = 'https://permalink#should-not-change';

		$this->assertFalse( $this->instance->is_needed() );
		$this->assertSame( $this->context_mock->main_schema_id, 'https://permalink#should-not-change' );
	}

	/**
	 * Tests the if needed method with no article post type.
	 *
	 * @covers ::is_needed
	 */
	public function test_is_needed_no_article_post_type() {
		$this->context_mock->indexable->object_type     = 'post';
		$this->context_mock->indexable->object_sub_type = 'not-article';
		$this->context_mock->site_represents            = 'person';
		$this->context_mock->main_schema_id             = 'https://permalink#should-not-change';

		$this->article->expects( 'is_article_post_type' )->with( 'not-article' )->andReturn( false );

		$this->assertFalse( $this->instance->is_needed() );
		$this->assertSame( $this->context_mock->main_schema_id, 'https://permalink#should-not-change' );
	}

	/**
	 * Tests the if needed method when the site doesn't represent a person or organization.
	 *
	 * @covers ::is_needed
	 */
	public function test_is_needed_no_site_represents() {
		$this->context_mock->indexable->object_type = 'post';
		$this->context_mock->site_represents        = false;
		$this->context_mock->main_schema_id         = 'https://permalink#should-not-change';

		$this->assertFalse( $this->instance->is_needed() );
		$this->assertSame( $this->context_mock->main_schema_id, 'https://permalink#should-not-change' );
	}

	/**
	 * Tests the generate method.
	 *
	 * @param array   $values_to_test The values that need to vary in order to test all the paths.
	 * @param boolean $expected_value The expected generated article schema.
	 * @param string  $message        The message to show in case a test fails.
	 *
	 * @covers ::generate
	 * @covers ::add_image
	 * @covers ::add_keywords
	 * @covers ::add_sections
	 * @covers ::add_potential_action
	 *
	 * @dataProvider provider_for_generate
	 */
	public function test_generate( $values_to_test, $expected_value, $message ) {
		Monkey\Functions\expect( 'get_comment_count' )
			->once()
			->with( 5 )
			->andReturn( [ 'approved' => $values_to_test['approved_comments' ]] );

		Monkey\Functions\expect( 'comments_open' )
			->once()
			->with( 5 )
			->andReturn( $values_to_test['post_comment_status' ] === 'open' );

		$this->context_mock->canonical                 = 'https://permalink';
		$this->context_mock->has_image                 = true;
		$this->context_mock->post->post_author         = '3';
		$this->context_mock->post->post_date_gmt       = '2345-12-12 12:12:12';
		$this->context_mock->post->post_modified_gmt   = '2345-12-12 23:23:23';
		$this->context_mock->post->post_type           = 'my_awesome_post_type';
		$this->context_mock->post->comment_status      = $values_to_test['post_comment_status'];
		$this->context_mock->site_represents_reference = $values_to_test['site_represents_reference'];

		$this->id->expects( 'get_user_schema_id' )
			->once()
			->with( '3', $this->context_mock )
			->andReturn( 'https://permalink#author-id-hash' );

		$this->post->expects( 'get_post_title_with_fallback' )
			->once()
			->with( $this->context_mock->id )
			->andReturn( 'the-title </script><script>alert(0)</script><script>' ); // Script is here to test script injection.

		$this->html->expects( 'smart_strip_tags' )
			->once()
			->with( 'the-title </script><script>alert(0)</script><script>' )
			->andReturn( 'the-title' );

		$this->date
			->expects( 'format' )
			->once()
			->with( '2345-12-12 12:12:12' )
			->andReturn( '2345-12-12 12:12:12' );

		$this->date
			->expects( 'format' )
			->once()
			->with( '2345-12-12 23:23:23' )
			->andReturn( '2345-12-12 23:23:23' );

		Monkey\Filters\expectApplied( 'wpseo_schema_article_keywords_taxonomy' )
			->once()
			->with( 'post_tag' )
			->andReturn( 'post_tag' );

		$this->instance
			->expects( 'add_terms' )
			->with( $values_to_test['data_for_add_keywords'], 'keywords', 'post_tag' )
			->once()
			->andReturn( $values_to_test['data_for_add_keywords'] += [ 'keywords' => 'Tag1,Tag2' ] );

		Monkey\Filters\expectApplied( 'wpseo_schema_article_sections_taxonomy' )
			->once()
			->with( 'category' )
			->andReturn( 'category' );

		$this->instance
			->expects( 'add_terms' )
			->with( $values_to_test['data_for_add_sections'], 'articleSection', 'category' )
			->once()
			->andReturn( $values_to_test['data_for_add_sections'] += [ 'articleSection' => 'Category1' ] );

		$this->language->expects( 'add_piece_language' )
			->once()
			->andReturnUsing(
				function( $data ) {
					$data['inLanguage'] = 'language';

					return $data;
				}
			);

		Monkey\Functions\expect( 'post_type_supports' )
			->once()
			->with( $this->context_mock->post->post_type, 'comments' )
			->andReturn( $values_to_test['mock_value_post_type_supports'] );

		$this->assertEquals( $expected_value, $this->instance->generate(), $message );
	}

	/**
	 * Tests adding terms to the data array when the terms are a non-empty array.
	 *
	 * @covers ::add_terms
	 */
	public function test_add_terms_happy_path() {
		$terms = [
			(object) [ 'name' => 'Tag1' ],
			(object) [ 'name' => 'Tag2' ],
			(object) [ 'name' => 'Uncategorized' ],
		];

		Monkey\Functions\expect( 'get_the_terms' )
			->once()
			->with( $this->context_mock->id, 'post_tag' )
			->andReturn( $terms );

		Monkey\Functions\expect( 'wp_list_pluck' )
			->once()
			->with( \array_slice( $terms, 0, 2 ), 'name' )
			->andReturn( [ 'Tag1', 'Tag2' ] );

		$expected_value = [
			'data1'    => 1,
			'keywords' => 'Tag1,Tag2',
		];

		$this->assertEquals( $expected_value, $this->instance->add_terms( [ 'data1' => 1 ], 'keywords', 'post_tag' ) );
	}

	/**
	 * Tests adding terms to the data array when the terms are not an array.
	 *
	 * @covers ::add_terms
	 */
	public function test_add_terms_not_array() {
		$terms = 'the_terms';

		Monkey\Functions\expect( 'get_the_terms' )
			->once()
			->with( $this->context_mock->id, 'post_tag' )
			->andReturn( $terms );

		$expected_value = [ 'data1' => 1 ];

		$this->assertEquals( $expected_value, $this->instance->add_terms( [ 'data1' => 1 ], 'keywords', 'post_tag' ) );
	}

	/**
	 * Tests adding terms to the data array when the terms are an empty array.
	 *
	 * @covers ::add_terms
	 */
	public function test_add_terms_empty_array() {
		$terms = [];

		Monkey\Functions\expect( 'get_the_terms' )
			->once()
			->with( $this->context_mock->id, 'post_tag' )
			->andReturn( $terms );

		$expected_value = [ 'data1' => 1 ];

		$this->assertEquals( $expected_value, $this->instance->add_terms( [ 'data1' => 1 ], 'keywords', 'post_tag' ) );
	}

	/**
	 * Provides data to the generate test.
	 *
	 * @return array The data to use.
	 */
	public function provider_for_generate() {
		return [
			[
				'values_to_test' => [
					'site_represents_reference'     => false, // Whether the site represents a company/person.
					'mock_value_post_type_supports' => true, // Whether the post type supports a certain feature.
					'post_comment_status'           => 'open',
					'approved_comments'             => 7,
					'data_for_add_keywords'         => [
						'@type'            => 'Article',
						'@id'              => 'https://permalink#article',
						'isPartOf'         => [ '@id' => 'https://permalink#webpage' ],
						'author'           => [ '@id' => 'https://permalink#author-id-hash' ],
						'image'            => [ '@id' => 'https://permalink#primaryimage' ],
						'headline'         => 'the-title',
						'datePublished'    => '2345-12-12 12:12:12',
						'dateModified'     => '2345-12-12 23:23:23',
						'commentCount'     => 7,
						'mainEntityOfPage' => [ '@id' => 'https://permalink#webpage' ],
					],
					'data_for_add_sections'         => [
						'@type'            => 'Article',
						'@id'              => 'https://permalink#article',
						'isPartOf'         => [ '@id' => 'https://permalink#webpage' ],
						'author'           => [ '@id' => 'https://permalink#author-id-hash' ],
						'image'            => [ '@id' => 'https://permalink#primaryimage' ],
						'headline'         => 'the-title',
						'datePublished'    => '2345-12-12 12:12:12',
						'dateModified'     => '2345-12-12 23:23:23',
						'commentCount'     => 7,
						'mainEntityOfPage' => [ '@id' => 'https://permalink#webpage' ],
						'keywords'         => 'Tag1,Tag2',
					],
				],
				'expected_value' => [
					'@type'            => 'Article',
					'@id'              => 'https://permalink#article',
					'isPartOf'         => [ '@id' => 'https://permalink#webpage' ],
					'author'           => [ '@id' => 'https://permalink#author-id-hash' ],
					'image'            => [ '@id' => 'https://permalink#primaryimage' ],
					'headline'         => 'the-title',
					'datePublished'    => '2345-12-12 12:12:12',
					'dateModified'     => '2345-12-12 23:23:23',
					'commentCount'     => 7,
					'mainEntityOfPage' => [ '@id' => 'https://permalink#webpage' ],
					'keywords'         => 'Tag1,Tag2',
					'articleSection'   => 'Category1',
					'inLanguage'       => 'language',
					'potentialAction'  => [
						[
							'@type'  => 'CommentAction',
							'name'   => 'Comment',
							'target' => [
								'https://permalink#respond',
							],
						],
					],
				],
				'message'        => 'The site is not set to represent a company/person.',
			],
			[
				'values_to_test' => [
					'site_represents_reference'     => true,
					'mock_value_post_type_supports' => true,
					'post_comment_status'           => 'open',
					'approved_comments'             => 7,
					'data_for_add_keywords'         => [
						'@type'            => 'Article',
						'@id'              => 'https://permalink#article',
						'isPartOf'         => [ '@id' => 'https://permalink#webpage' ],
						'author'           => [ '@id' => 'https://permalink#author-id-hash' ],
						'image'            => [ '@id' => 'https://permalink#primaryimage' ],
						'headline'         => 'the-title',
						'datePublished'    => '2345-12-12 12:12:12',
						'dateModified'     => '2345-12-12 23:23:23',
						'commentCount'     => 7,
						'mainEntityOfPage' => [ '@id' => 'https://permalink#webpage' ],
						'publisher'        => true,
					],
					'data_for_add_sections'         => [
						'@type'            => 'Article',
						'@id'              => 'https://permalink#article',
						'isPartOf'         => [ '@id' => 'https://permalink#webpage' ],
						'author'           => [ '@id' => 'https://permalink#author-id-hash' ],
						'image'            => [ '@id' => 'https://permalink#primaryimage' ],
						'headline'         => 'the-title',
						'datePublished'    => '2345-12-12 12:12:12',
						'dateModified'     => '2345-12-12 23:23:23',
						'commentCount'     => 7,
						'mainEntityOfPage' => [ '@id' => 'https://permalink#webpage' ],
						'publisher'        => true,
						'keywords'         => 'Tag1,Tag2',
					],
				],
				'expected_value' => [
					'@type'            => 'Article',
					'@id'              => 'https://permalink#article',
					'isPartOf'         => [ '@id' => 'https://permalink#webpage' ],
					'author'           => [ '@id' => 'https://permalink#author-id-hash' ],
					'image'            => [ '@id' => 'https://permalink#primaryimage' ],
					'headline'         => 'the-title',
					'datePublished'    => '2345-12-12 12:12:12',
					'dateModified'     => '2345-12-12 23:23:23',
					'commentCount'     => 7,
					'mainEntityOfPage' => [ '@id' => 'https://permalink#webpage' ],
					'keywords'         => 'Tag1,Tag2',
					'articleSection'   => 'Category1',
					'inLanguage'       => 'language',
					'potentialAction'  => [
						[
							'@type'  => 'CommentAction',
							'name'   => 'Comment',
							'target' => [
								'https://permalink#respond',
							],
						],
					],
					'publisher'        => true,
				],
				'message'        => 'The site is set to represent a company/person.',
			],
			[
				'values_to_test' => [
					'site_represents_reference'     => false,
					'mock_value_post_type_supports' => false,
					'post_comment_status'           => 'open',
					'approved_comments'             => 7,
					'data_for_add_keywords'         => [
						'@type'            => 'Article',
						'@id'              => 'https://permalink#article',
						'isPartOf'         => [ '@id' => 'https://permalink#webpage' ],
						'author'           => [ '@id' => 'https://permalink#author-id-hash' ],
						'image'            => [ '@id' => 'https://permalink#primaryimage' ],
						'headline'         => 'the-title',
						'datePublished'    => '2345-12-12 12:12:12',
						'dateModified'     => '2345-12-12 23:23:23',
						'commentCount'     => 7,
						'mainEntityOfPage' => [ '@id' => 'https://permalink#webpage' ],
					],
					'data_for_add_sections'         => [
						'@type'            => 'Article',
						'@id'              => 'https://permalink#article',
						'isPartOf'         => [ '@id' => 'https://permalink#webpage' ],
						'author'           => [ '@id' => 'https://permalink#author-id-hash' ],
						'image'            => [ '@id' => 'https://permalink#primaryimage' ],
						'headline'         => 'the-title',
						'datePublished'    => '2345-12-12 12:12:12',
						'dateModified'     => '2345-12-12 23:23:23',
						'commentCount'     => 7,
						'mainEntityOfPage' => [ '@id' => 'https://permalink#webpage' ],
						'keywords'         => 'Tag1,Tag2',
					],
				],
				'expected_value' => [
					'@type'            => 'Article',
					'@id'              => 'https://permalink#article',
					'isPartOf'         => [ '@id' => 'https://permalink#webpage' ],
					'author'           => [ '@id' => 'https://permalink#author-id-hash' ],
					'image'            => [ '@id' => 'https://permalink#primaryimage' ],
					'headline'         => 'the-title',
					'datePublished'    => '2345-12-12 12:12:12',
					'dateModified'     => '2345-12-12 23:23:23',
					'commentCount'     => 7,
					'mainEntityOfPage' => [ '@id' => 'https://permalink#webpage' ],
					'keywords'         => 'Tag1,Tag2',
					'articleSection'   => 'Category1',
					'inLanguage'       => 'language',
				],
				'message'        => 'The post type does not support comments.',
			],
			[
				'values_to_test' => [
					'site_represents_reference'     => false,
					'mock_value_post_type_supports' => false,
					'post_comment_status'           => 'closed',
					'approved_comments'             => 7,
					'data_for_add_keywords'         => [
						'@type'            => 'Article',
						'@id'              => 'https://permalink#article',
						'isPartOf'         => [ '@id' => 'https://permalink#webpage' ],
						'author'           => [ '@id' => 'https://permalink#author-id-hash' ],
						'image'            => [ '@id' => 'https://permalink#primaryimage' ],
						'headline'         => 'the-title',
						'datePublished'    => '2345-12-12 12:12:12',
						'dateModified'     => '2345-12-12 23:23:23',
						'commentCount'     => 7,
						'mainEntityOfPage' => [ '@id' => 'https://permalink#webpage' ],
					],
					'data_for_add_sections'         => [
						'@type'            => 'Article',
						'@id'              => 'https://permalink#article',
						'isPartOf'         => [ '@id' => 'https://permalink#webpage' ],
						'author'           => [ '@id' => 'https://permalink#author-id-hash' ],
						'image'            => [ '@id' => 'https://permalink#primaryimage' ],
						'headline'         => 'the-title',
						'datePublished'    => '2345-12-12 12:12:12',
						'dateModified'     => '2345-12-12 23:23:23',
						'commentCount'     => 7,
						'mainEntityOfPage' => [ '@id' => 'https://permalink#webpage' ],
						'keywords'         => 'Tag1,Tag2',
					],
				],
				'expected_value' => [
					'@type'            => 'Article',
					'@id'              => 'https://permalink#article',
					'isPartOf'         => [ '@id' => 'https://permalink#webpage' ],
					'author'           => [ '@id' => 'https://permalink#author-id-hash' ],
					'image'            => [ '@id' => 'https://permalink#primaryimage' ],
					'headline'         => 'the-title',
					'datePublished'    => '2345-12-12 12:12:12',
					'dateModified'     => '2345-12-12 23:23:23',
					'commentCount'     => 7,
					'mainEntityOfPage' => [ '@id' => 'https://permalink#webpage' ],
					'keywords'         => 'Tag1,Tag2',
					'articleSection'   => 'Category1',
					'inLanguage'       => 'language',
				],
				'message'        => 'The comment status for the post is set to closed.',
			],
			[
				'values_to_test' => [
					'site_represents_reference'     => false,
					'mock_value_post_type_supports' => false,
					'post_comment_status'           => 'closed',
					'approved_comments'             => 0,
					'data_for_add_keywords'         => [
						'@type'            => 'Article',
						'@id'              => 'https://permalink#article',
						'isPartOf'         => [ '@id' => 'https://permalink#webpage' ],
						'author'           => [ '@id' => 'https://permalink#author-id-hash' ],
						'image'            => [ '@id' => 'https://permalink#primaryimage' ],
						'headline'         => 'the-title',
						'datePublished'    => '2345-12-12 12:12:12',
						'dateModified'     => '2345-12-12 23:23:23',
						'mainEntityOfPage' => [ '@id' => 'https://permalink#webpage' ],
					],
					'data_for_add_sections'         => [
						'@type'            => 'Article',
						'@id'              => 'https://permalink#article',
						'isPartOf'         => [ '@id' => 'https://permalink#webpage' ],
						'author'           => [ '@id' => 'https://permalink#author-id-hash' ],
						'image'            => [ '@id' => 'https://permalink#primaryimage' ],
						'headline'         => 'the-title',
						'datePublished'    => '2345-12-12 12:12:12',
						'dateModified'     => '2345-12-12 23:23:23',
						'mainEntityOfPage' => [ '@id' => 'https://permalink#webpage' ],
						'keywords'         => 'Tag1,Tag2',
					],
				],
				'expected_value' => [
					'@type'            => 'Article',
					'@id'              => 'https://permalink#article',
					'isPartOf'         => [ '@id' => 'https://permalink#webpage' ],
					'author'           => [ '@id' => 'https://permalink#author-id-hash' ],
					'image'            => [ '@id' => 'https://permalink#primaryimage' ],
					'headline'         => 'the-title',
					'datePublished'    => '2345-12-12 12:12:12',
					'dateModified'     => '2345-12-12 23:23:23',
					'mainEntityOfPage' => [ '@id' => 'https://permalink#webpage' ],
					'keywords'         => 'Tag1,Tag2',
					'articleSection'   => 'Category1',
					'inLanguage'       => 'language',
				],
				'message'        => 'The comment status for the post is set to closed.',
			],
		];
	}
}

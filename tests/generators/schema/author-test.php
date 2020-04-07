<?php

use Yoast\WP\SEO\Helpers\Image_Helper;
use Yoast\WP\SEO\Helpers\Schema\Article_Helper;
use Yoast\WP\SEO\Helpers\Schema;
use Yoast\WP\SEO\Tests\Mocks\Meta_Tags_Context;
use Yoast\WP\SEO\Tests\TestCase;
use Yoast\WP\SEO\Tests\Mocks\Author;

/**
 * Class Author_Test
 *
 * @group generators
 * @group schema
 *
 * @coversDefaultClass \Yoast\WP\SEO\Generators\Schema\Author
 */
class Author_Test extends TestCase {

	/**
	 * Holds the Schema ID helper.
	 *
	 * @var Schema\ID_Helper
	 */
	private $id;

	/**
	 * Holds the article helper.
	 *
	 * @var Article_Helper
	 */
	private $article;

	/**
	 * Holds the image helper.
	 *
	 * @var Image_Helper
	 */
	private $image;

	/**
	 * Holds the Schema image helper.
	 *
	 * @var Schema\Image_Helper
	 */
	private $schema_image;

	/**
	 * Holds the HTML helper.
	 *
	 * @var Schema\HTML_Helper
	 */
	private $html;

	/**
	 * Holds the meta tags context.
	 *
	 * @var Meta_Tags_Context
	 */
	private $meta_tags_context;

	/**
	 * Holds the author schema generator under test.
	 *
	 * @var Author
	 */
	private $instance;

	/**
	 * Mock Person schema piece.
	 *
	 * @var array
	 */
	private $person_data = [
		'@type'  => [
			'Person',
		],
		'@id'    => 'http://basic.wordpress.test/#/schema/person/a00dc884baa6bd52ebacc06cfd5aab21',
		'name'   => 'Ad Minnie',
		'image'  => [
			'@type'   => 'ImageObject',
			'@id'     => 'http://basic.wordpress.test/#personlogo',
			'url'     => 'http://2.gravatar.com/avatar/e64c7d89f26bd1972efa854d13d7dd61?s=96&d=mm&r=g',
			'caption' => 'Ad Minnie',
		],
		'sameAs' => [
			'https://facebook.example.org/admin',
			'https://instagram.example.org/admin',
			'https://linkedin.example.org/admin',
		],
	];

	/**
	 * Sets up the test.
	 */
	public function setUp() {
		parent::setUp();

		$this->article      = Mockery::mock( Article_Helper::class );
		$this->image        = Mockery::mock( Image_Helper::class );
		$this->schema_image = Mockery::mock( Schema\Image_Helper::class );
		$this->html         = Mockery::mock( Schema\HTML_Helper::class );
		$this->id           = Mockery::mock( Schema\ID_Helper::class );

		$this->meta_tags_context = new Meta_Tags_Context();

		$this->instance = Mockery::mock( Author::class )
			->shouldAllowMockingProtectedMethods()
			->makePartial();

		$this->instance->context = $this->meta_tags_context;
		$this->instance->helpers = (object) [
			'image'  => $this->image,
			'schema' => (object) [
				'article' => $this->article,
				'id'      => $this->id,
				'image'   => $this->schema_image,
				'html'    => $this->html,
			],
		];
	}

	/**
	 * Tests that the author gets a 'mainEntityOfPage' property pointing to the webpage Schema piece on the same page.
	 *
	 * @covers ::generate
	 * @covers ::determine_user_id
	 */
	public function test_generate_on_author_pages() {
		$user_id = 123;

		$this->instance->expects( 'build_person_data' )
			->once()
			->with( $user_id )
			->andReturn( $this->person_data );

		// Set up the context with values.
		$this->meta_tags_context->post = (object) [
			'post_author' => $user_id,
		];

		$this->meta_tags_context->indexable = (object) [
			'object_type' => 'user',
			'object_id'   => $user_id,
		];

		$this->meta_tags_context->canonical = 'http://basic.wordpress.test/author/admin/';

		Brain\Monkey\Filters\expectApplied( 'wpseo_schema_person_user_id' );

		$actual = $this->instance->generate();

		$this->assertArrayHasKey( 'mainEntityOfPage', $actual );
		$this->assertEquals( [ '@id' => 'http://basic.wordpress.test/author/admin/#webpage' ], $actual['mainEntityOfPage'] );
	}

	/**
	 * Tests that the author gets a 'mainEntityOfPage' property pointing to the webpage Schema piece on the same page.
	 *
	 * @covers ::generate
	 * @covers ::determine_user_id
	 */
	public function test_generate_on_posts() {
		$user_id = 123;

		$this->instance->expects( 'build_person_data' )
			->once()
			->with( $user_id )
			->andReturn( $this->person_data );

		// Set up the context with values.
		$this->meta_tags_context->post = (object) [
			'post_author' => $user_id,
		];

		$this->meta_tags_context->indexable = (object) [
			'object_type' => 'post',
			'object_id'   => 1234,
		];

		$this->meta_tags_context->canonical = 'http://basic.wordpress.test/author/admin/';

		Brain\Monkey\Filters\expectApplied( 'wpseo_schema_person_user_id' );

		$actual = $this->instance->generate();

		$this->assertSame( $this->person_data, $actual );
	}

	/**
	 * Tests that the author Schema piece is not output
	 * on non-user archives and non-posts.
	 *
	 * @covers ::generate
	 * @covers ::is_needed
	 */
	public function test_is_not_shown_when_filter_does_not_output_valid_user_id() {
		$user_id = 123;

		$this->instance->expects( 'build_person_data' )
			->never();

		// Set up the context with values.
		$this->meta_tags_context->post = (object) [
			'post_author' => $user_id,
		];

		$this->meta_tags_context->indexable = (object) [
			'object_type' => 'post',
			'object_id'   => 1234,
		];

		$this->meta_tags_context->canonical = 'http://basic.wordpress.test/author/admin/';

		Brain\Monkey\Filters\expectApplied( 'wpseo_schema_person_user_id' )
			->with( $user_id )
			->andReturn( 'not_a_valid_user_id' );

		$actual = $this->instance->generate();

		$this->assertFalse( $actual );
	}

	/**
	 * Tests that the author is not output when no user id could be determined.
	 *
	 * @covers ::generate
	 */
	public function test_not_generate_when_user_id_cannot_be_defined() {
		// Set up the context with values.
		$this->meta_tags_context->post = (object) [
			'post_author' => false,
		];

		$this->meta_tags_context->indexable = (object) [
			'object_type' => 'post',
			'object_id'   => 1234,
		];

		$this->meta_tags_context->canonical = 'http://basic.wordpress.test/author/admin/';

		Brain\Monkey\Filters\expectApplied( 'wpseo_schema_person_user_id' );

		$actual = $this->instance->generate();

		$this->assertFalse( $actual );
	}

	/**
	 * Tests that the author Schema piece is output when the page is a author archive page.
	 *
	 * @covers ::is_needed
	 */
	public function test_is_shown_when_on_author_page() {
		$user_id = 123;
		// Set up the context with values.
		$this->meta_tags_context->post = (object) [
			'post_author' => $user_id,
		];

		$this->meta_tags_context->indexable = (object) [
			'object_type' => 'user',
			'object_id'   => $user_id,
		];

		$this->assertTrue( $this->instance->is_needed() );
	}

	/**
	 * Tests that the author Schema piece is not output on a post
	 * authored by the person the website represents.
	 *
	 * @covers ::is_needed
	 */
	public function test_is_not_shown_when_on_post_and_site_represents_author() {
		$user_id         = 123;
		$object_sub_type = 'recipe';

		$this->article
			->expects( 'is_article_post_type' )
			->with( $object_sub_type )
			->andReturn( true );

		// Set up the context with values.
		$this->meta_tags_context->post = (object) [
			'post_author' => $user_id,
		];

		$this->meta_tags_context->indexable = (object) [
			'object_type'     => 'post',
			'object_sub_type' => $object_sub_type,
		];

		$this->meta_tags_context->site_represents = 'person';
		$this->meta_tags_context->site_user_id    = $user_id;

		$this->assertFalse( $this->instance->is_needed() );
	}

	/**
	 * Tests that the author Schema piece is output on a post and the site is represented by an organization.
	 *
	 * @covers ::is_needed
	 */
	public function test_is_shown_when_on_post_site_organization() {
		$user_id         = 123;
		$object_sub_type = 'post';

		$this->article
			->expects( 'is_article_post_type' )
			->with( $object_sub_type )
			->andReturn( true );

		// Set up the context with values.
		$this->meta_tags_context->post = (object) [
			'post_author' => $user_id,
		];

		$this->meta_tags_context->indexable = (object) [
			'object_type'     => 'post',
			'object_sub_type' => $object_sub_type,
		];

		$this->meta_tags_context->site_represents = 'organization';
		$this->meta_tags_context->site_user_id    = $user_id;

		$this->assertTrue( $this->instance->is_needed() );
	}

	/**
	 * Tests that the author Schema piece is not output
	 * on non-user archives and non-posts.
	 *
	 * @covers ::is_needed
	 */
	public function test_is_not_shown_when_not_a_user_or_post_type() {
		$user_id         = 123;
		$other_user_id   = 404;
		$object_sub_type = null;

		// Set up the context with values.
		$this->meta_tags_context->post = (object) [
			'post_author' => $user_id,
		];

		$this->meta_tags_context->indexable = (object) [
			'object_type'     => 'home-page',
			'object_sub_type' => $object_sub_type,
		];

		$this->meta_tags_context->site_user_id = $other_user_id;

		$this->assertFalse( $this->instance->is_needed() );
	}
}

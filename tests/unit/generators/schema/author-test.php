<?php

namespace Yoast\WP\SEO\Tests\Unit\Generators\Schema;

use Brain\Monkey\Expectation\Exception\ExpectationArgsRequired;
use Brain\Monkey\Filters;
use Brain\Monkey\Functions;
use Mockery;
use Yoast\WP\SEO\Config\Schema_IDs;
use Yoast\WP\SEO\Helpers\Image_Helper;
use Yoast\WP\SEO\Helpers\Options_Helper;
use Yoast\WP\SEO\Helpers\Schema;
use Yoast\WP\SEO\Helpers\Schema\Article_Helper;
use Yoast\WP\SEO\Helpers\User_Helper;
use Yoast\WP\SEO\Tests\Unit\Doubles\Context\Meta_Tags_Context_Mock;
use Yoast\WP\SEO\Tests\Unit\Doubles\Generators\Schema\Author_Mock;
use Yoast\WP\SEO\Tests\Unit\Doubles\Models\Indexable_Mock;
use Yoast\WP\SEO\Tests\Unit\TestCase;

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
	 * Holds the options helper.
	 *
	 * @var Options_Helper
	 */
	private $options;

	/**
	 * Holds the user helper.
	 *
	 * @var User_Helper
	 */
	private $user;

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
	 * @var Meta_Tags_Context_Mock
	 */
	private $meta_tags_context;

	/**
	 * Holds the author schema generator under test.
	 *
	 * @var Author_Mock
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
			'@id'     => 'http://basic.wordpress.test/#schema/person/image/9d85080a5fb7722f56e19d45349a9606',
			'url'     => 'http://2.gravatar.com/avatar/e64c7d89f26bd1972efa854d13d7dd61?s=96&d=mm&r=g',
			'caption' => 'Ad Minnie',
		],
		'url'    => 'http://basic.wordpress.test/author/admin/',
		'sameAs' => [
			'https://piet.blog/',
			'https://facebook.example.org/admin',
			'https://instagram.example.org/admin',
			'https://linkedin.example.org/admin',
		],
	];

	/**
	 * Sets up the test.
	 */
	protected function set_up() {
		parent::set_up();

		$this->article      = Mockery::mock( Article_Helper::class );
		$this->image        = Mockery::mock( Image_Helper::class );
		$this->options      = Mockery::mock( Options_Helper::class );
		$this->user         = Mockery::mock( User_Helper::class );
		$this->schema_image = Mockery::mock( Schema\Image_Helper::class );
		$this->html         = Mockery::mock( Schema\HTML_Helper::class );
		$this->id           = Mockery::mock( Schema\ID_Helper::class );


		$this->meta_tags_context = new Meta_Tags_Context_Mock();

		$this->instance = Mockery::mock( Author_Mock::class )
			->shouldAllowMockingProtectedMethods()
			->makePartial();

		$this->instance->context = $this->meta_tags_context;
		$this->instance->helpers = (object) [
			'image'   => $this->image,
			'options' => $this->options,
			'user'    => $this->user,
			'schema'  => (object) [
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

		Filters\expectApplied( 'wpseo_schema_person_user_id' );

		$actual = $this->instance->generate();

		$this->assertArrayHasKey( 'mainEntityOfPage', $actual );
		$this->assertEquals( [ '@id' => 'http://basic.wordpress.test/author/admin/#webpage' ], $actual['mainEntityOfPage'] );
	}

	/**
	 * Tests that the author schema is correct on a post.
	 *
	 * @covers ::generate
	 * @covers ::determine_user_id
	 */
	public function test_generate_on_posts() {
		$user_id = 123;

		$this->instance->context->site_represents = 'organization';

		$this->instance->expects( 'build_person_data' )
			->once()
			->with( $user_id )
			->andReturn( $this->person_data );

		$this->options->expects( 'get' )
			->once()
			->with( 'disable-author' )
			->andReturnFalse();

		$this->user->expects( 'get_the_author_posts_url' )
			->once()
			->with( $user_id )
			->andReturn( 'http://basic.wordpress.test/author/admin/' );

		// Set up the context with values.
		$this->meta_tags_context->post = (object) [
			'post_author' => $user_id,
		];

		$this->meta_tags_context->indexable = (object) [
			'object_type' => 'post',
			'object_id'   => 1234,
		];

		Filters\expectApplied( 'wpseo_schema_person_user_id' );

		$actual = $this->instance->generate();

		$this->assertSame( $this->person_data, $actual );
	}

	/**
	 * Tests that the author gets generated properly when
	 * the site does not represent the author.
	 *
	 * @covers ::generate
	 * @covers ::determine_user_id
	 */
	public function test_generate_on_posts_when_site_does_not_represent_author() {
		$user_id         = 123;
		$object_type     = 'post';
		$object_sub_type = 'post';
		$object_id       = 1234;
		$user_data       = (object) [
			'ID'           => $user_id,
			'display_name' => $this->person_data['name'],
			'user_email'   => 'bla@example.org',
			'user_url'     => 'https://piet.blog/',
		];

		$this->instance->context->site_represents = 'person';

		// Set up the context with values.
		$this->meta_tags_context->post = (object) [
			'post_author' => $user_id,
		];

		$this->meta_tags_context->indexable = (object) [
			'object_type'     => $object_type,
			'object_sub_type' => $object_sub_type,
			'object_id'       => $object_id,
			'author_id'       => $user_id,
		];

		$this->meta_tags_context->site_user_id = 897;

		// WordPress function mocks.
		Functions\expect( 'get_userdata' )
			->with( $this->instance->context->indexable->object_id )
			->andReturn( $user_data );

		Functions\expect( 'get_option' )
			->with( 'show_avatars' )
			->andReturnTrue();

		Functions\expect( 'get_avatar_url' )
			->with( $user_data->user_email )
			->andReturn( $this->person_data['image']['url'] );

		$this->expect_socials(
			$user_id,
			[
				'facebook'  => 'https://facebook.example.org/admin',
				'instagram' => 'https://instagram.example.org/admin',
				'linkedin'  => 'https://linkedin.example.org/admin',
			]
		);

		// Helper mocks.
		$this->id
			->expects( 'get_user_schema_id' )
			->with( $user_id, $this->instance->context )
			->andReturn( $this->person_data['@id'] );

		$this->html
			->expects( 'smart_strip_tags' )
			->andReturnArg( 0 );

		$this->article
			->expects( 'is_author_supported' )
			->with( $object_sub_type )
			->twice()
			->andReturn( true );

		$this->schema_image
			->expects( 'simple_image_object' )
			->with( '#/schema/person/image/', $this->person_data['image']['url'], $user_data->display_name )
			->andReturn( $this->person_data['image'] );

		$this->options->expects( 'get' )
			->once()
			->with( 'disable-author' )
			->andReturnFalse();

		$this->user->expects( 'get_the_author_posts_url' )
			->once()
			->with( $user_id )
			->andReturn( 'http://basic.wordpress.test/author/admin/' );

		Filters\expectApplied( 'wpseo_schema_person_user_id' );

		$actual = $this->instance->generate();

		$this->assertEquals( $this->person_data, $actual );
	}

	/**
	 * Define expectations for socials.
	 *
	 * @param int   $user_id    The user id.
	 * @param array $site_array The array of socials, mapping social site name to URL.
	 *
	 * @throws ExpectationArgsRequired When args missing / wrong.
	 */
	private function expect_socials( $user_id, $site_array ) {
		Filters\expectApplied( 'wpseo_schema_person_social_profiles' )
			->andReturn( \array_keys( $site_array ) );

		foreach ( $site_array as $site => $value ) {
			Functions\expect( 'get_the_author_meta' )
				->with( $site, $user_id )
				->once()
				->andReturn( $value );
		}
	}

	/**
	 * Tests set_image_from_options when the site represents the current author.
	 *
	 * @covers ::generate
	 * @covers ::set_image_from_options
	 */
	public function test_set_image_from_options_when_site_represents_current_author() {
		$user_data                                       = (object) [
			'display_name' => 'Piet',
			'user_url'     => 'https://piet.blog/',
		];
		$this->instance->context->site_user_id           = 123;
		$this->instance->context->site_url               = 'http://example.com';
		$this->instance->context->site_represents        = 'person';
		$this->instance->context->person_logo_meta       = [
			'height' => 100,
			'width'  => 100,
			'url'    => 'http://example.com/image.png',
		];
		$this->instance->context->indexable              = new Indexable_Mock();
		$this->instance->context->indexable->object_type = 'user';
		$this->instance->context->indexable->object_id   = 123;

		Functions\expect( 'get_userdata' )
			->with( $this->instance->context->indexable->object_id )
			->andReturn( $user_data );

		Filters\expectApplied( 'wpseo_schema_person_social_profiles' )
			->andReturn( [] );

		$this->set_helpers_expectations( $user_data );

		$data = $this->instance->generate();

		$this->assertSame( 'our_image_schema', $data['image'] );
	}

	/**
	 * Tests the generated type when the site represents the current author.
	 *
	 * @covers ::generate
	 */
	public function test_generate_type_when_site_represents_current_author() {
		$user_data                                       = (object) [
			'display_name' => 'Piet',
			'user_url'     => 'https://piet.blog/',
		];
		$this->instance->context->site_user_id           = 123;
		$this->instance->context->site_url               = 'http://example.com';
		$this->instance->context->site_represents        = 'person';
		$this->instance->context->person_logo_meta       = [
			'height' => 100,
			'width'  => 100,
			'url'    => 'http://example.com/image.png',
		];
		$this->instance->context->indexable              = new Indexable_Mock();
		$this->instance->context->indexable->object_type = 'user';
		$this->instance->context->indexable->object_id   = 123;

		Functions\expect( 'get_userdata' )
			->with( $this->instance->context->indexable->object_id )
			->andReturn( $user_data );

		Filters\expectApplied( 'wpseo_schema_person_social_profiles' )
			->andReturn( [] );

		$this->set_helpers_expectations( $user_data );

		$data = $this->instance->generate();

		$this->assertSame( [ 'Person', 'Organization' ], $data['@type'] );
	}

	/**
	 * Sets expectations on the helpers.
	 *
	 * @param object $user_data The user data object.
	 */
	private function set_helpers_expectations( $user_data ) {
		$this->id
			->expects( 'get_user_schema_id' )
			->with( $this->instance->context->indexable->object_id, $this->instance->context )
			->andReturn( 'user_schema_id' );

		$this->html
			->expects( 'smart_strip_tags' )
			->with( $user_data->display_name )
			->andReturn( $user_data->display_name );

		$this->schema_image
			->expects( 'generate_from_attachment_meta' )
			->with(
				$this->instance->context->site_url . Schema_IDs::PERSON_LOGO_HASH,
				[
					'height' => 100,
					'width'  => 100,
					'url'    => 'http://example.com/image.png',
				],
				$user_data->display_name
			)
			->andReturn( 'our_image_schema' );
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

		Filters\expectApplied( 'wpseo_schema_person_user_id' )
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

		Filters\expectApplied( 'wpseo_schema_person_user_id' );

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
	 * Tests that the author Schema piece is output on a post and the site is represented by an organization.
	 *
	 * @covers ::is_needed
	 */
	public function test_is_shown_when_on_post_site_organization() {
		$user_id         = 123;
		$object_sub_type = 'post';

		$this->article
			->expects( 'is_author_supported' )
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

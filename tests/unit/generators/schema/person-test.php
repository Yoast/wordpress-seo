<?php

namespace Yoast\WP\SEO\Tests\Unit\Generators\Schema;

use Brain\Monkey\Filters;
use Brain\Monkey\Functions;
use Mockery;
use Yoast\WP\SEO\Config\Schema_IDs;
use Yoast\WP\SEO\Generators\Schema\Person;
use Yoast\WP\SEO\Helpers\Image_Helper;
use Yoast\WP\SEO\Helpers\Schema\Article_Helper;
use Yoast\WP\SEO\Helpers\Schema\HTML_Helper;
use Yoast\WP\SEO\Helpers\Schema\ID_Helper;
use Yoast\WP\SEO\Helpers\Schema\Image_Helper as Schema_Image_Helper;
use Yoast\WP\SEO\Tests\Unit\Doubles\Context\Meta_Tags_Context_Mock;
use Yoast\WP\SEO\Tests\Unit\Doubles\Models\Indexable_Mock;
use Yoast\WP\SEO\Tests\Unit\TestCase;

/**
 * Class Person_Test,
 *
 * @group generators
 * @group schema
 *
 * @coversDefaultClass \Yoast\WP\SEO\Generators\Schema\Person
 */
class Person_Test extends TestCase {

	/**
	 * The instance to test.
	 *
	 * @var Person
	 */
	protected $instance;

	/**
	 * The social profiles. Should be a copy of $social_profiles in Person.
	 *
	 * @var string[]
	 */
	protected $social_profiles = [
		'facebook',
		'instagram',
		'linkedin',
		'pinterest',
		'twitter',
		'myspace',
		'youtube',
		'soundcloud',
		'tumblr',
		'wikipedia',
	];

	/**
	 * Initializes the test environment.
	 */
	protected function set_up() {
		parent::set_up();

		$this->instance                     = new Person();
		$this->instance->context            = new Meta_Tags_Context_Mock();
		$this->instance->context->indexable = new Indexable_Mock();
		$this->instance->helpers            = (object) [
			'image'  => Mockery::mock( Image_Helper::class ),
			'schema' => (object) [
				'article' => Mockery::mock( Article_Helper::class ),
				'id'      => Mockery::mock( ID_Helper::class ),
				'image'   => Mockery::mock( Schema_Image_Helper::class ),
				'html'    => Mockery::mock( HTML_Helper::class ),
			],
		];
	}

	/**
	 * Tests whether generate returns the expected schema.
	 *
	 * @covers ::generate
	 * @covers ::determine_user_id
	 * @covers ::build_person_data
	 * @covers ::add_image
	 * @covers ::set_image_from_options
	 * @covers ::set_image_from_avatar
	 * @covers ::get_social_profiles
	 * @covers ::url_social_site
	 */
	public function test_generate_happy_path() {
		$this->instance->context->site_user_id     = 1337;
		$this->instance->context->site_url         = 'https://example.com/';
		$this->instance->context->site_represents  = 'person';
		$this->instance->context->person_logo_meta = [
			'height' => 100,
			'width'  => 100,
			'url'    => 'http://example.com/image.png',
		];

		$user_data             = (object) [
			'display_name' => 'John',
			'description'  => 'Description',
		];
		$person_schema_logo_id = $this->instance->context->site_url . Schema_IDs::PERSON_LOGO_HASH;
		$image_schema          = [
			'@type'      => 'ImageObject',
			'@id'        => $person_schema_logo_id,
			'inLanguage' => 'en-US',
			'url'        => 'https://example.com/image.png',
			'width'      => 64,
			'height'     => 128,
			'caption'    => 'Person image',
		];

		$expected = [
			'@type'       => [ 'Person', 'Organization' ],
			'@id'         => 'person_id',
			'name'        => 'John',
			'logo'        => [ '@id' => 'https://example.com/' . Schema_IDs::PERSON_LOGO_HASH ],
			'description' => 'Description',
			'sameAs'      => [
				'https://example.com/social/facebook',
				'https://example.com/social/instagram',
				'https://example.com/social/linkedin',
				'https://example.com/social/pinterest',
				'https://twitter.com/https://example.com/social/twitter',
				'https://example.com/social/myspace',
				'https://example.com/social/youtube',
				'https://example.com/social/soundcloud',
				'https://example.com/social/tumblr',
				'https://example.com/social/wikipedia',
			],
			'image'       => $image_schema,
		];

		$this->expects_for_determine_user_id();
		$this->expects_for_get_userdata( $user_data );

		$this->instance->helpers->schema->image->expects( 'generate_from_attachment_meta' )
			->once()
			->with( $person_schema_logo_id, $this->instance->context->person_logo_meta, $user_data->display_name )
			->andReturn( $image_schema );

		$this->expects_for_social_profiles( $this->social_profiles );

		$this->assertEquals( $expected, $this->instance->generate( $this->instance->context ) );
	}

	/**
	 * Tests whether generate returns false when no user id could be determined.
	 *
	 * @covers ::generate
	 * @covers ::determine_user_id
	 */
	public function test_generate_no_user_id() {
		$this->instance->context->site_user_id = 1337;

		$this->expects_for_determine_user_id( 'false' );

		$this->assertFalse( $this->instance->generate( $this->instance->context ) );
	}

	/**
	 * Tests whether generate returns false when no user id 0 was determined.
	 *
	 * @covers ::generate
	 * @covers ::determine_user_id
	 */
	public function test_generate_user_id_zero() {
		$this->instance->context->site_user_id = 1337;

		$this->expects_for_determine_user_id( 'zero' );

		$this->assertFalse( $this->instance->generate( $this->instance->context ) );
	}

	/**
	 * Tests whether generate returns the expected schema without userdata.
	 *
	 * @covers ::generate
	 * @covers ::determine_user_id
	 * @covers ::build_person_data
	 */
	public function test_generate_without_userdata() {
		$this->instance->context->site_user_id = 1337;

		$expected = [
			'@type' => [ 'Person', 'Organization' ],
			'@id'   => 'person_id',
		];

		$this->expects_for_determine_user_id();
		$this->expects_for_get_userdata( false );

		$this->assertEquals( $expected, $this->instance->generate( $this->instance->context ) );
	}

	/**
	 * Tests whether generate returns the expected schema without a user description or social profiles.
	 *
	 * @covers ::generate
	 * @covers ::determine_user_id
	 * @covers ::build_person_data
	 * @covers ::add_image
	 * @covers ::set_image_from_options
	 * @covers ::set_image_from_avatar
	 * @covers ::get_social_profiles
	 */
	public function test_generate_without_user_description_or_social_profiles() {
		$this->instance->context->site_user_id    = 1337;
		$this->instance->context->site_url        = 'https://example.com/';
		$this->instance->context->site_represents = false;

		$user_data = (object) [
			'display_name' => 'John',
			'description'  => '',
		];

		$expected = [
			'@type' => [ 'Person', 'Organization' ],
			'@id'   => 'person_id',
			'name'  => 'John',
			'logo'  => [ '@id' => 'https://example.com/#/schema/person/image/' ],
		];

		$this->expects_for_determine_user_id();
		$this->expects_for_get_userdata( $user_data );
		$this->expects_for_social_profiles( [] );

		$this->assertEquals( $expected, $this->instance->generate( $this->instance->context ) );
	}

	/**
	 * Tests whether generate returns the expected schema with an image from an avatar.
	 *
	 * @covers ::generate
	 * @covers ::determine_user_id
	 * @covers ::build_person_data
	 * @covers ::add_image
	 * @covers ::set_image_from_avatar
	 * @covers ::get_social_profiles
	 */
	public function test_generate_image_from_avatar() {
		$this->instance->context->site_user_id    = 1337;
		$this->instance->context->site_url        = 'https://example.com/';
		$this->instance->context->site_represents = false;

		$user_data = (object) [
			'display_name' => 'John Doe',
			'description'  => '',
			'user_email'   => 'johndoe@example.com',
		];

		$this->expects_for_determine_user_id();
		$this->expects_for_get_userdata( $user_data );
		$image_schema = $this->expects_for_set_image_from_avatar( $user_data );
		$this->expects_for_social_profiles( [] );

		$expected = [
			'@type' => [ 'Person', 'Organization' ],
			'@id'   => 'person_id',
			'name'  => $user_data->display_name,
			'logo'  => [ '@id' => 'https://example.com/#/schema/person/image/' ],
			'image' => $image_schema,
		];

		$this->assertEquals( $expected, $this->instance->generate( $this->instance->context ) );
	}

	/**
	 * Tests whether generate returns the expected schema with an invalid avatar url.
	 *
	 * @covers ::generate
	 * @covers ::determine_user_id
	 * @covers ::build_person_data
	 * @covers ::add_image
	 * @covers ::set_image_from_avatar
	 * @covers ::get_social_profiles
	 */
	public function test_generate_invalid_avatar_url() {
		$this->instance->context->site_user_id    = 1337;
		$this->instance->context->site_url        = 'https://example.com/';
		$this->instance->context->site_represents = false;

		$user_data = (object) [
			'display_name' => 'John Doe',
			'description'  => '',
			'user_email'   => 'johndoe@example.com',
		];

		$expected = [
			'@type' => [ 'Person', 'Organization' ],
			'@id'   => 'person_id',
			'name'  => 'John Doe',
			'logo'  => [ '@id' => 'https://example.com/#/schema/person/image/' ],
		];

		$this->expects_for_determine_user_id();
		$this->expects_for_get_userdata( $user_data );
		$this->expects_for_set_image_from_avatar( $user_data, 'empty_avatar_url' );
		$this->expects_for_social_profiles( [] );

		$this->assertEquals( $expected, $this->instance->generate( $this->instance->context ) );
	}

	/**
	 * Tests whether generate returns the expected schema when social profiles are not an array.
	 *
	 * @covers ::generate
	 * @covers ::determine_user_id
	 * @covers ::build_person_data
	 * @covers ::add_image
	 * @covers ::set_image_from_options
	 * @covers ::set_image_from_avatar
	 * @covers ::get_social_profiles
	 */
	public function test_generate_social_profiles_non_array() {
		$this->instance->context->site_user_id    = 1337;
		$this->instance->context->site_url        = 'https://example.com/';
		$this->instance->context->site_represents = false;

		$user_data = (object) [
			'display_name' => 'John Doe',
			'description'  => '',
		];

		$expected = [
			'@type' => [ 'Person', 'Organization' ],
			'@id'   => 'person_id',
			'name'  => 'John Doe',
			'logo'  => [ '@id' => 'https://example.com/#/schema/person/image/' ],
		];

		$this->expects_for_determine_user_id();
		$this->expects_for_get_userdata( $user_data );
		$this->expects_for_social_profiles( 'this is not an array' );

		$this->assertEquals( $expected, $this->instance->generate( $this->instance->context ) );
	}

	/**
	 * Tests whether generate returns the expected schema when social profiles contain non string or falsy values.
	 *
	 * @covers ::generate
	 * @covers ::determine_user_id
	 * @covers ::build_person_data
	 * @covers ::add_image
	 * @covers ::set_image_from_options
	 * @covers ::set_image_from_avatar
	 * @covers ::get_social_profiles
	 * @covers ::url_social_site
	 */
	public function test_generate_social_profiles_non_string_or_falsy_values() {
		$this->instance->context->site_user_id    = 1337;
		$this->instance->context->site_url        = 'https://example.com/';
		$this->instance->context->site_represents = false;

		$user_data = (object) [
			'ID'           => 4,
			'display_name' => 'John Doe',
			'description'  => '',
		];

		$expected = [
			'@type'  => [ 'Person', 'Organization' ],
			'@id'    => 'person_id',
			'name'   => 'John Doe',
			'logo'   => [ '@id' => 'https://example.com/#/schema/person/image/' ],
			'sameAs' => [
				'https://example.com/social/facebook',
				'https://example.com/social/wiki',
			],
		];

		$this->expects_for_determine_user_id();
		$this->expects_for_get_userdata( $user_data );
		$this->expects_for_social_profiles(
			[
				'facebook'  => 'facebook',
				'instagram' => 1234,
				'youtube'   => false,
				'wikipedia' => 'wiki',
			]
		);

		$this->assertEquals( $expected, $this->instance->generate( $this->instance->context ) );
	}

	/**
	 * Tests whether the person Schema piece is shown when the site represents a person.
	 *
	 * @covers ::is_needed
	 * @covers ::site_represents_current_author
	 */
	public function test_is_shown_when_site_represents_person() {
		$this->instance->context->site_represents = 'person';

		$this->assertTrue( $this->instance->is_needed( $this->instance->context ) );
	}

	/**
	 * Tests whether the person Schema piece is shown on author archive pages.
	 *
	 * @covers ::is_needed
	 * @covers ::site_represents_current_author
	 */
	public function test_is_shown_on_author_archive_pages() {
		$this->instance->context->indexable = (object) [
			'object_type' => 'user',
		];

		$this->assertTrue( $this->instance->is_needed( $this->instance->context ) );
	}

	/**
	 * Tests is not needed when the site represents an organization.
	 *
	 * @covers ::is_needed
	 * @covers ::site_represents_current_author
	 */
	public function test_is_not_needed_site_represents_organization() {
		$this->instance->context->site_represents        = 'organization';
		$this->instance->context->indexable->object_type = 'post';

		$this->assertFalse( $this->instance->is_needed() );
	}

	/**
	 * Tests is not needed on a post with the same author as the site represents.
	 *
	 * @covers ::is_needed
	 * @covers ::site_represents_current_author
	 */
	public function test_is_not_needed_post_with_same_author_as_site_represents() {
		$this->instance->context->site_represents            = 'person';
		$this->instance->context->site_user_id               = 1;
		$this->instance->context->indexable->author_id       = 1;
		$this->instance->context->indexable->object_type     = 'post';
		$this->instance->context->indexable->object_sub_type = 'post';

		$this->instance->helpers->schema->article
			->expects( 'is_author_supported' )
			->with( $this->instance->context->indexable->object_sub_type )
			->andReturn( true );

		$this->assertFalse( $this->instance->is_needed() );
	}

	/**
	 * Tests whether generate returns the expected schema when duplicated URLs are provded.
	 *
	 * @covers ::generate
	 * @covers ::determine_user_id
	 * @covers ::build_person_data
	 * @covers ::add_image
	 * @covers ::set_image_from_options
	 * @covers ::set_image_from_avatar
	 * @covers ::get_social_profiles
	 * @covers ::url_social_site
	 */
	public function test_generate_duplicated_URLs() {
		$this->instance->context->site_user_id     = 1337;
		$this->instance->context->site_url         = 'https://example.com/';
		$this->instance->context->site_represents  = 'person';
		$this->instance->context->person_logo_meta = [
			'height' => 100,
			'width'  => 100,
			'url'    => 'http://example.com/image.png',
		];

		$user_data             = (object) [
			'display_name' => 'John',
			'description'  => 'Description',
		];
		$person_schema_logo_id = $this->instance->context->site_url . Schema_IDs::PERSON_LOGO_HASH;
		$image_schema          = [
			'@type'      => 'ImageObject',
			'@id'        => $person_schema_logo_id,
			'inLanguage' => 'en-US',
			'url'        => 'https://example.com/image.png',
			'width'      => 64,
			'height'     => 128,
			'caption'    => 'Person image',
		];

		$duplicated_social_profiles = [
			'facebook',
			'facebook',
			'linkedin',
			'pinterest',
			'twitter',
			'myspace',
			'youtube',
			'soundcloud',
			'tumblr',
			'wikipedia',
		];


		$expected = [
			'@type'       => [ 'Person', 'Organization' ],
			'@id'         => 'person_id',
			'name'        => 'John',
			'logo'        => [ '@id' => 'https://example.com/#/schema/person/image/' ],
			'description' => 'Description',
			'sameAs'      => [
				'https://example.com/social/facebook',
				'https://example.com/social/linkedin',
				'https://example.com/social/pinterest',
				'https://twitter.com/https://example.com/social/twitter',
				'https://example.com/social/myspace',
				'https://example.com/social/youtube',
				'https://example.com/social/soundcloud',
				'https://example.com/social/tumblr',
				'https://example.com/social/wikipedia',
			],
			'image'       => $image_schema,
		];

		$this->expects_for_determine_user_id();
		$this->expects_for_get_userdata( $user_data );

		$this->instance->helpers->schema->image->expects( 'generate_from_attachment_meta' )
			->once()
			->with( $person_schema_logo_id, $this->instance->context->person_logo_meta, $user_data->display_name )
			->andReturn( $image_schema );

		$this->expects_for_social_profiles( $duplicated_social_profiles );

		$this->assertEquals( $expected, $this->instance->generate( $this->instance->context ) );
	}

	/**
	 * Sets the tests for determine_user_id.
	 *
	 * @param string $scenario The scenario to set.
	 */
	protected function expects_for_determine_user_id( $scenario = 'default' ) {
		$user_id = $this->instance->context->site_user_id;

		switch ( $scenario ) {
			case 'false':
				$user_id = false;
				break;
			case 'zero':
				$user_id = 0;
				break;
		}

		Filters\expectApplied( 'wpseo_schema_person_user_id' )
			->once()
			->with( $this->instance->context->site_user_id )
			->andReturn( $user_id );
	}

	/**
	 * Sets the tests for get_userdata inside build_person_data.
	 *
	 * @param object|false $user_data The user data get_userdata returns. An object representing WP_User or false.
	 */
	protected function expects_for_get_userdata( $user_data ) {
		Functions\expect( 'get_userdata' )
			->once()
			->with( $this->instance->context->site_user_id )
			->andReturn( $user_data );
		$this->instance->helpers->schema->id->expects( 'get_user_schema_id' )
			->once()
			->with( $this->instance->context->site_user_id, $this->instance->context )
			->andReturn( 'person_id' );

		// No more tests needed when there is no user data.
		if ( $user_data === false ) {
			return;
		}

		$this->instance->helpers->schema->html->expects( 'smart_strip_tags' )
			->once()
			->with( $user_data->display_name )
			->andReturn( $user_data->display_name );

		if ( empty( $user_data->description ) ) {
			$this->instance->helpers->schema->html->expects( 'smart_strip_tags' )
				->never()
				->with( $user_data->description );
			return;
		}

		$this->instance->helpers->schema->html->expects( 'smart_strip_tags' )
			->once()
			->with( $user_data->description )
			->andReturn( $user_data->description );
	}

	/**
	 * Sets the tests for get_social_profiles.
	 *
	 * @param string[] $social_profiles The social profiles after the `wpseo_schema_person_social_profiles` filter.
	 */
	protected function expects_for_social_profiles( $social_profiles ) {
		Filters\expectApplied( 'wpseo_schema_person_social_profiles' )
			->once()
			->with( $this->social_profiles, $this->instance->context->site_user_id )
			->andReturn( $social_profiles );

		if ( empty( $social_profiles ) || ! \is_array( $social_profiles ) ) {
			Functions\expect( 'get_the_author_meta' )
				->never();

			return;
		}

		// Tests for the method `url_social_site`.
		foreach ( $social_profiles as $social_profile ) {
			if ( ! \is_string( $social_profile ) ) {
				Functions\expect( 'get_the_author_meta' )
					->never()
					->with( $social_profile, $this->instance->context->site_user_id );

				continue;
			}

			Functions\expect( 'get_the_author_meta' )
				->once()
				->with( $social_profile, $this->instance->context->site_user_id )
				->andReturn( 'https://example.com/social/' . $social_profile );
		}
	}

	/**
	 * Sets the tests for set_image_from_avatar.
	 *
	 * @param object $user_data An object representing WP_User. Expected to have `display_name` and `user_email`.
	 * @param string $scenario  The scenario to test.
	 *
	 * @return array The image schema.
	 */
	protected function expects_for_set_image_from_avatar( $user_data, $scenario = 'default' ) {
		$image_schema = [
			'@type'      => 'ImageObject',
			'@id'        => $this->instance->context->site_url . Schema_IDs::PERSON_LOGO_HASH,
			'inLanguage' => 'en-US',
			'url'        => 'https://example.com/image.png',
			'width'      => 64,
			'height'     => 128,
			'caption'    => 'Person image',
		];
		$avatar_url   = $image_schema['url'];

		switch ( $scenario ) {
			case 'empty_avatar_url':
				$avatar_url = '';
				break;
		}

		Functions\expect( 'get_option' )
			->once()
			->with( 'show_avatars' )
			->andReturn( true );
		Functions\expect( 'get_avatar_url' )
			->once()
			->with( $user_data->user_email )
			->andReturn( $avatar_url );

		// No more tests when the avatar url is empty.
		if ( empty( $avatar_url ) ) {
			$this->instance->helpers->schema->image->expects( 'simple_image_object' )
				->never();

			return $image_schema;
		}

		$this->instance->helpers->schema->image->expects( 'simple_image_object' )
			->once()
			->with( $image_schema['@id'], $avatar_url, $user_data->display_name )
			->andReturn( $image_schema );

		return $image_schema;
	}
}

<?php
/**
 * WPSEO plugin test file.
 *
 * @package Yoast\WP\SEO\Tests\Generators\Schema
 */

use Brain\Monkey\Filters;
use Brain\Monkey\Functions;
use Yoast\WP\SEO\Generators\Schema\Person;
use Yoast\WP\SEO\Helpers\Image_Helper;
use Yoast\WP\SEO\Helpers\Schema\HTML_Helper;
use Yoast\WP\SEO\Helpers\Schema\ID_Helper;
use Yoast\WP\SEO\Helpers\Schema\Image_Helper as Schema_Image_Helper;
use Yoast\WP\SEO\Tests\Mocks\Indexable;
use Yoast\WP\SEO\Tests\Mocks\Meta_Tags_Context;
use Yoast\WP\SEO\Tests\TestCase;

/**
 * Class Person_Test
 *
 * @group generators
 * @group schema
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
	 * The meta tags context.
	 *
	 * @var Meta_Tags_Context
	 */
	protected $context;

	/**
	 * The ID helper.
	 *
	 * @var ID_Helper|Mockery\MockInterface
	 */
	protected $id;

	/**
	 * The image helper.
	 *
	 * @var Image_Helper|Mockery\MockInterface
	 */
	protected $image;

	/**
	 * The schema image helper.
	 *
	 * @var Schema_Image_Helper|Mockery\MockInterface
	 */
	protected $schema_image;

	/**
	 * @var HTML_Helper
	 */
	protected $html;

	/**
	 * Initializes the test environment.
	 */
	public function setUp() {
		parent::setUp();

		$this->image        = Mockery::mock( Image_Helper::class );
		$this->schema_image = Mockery::mock( Schema_Image_Helper::class );
		$this->html         = Mockery::mock( HTML_Helper::class );
		$this->id           = Mockery::mock( ID_Helper::class );

		$this->instance = new Person( $this->image, $this->schema_image, $this->html );

		$this->instance->set_id_helper( $this->id );

		$this->context            = new Meta_Tags_Context();
		$this->context->indexable = new Indexable();
	}

	/**
	 * Tests whether generate returns the expected schema.
	 *
	 * @covers ::__construct
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
		$this->context->site_user_id    = 1337;
		$this->context->site_url        = 'https://example.com/';
		$this->context->site_represents = 'person';

		$user_data             = (object) [
			'display_name' => 'John',
			'description'  => 'Description',
		];
		$person_logo_id        = 42;
		$person_schema_logo_id = $this->context->site_url . $this->id->person_logo_hash;
		$social_profiles       = [
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
			'logo'        => [ '@id' => 'https://example.com/#personlogo' ],
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

		// Tests for the method `determine_user_id`.
		Filters\expectApplied( 'wpseo_schema_person_user_id' )
			->once()
			->with( $this->context->site_user_id )
			->andReturn( $this->context->site_user_id );

		// Tests for the method `build_person_data`.
		Functions\expect( 'get_userdata' )
			->once()
			->with( $this->context->site_user_id )
			->andReturn( $user_data );
		$this->id->expects( 'get_user_schema_id' )
			->once()
			->with( $this->context->site_user_id, $this->context )
			->andReturn( 'person_id' );
		$this->html->expects( 'smart_strip_tags' )
			->once()
			->with( $user_data->display_name )
			->andReturn( $user_data->display_name );
		// Tests for the method `set_image_from_options`.
		$this->image->expects( 'get_attachment_id_from_settings' )
			->once()
			->with( 'person_logo' )
			->andReturn( $person_logo_id );
		$this->schema_image->expects( 'generate_from_attachment_id' )
			->once()
			->with( $person_schema_logo_id, $person_logo_id, $user_data->display_name )
			->andReturn( $image_schema );
		// Back to `build_person_data`.
		$this->html->expects( 'smart_strip_tags' )
			->once()
			->with( $user_data->description )
			->andReturn( $user_data->description );
		// Tests for the method `get_social_profiles`.
		Filters\expectApplied( 'wpseo_schema_person_social_profiles' )
			->once()
			->with( $social_profiles, $this->context->site_user_id )
			->andReturn( $social_profiles );
		// Tests for the method `url_social_site`.
		foreach ( $social_profiles as $social_profile ) {
			Functions\expect( 'get_the_author_meta' )
				->once()
				->with( $social_profile, $this->context->site_user_id )
				->andReturn( 'https://example.com/social/' . $social_profile );
		}

		$this->assertEquals( $expected, $this->instance->generate( $this->context ) );
	}

	/**
	 * Tests whether generate returns false when no user id could be determined.
	 *
	 * @covers ::__construct
	 * @covers ::generate
	 * @covers ::determine_user_id
	 */
	public function test_generate_no_user_id() {
		$this->context->site_user_id = 1337;

		Filters\expectApplied( 'wpseo_schema_person_user_id' )
			->once()
			->with( $this->context->site_user_id )
			->andReturn( false );

		$this->assertFalse( $this->instance->generate( $this->context ) );
	}

	/**
	 * Tests whether generate returns false when no user id 0 was determined.
	 *
	 * @covers ::__construct
	 * @covers ::generate
	 * @covers ::determine_user_id
	 */
	public function test_generate_user_id_zero() {
		$this->context->site_user_id = 1337;

		Filters\expectApplied( 'wpseo_schema_person_user_id' )
			->once()
			->with( $this->context->site_user_id )
			->andReturn( 0 );

		$this->assertFalse( $this->instance->generate( $this->context ) );
	}

	/**
	 * Tests whether the person Schema piece is shown when the site represents a person.
	 *
	 * @covers ::__construct
	 * @covers ::is_needed
	 */
	public function test_is_shown_when_site_represents_person() {
		$this->context->site_represents = 'person';

		$this->assertTrue( $this->instance->is_needed( $this->context ) );
	}

	/**
	 * Tests whether the person Schema piece is shown on author archive pages.
	 *
	 * @covers ::__construct
	 * @covers ::is_needed
	 */
	public function test_is_shown_on_author_archive_pages() {
		$this->context->indexable = (Object) [
			'object_type' => 'user',
		];

		$this->assertTrue( $this->instance->is_needed( $this->context ) );
	}

	/**
	 * Tests is not needed.
	 *
	 * @covers ::__construct
	 * @covers ::is_needed
	 */
	public function test_is_not_needed() {
		$this->context->site_represents        = 'organization';
		$this->context->indexable->object_type = 'post';

		$this->assertFalse( $this->instance->is_needed( $this->context ) );
	}
}

<?php

namespace Yoast\WP\SEO\Tests\Generators\Schema;

use Brain\Monkey\Filters;
use Mockery;
use Yoast\WP\SEO\Helpers\Options_Helper;
use Yoast\WP\SEO\Helpers\Schema\HTML_Helper;
use Yoast\WP\SEO\Helpers\Schema\ID_Helper;
use Yoast\WP\SEO\Helpers\Schema\Image_Helper;
use Yoast\WP\SEO\Presentations\Generators\Schema\Organization;
use Yoast\WP\SEO\Tests\Mocks\Meta_Tags_Context;
use Yoast\WP\SEO\Tests\TestCase;

/**
 * Class Organization_Test
 *
 * @group generators
 * @group schema
 *
 * @coversDefaultClass \Yoast\WP\SEO\Presentations\Generators\Schema\Organization
 */
class Organization_Test extends TestCase {

	/**
	 * The instance to test.
	 *
	 * @var Organization
	 */
	protected $instance;

	/**
	 * The meta tags context.
	 *
	 * @var Meta_Tags_Context
	 */
	protected $context;

	/**
	 * The image helper.
	 *
	 * @var Image_Helper|Mockery\MockInterface
	 */
	protected $image;

	/**
	 * The options helper.
	 *
	 * @var Options_Helper|Mockery\MockInterface
	 */
	protected $options;

	/**
	 * The HTML helper.
	 *
	 * @var HTML_Helper|Mockery\MockInterface
	 */
	protected $html;

	/**
	 * The ID helper.
	 *
	 * @var ID_Helper
	 */
	private $id;

	/**
	 * Initializes the test environment.
	 */
	public function setUp() {
		parent::setUp();

		$this->image    = Mockery::mock( Image_Helper::class );
		$this->options  = Mockery::mock( Options_Helper::class );
		$this->html     = Mockery::mock( HTML_Helper::class );
		$this->id       = new ID_Helper();
		$this->context  = new Meta_Tags_Context();
		$this->instance = new Organization(
			$this->image,
			$this->options,
			$this->html
		);

		$this->instance->set_id_helper( $this->id );
	}

	/**
	 * Tests the generated schema is as expected.
	 */
	public function test_generate() {
		$this->context->site_url        = 'https://yoast.com/';
		$this->context->company_name    = 'Yoast';
		$this->context->company_logo_id = 1337;

		$schema_id      = $this->context->site_url . $this->id->organization_hash;
		$schema_logo_id = $this->context->site_url . $this->id->organization_logo_hash;

		$profiles = [
			'https://www.facebook.com/yoast/',
			'https://www.instagram.com/yoast/',
			'https://www.linkedin.com/company/yoast-com',
			'https://myspace.com/yoast/',
			'https://www.youtube.com/yoast',
			'https://www.pinterest.com/yoast/',
			'https://en.wikipedia.org/wiki/Yoast_SEO',
			'https://twitter.com/yoast',
		];
		$logo     = [
			'@type' => 'ImageObject',
			'@id'   => $schema_logo_id,
			'url'   => 'https://yoast.com/logo.jpg',
		];

		$this->html->expects( 'smart_strip_tags' )
			->once()
			->with( $this->context->company_name )
			->andReturn( $this->context->company_name );

		// For the private `fetch_social_profiles` method.
		$this->options->expects( 'get' )
			->once()
			->with( 'facebook_site', '' )
			->andReturn( 'https://www.facebook.com/yoast/' );
		$this->options->expects( 'get' )
			->once()
			->with( 'instagram_url', '' )
			->andReturn( 'https://www.instagram.com/yoast/' );
		$this->options->expects( 'get' )
			->once()
			->with( 'linkedin_url', '' )
			->andReturn( 'https://www.linkedin.com/company/yoast-com' );
		$this->options->expects( 'get' )
			->once()
			->with( 'myspace_url', '' )
			->andReturn( 'https://myspace.com/yoast/' );
		$this->options->expects( 'get' )
			->once()
			->with( 'youtube_url', '' )
			->andReturn( 'https://www.youtube.com/yoast' );
		$this->options->expects( 'get' )
			->once()
			->with( 'pinterest_url', '' )
			->andReturn( 'https://www.pinterest.com/yoast/' );
		$this->options->expects( 'get' )
			->once()
			->with( 'wikipedia_url', '' )
			->andReturn( 'https://en.wikipedia.org/wiki/Yoast_SEO' );
		$this->options->expects( 'get' )
			->once()
			->with( 'twitter_site', '' )
			->andReturn( 'yoast' );
		Filters\expectApplied( 'wpseo_schema_organization_social_profiles' )
			->once()
			->with( $profiles )
			->andReturn( $profiles );

		$this->image->expects( 'generate_from_attachment_id' )
			->once()
			->with( $schema_logo_id, $this->context->company_logo_id, $this->context->company_name )
			->andReturn( $logo );

		$expected = [
			'@type'  => 'Organization',
			'@id'    => $schema_id,
			'name'   => $this->context->company_name,
			'url'    => $this->context->site_url,
			'sameAs' => $profiles,
			'logo'   => $logo,
			'image'  => [ '@id' => $schema_logo_id ],
		];

		$this->assertEquals( $expected, $this->instance->generate( $this->context ) );
	}

	/**
	 * Tests is needed when the site represents a company.
	 *
	 * @covers ::__construct
	 * @covers ::is_needed
	 */
	public function test_is_needed() {
		$this->context->site_represents = 'company';

		$this->assertTrue( $this->instance->is_needed( $this->context ) );
	}

	/**
	 * Tests is not needed when the site does not represent a company.
	 *
	 * @covers ::__construct
	 * @covers ::is_needed
	 */
	public function test_is_not_needed() {
		$this->context->site_represents = false;

		$this->assertFalse( $this->instance->is_needed( $this->context ) );
	}
}

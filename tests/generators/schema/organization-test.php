<?php
/**
 * WPSEO plugin test file.
 *
 * @package Yoast\WP\SEO\Tests\Generators\Schema
 */

namespace Yoast\WP\SEO\Tests\Generators\Schema;

use Brain\Monkey\Filters;
use Mockery;
use Yoast\WP\SEO\Config\Schema_IDs;
use Yoast\WP\SEO\Helpers\Options_Helper;
use Yoast\WP\SEO\Helpers\Schema\HTML_Helper;
use Yoast\WP\SEO\Helpers\Schema\ID_Helper;
use Yoast\WP\SEO\Helpers\Schema\Image_Helper;
use Yoast\WP\SEO\Generators\Schema\Organization;
use Yoast\WP\SEO\Tests\Doubles\Context\Meta_Tags_Context_Mock;
use Yoast\WP\SEO\Tests\TestCase;

/**
 * Class Organization_Test
 *
 * @group generators
 * @group schema
 *
 * @coversDefaultClass \Yoast\WP\SEO\Generators\Schema\Organization
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
	 * @var Meta_Tags_Context_Mock
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
		$this->context  = new Meta_Tags_Context_Mock();
		$this->instance = new Organization(
			$this->image,
			$this->options,
			$this->html
		);

		$this->instance->context = $this->context;
		$this->instance->helpers = (object) [
			'options' => $this->options,
			'schema'  => (object) [
				'id'      => $this->id,
				'image'   => $this->image,
				'html'    => $this->html,
			],
		];
	}

	/**
	 * Tests the generated schema is as expected.
	 *
	 * @dataProvider generate_provider
	 *
	 * @param array $profiles_input    The social profiles input for the options.
	 * @param array $profiles_expected The social profiles expected output.
	 */
	public function test_generate( $profiles_input, $profiles_expected ) {
		$this->context->site_url        = 'https://yoast.com/';
		$this->context->company_name    = 'Yoast';
		$this->context->company_logo_id = 1337;

		$schema_id      = $this->context->site_url . Schema_IDs::ORGANIZATION_HASH;
		$schema_logo_id = $this->context->site_url . Schema_IDs::ORGANIZATION_LOGO_HASH;

		$logo = [
			'@type' => 'ImageObject',
			'@id'   => $schema_logo_id,
			'url'   => 'https://yoast.com/logo.jpg',
		];

		$this->html->expects( 'smart_strip_tags' )
			->once()
			->with( $this->context->company_name )
			->andReturn( $this->context->company_name );

		// For the private `fetch_social_profiles` method.
		foreach ( $profiles_input as $profile_type => $profile_value ) {
			$this->options->expects( 'get' )
				->once()
				->with( $profile_type, '' )
				->andReturn( $profile_value );
		}
		Filters\expectApplied( 'wpseo_schema_organization_social_profiles' )
			->once()
			->with( $profiles_expected )
			->andReturn( $profiles_expected );

		$this->image->expects( 'generate_from_attachment_id' )
			->once()
			->with( $schema_logo_id, $this->context->company_logo_id, $this->context->company_name )
			->andReturn( $logo );

		$expected = [
			'@type'  => 'Organization',
			'@id'    => $schema_id,
			'name'   => $this->context->company_name,
			'url'    => $this->context->site_url,
			'sameAs' => $profiles_expected,
			'logo'   => $logo,
			'image'  => [ '@id' => $schema_logo_id ],
		];

		$this->assertEquals( $expected, $this->instance->generate() );
	}

	/**
	 * Tests is needed when the site represents a company.
	 *
	 * @covers ::is_needed
	 */
	public function test_is_needed() {
		$this->context->site_represents = 'company';

		$this->assertTrue( $this->instance->is_needed() );
	}

	/**
	 * Tests is not needed when the site does not represent a company.
	 *
	 * @covers ::is_needed
	 */
	public function test_is_not_needed() {
		$this->context->site_represents = false;

		$this->assertFalse( $this->instance->is_needed() );
	}

	/**
	 * Provides data for the generate test.
	 *
	 * @return array The test data to use.
	 */
	public function generate_provider() {
		return [
			// Every possible social profile filled.
			[
				'profiles_input'    => [
					'facebook_site' => 'https://www.facebook.com/yoast/',
					'instagram_url' => 'https://www.instagram.com/yoast/',
					'linkedin_url'  => 'https://www.linkedin.com/company/yoast-com',
					'myspace_url'   => 'https://myspace.com/yoast/',
					'youtube_url'   => 'https://www.youtube.com/yoast',
					'pinterest_url' => 'https://www.pinterest.com/yoast/',
					'wikipedia_url' => 'https://en.wikipedia.org/wiki/Yoast_SEO',
					'twitter_site'  => 'yoast',
				],
				'profiles_expected' => [
					'https://www.facebook.com/yoast/',
					'https://www.instagram.com/yoast/',
					'https://www.linkedin.com/company/yoast-com',
					'https://myspace.com/yoast/',
					'https://www.youtube.com/yoast',
					'https://www.pinterest.com/yoast/',
					'https://en.wikipedia.org/wiki/Yoast_SEO',
					'https://twitter.com/yoast',
				],
			],
			// Without Twitter.
			[
				'profiles_input'    => [
					'facebook_site' => 'https://www.facebook.com/yoast/',
					'instagram_url' => 'https://www.instagram.com/yoast/',
					'linkedin_url'  => 'https://www.linkedin.com/company/yoast-com',
					'myspace_url'   => 'https://myspace.com/yoast/',
					'youtube_url'   => 'https://www.youtube.com/yoast',
					'pinterest_url' => 'https://www.pinterest.com/yoast/',
					'wikipedia_url' => 'https://en.wikipedia.org/wiki/Yoast_SEO',
					'twitter_site'  => '',
				],
				'profiles_expected' => [
					'https://www.facebook.com/yoast/',
					'https://www.instagram.com/yoast/',
					'https://www.linkedin.com/company/yoast-com',
					'https://myspace.com/yoast/',
					'https://www.youtube.com/yoast',
					'https://www.pinterest.com/yoast/',
					'https://en.wikipedia.org/wiki/Yoast_SEO',
				],
			],
			// Only Twitter.
			[
				'profiles_input'    => [
					'facebook_site' => '',
					'instagram_url' => '',
					'linkedin_url'  => '',
					'myspace_url'   => '',
					'youtube_url'   => '',
					'pinterest_url' => '',
					'wikipedia_url' => '',
					'twitter_site'  => 'yoast',
				],
				'profiles_expected' => [
					'https://twitter.com/yoast',
				],
			],
		];
	}
}

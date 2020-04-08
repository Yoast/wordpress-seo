<?php

use Brain\Monkey\Functions;
use Yoast\WP\SEO\Context\Meta_Tags_Context;
use Yoast\WP\SEO\Helpers\Image_Helper;
use Yoast\WP\SEO\Helpers\Options_Helper;
use Yoast\WP\SEO\Helpers\Schema\ID_Helper;
use Yoast\WP\SEO\Helpers\Site_Helper;
use Yoast\WP\SEO\Helpers\Url_Helper;
use Yoast\WP\SEO\Helpers\User_Helper;
use Yoast\WP\SEO\Tests\TestCase;

/**
 * Class Meta_Tags_Context_Test
 *
 * @coversDefaultClass \Yoast\WP\SEO\Context\Meta_Tags_Context
 *
 * @group context
 */
class Meta_Tags_Context_Test extends TestCase {

	/**
	 * @var Options_Helper
	 */
	private $options;

	/**
	 * @var Url_Helper
	 */
	private $url;

	/**
	 * @var Image_Helper
	 */
	private $image;

	/**
	 * @var ID_Helper
	 */
	private $id;

	/**
	 * @var WPSEO_Replace_Vars
	 */
	private $replace_vars;

	/**
	 * @var Site_Helper
	 */
	private $site;

	/**
	 * @var User_Helper
	 */
	private $user;

	/**
	 * @var Meta_Tags_Context
	 */
	private $instance;

	/**
	 * Set up the test.
	 */
	public function setUp() {
		parent::setUp();

		$this->options      = Mockery::mock( Options_Helper::class );
		$this->url          = Mockery::mock( Url_Helper::class );
		$this->image        = Mockery::mock( Image_Helper::class );
		$this->id           = Mockery::mock( ID_Helper::class );
		$this->replace_vars = Mockery::mock( WPSEO_Replace_Vars::class );
		$this->site         = Mockery::mock( Site_Helper::class );
		$this->user         = Mockery::mock( User_Helper::class );

		$this->instance = new Meta_Tags_Context(
			$this->options,
			$this->url,
			$this->image,
			$this->id,
			$this->replace_vars,
			$this->site,
			$this->user
		);
	}

	/**
	 * Tests whether the page type for author archives is correctly typed as a 'ProfilePage' and a 'WebPage'.
	 *
	 * @covers ::generate_schema_page_type
	 */
	public function test_generate_schema_page_type_author_archive() {
		$this->instance->indexable = (object) [
			'object_type' => 'user',
		];

		$actual = $this->instance->generate_schema_page_type();

		$this->assertContains( 'WebPage', $actual );
		$this->assertContains( 'ProfilePage', $actual );
	}

	/**
	 * Tests the generate site represents without representation.
	 *
	 * @covers ::generate_site_represents
	 */
	public function test_generate_site_represents_without_representation() {
		$this->options->expects( 'get' )->once()->with( 'company_or_person', false )->andReturnFalse();

		$this->assertFalse( $this->instance->generate_site_represents() );
	}

	/**
	 * Tests the generate site represents with a company without a name.
	 *
	 * @covers ::generate_site_represents
	 */
	public function test_generate_site_represents_company_without_name() {
		$this->instance->company_name = '';

		$this->options->expects( 'get' )->once()->with( 'company_or_person', false )->andReturn( 'company' );

		$this->assertFalse( $this->instance->generate_site_represents() );
	}

	/**
	 * Tests the generate site represents with a company without a logo.
	 *
	 * @covers ::generate_site_represents
	 */
	public function test_generate_site_represents_company_without_logo() {
		$this->instance->company_name    = 'Company';
		$this->instance->company_logo_id = 0;

		$this->options->expects( 'get' )->once()->with( 'company_or_person', false )->andReturn( 'company' );

		$this->assertFalse( $this->instance->generate_site_represents() );
	}

	/**
	 * Tests the generate site represents with a company with name and logo.
	 *
	 * @covers ::generate_site_represents
	 */
	public function test_generate_site_represents_company_with_name_and_logo() {
		$this->instance->company_name    = 'Company';
		$this->instance->company_logo_id = 12;

		$this->options->expects( 'get' )->once()->with( 'company_or_person', false )->andReturn( 'company' );

		$this->assertEquals( 'company', $this->instance->generate_site_represents() );
	}

	/**
	 * Tests the generate site represents with a person without a user id.
	 *
	 * @covers ::generate_site_represents
	 */
	public function test_generate_site_represents_person_without_user() {
		$this->instance->site_user_id = 1;

		Functions\expect( 'get_user_by' )->once()->with( 'id', 1 )->andReturn( false );

		$this->options->expects( 'get' )->once()->with( 'company_or_person', false )->andReturn( 'person' );

		$this->assertFalse( $this->instance->generate_site_represents() );
	}

	/**
	 * Tests the generate site represents with a person without a user id.
	 *
	 * @covers ::generate_site_represents
	 */
	public function test_generate_site_represents_person() {
		$this->instance->site_user_id = 1;

		Functions\expect( 'get_user_by' )->once()->with( 'id', 1 )->andReturn( true );

		$this->options->expects( 'get' )->once()->with( 'company_or_person', false )->andReturn( 'person' );

		$this->assertEquals( 'person', $this->instance->generate_site_represents() );
	}
}

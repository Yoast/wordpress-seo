<?php


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
	 * @covers Meta_Tags_Context::generate_schema_page_type
	 */
	public function test_generate_schema_page_type_author_archive() {
		$this->instance->indexable = (Object) [
			'object_type' => 'user',
		];

		$actual = $this->instance->generate_schema_page_type();

		$this->assertContains( 'WebPage' , $actual );
		$this->assertContains( 'ProfilePage', $actual );
	}
}

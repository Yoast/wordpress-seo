<?php

namespace Yoast\WP\SEO\Tests\Builders;

use Brain\Monkey\Filters;
use Brain\Monkey\Functions;
use Mockery;
use Yoast\WP\SEO\Builders\Indexable_Link_Builder;
use Yoast\WP\SEO\Helpers\Image_Helper;
use Yoast\WP\SEO\Helpers\Url_Helper;
use Yoast\WP\SEO\Repositories\Indexable_Repository;
use Yoast\WP\SEO\Repositories\SEO_Links_Repository;
use Yoast\WP\SEO\Tests\Doubles\Models\Indexable_Double;
use Yoast\WP\SEO\Tests\TestCase;

/**
 * Class Indexable_Author_Test.
 *
 * @group indexables
 * @group builders
 *
 * @coversDefaultClass \Yoast\WP\SEO\Builders\Indexable_Link_Builder_Test
 * @covers ::<!public>
 */
class Indexable_Link_Builder_Test extends TestCase {

	/**
	 * The SEO links repository.
	 *
	 * @var SEO_Links_Repository
	 */
	protected $seo_links_repository;

	/**
	 * The url helper.
	 *
	 * @var Url_Helper
	 */
	protected $url_helper;

	/**
	 * The image helper.
	 *
	 * @var Image_Helper
	 */
	protected $image_helper;

	/**
	 * The indexable repository.
	 *
	 * @var Indexable_Repository
	 */
	protected $indexable_repository;

	/**
	 * The test instance.
	 *
	 * @var Indexable_Link_Builder
	 */
	protected $instance;

	/**
	 * @inheritDoc
	 */
	public function setUp() {
		parent::setUp();

		$this->seo_links_repository = Mockery::mock( SEO_Links_Repository::class );
		$this->url_helper           = Mockery::mock( Url_Helper::class );
		$this->indexable_repository = Mockery::mock( Indexable_Repository::class );
		$this->image_helper         = Mockery::mock( Image_Helper::class );

		$this->instance = new Indexable_Link_Builder( $this->seo_links_repository, $this->url_helper );
		$this->instance->set_dependencies( $this->indexable_repository, $this->image_helper );
	}

	/**
	 * Tests the build function.
	 *
	 * @covers ::__construct
	 * @covers ::set_dependencies
	 * @covers ::build
	 */
	public function test_build() {
		$indexable              = new Indexable_Double;
		$indexable->object_type = 'post';
		$indexable->permalink   = 'https://site.com/page';
		$content                = '<a href="https://example.com">link</a>';

		Filters\expectApplied( 'the_content' )->with( $content )->andReturnFirstArg();

		Functions\expect( 'home_url' )->once()->andReturn( 'home_url' );
		Functions\expect( 'wp_parse_url' )->with( 'home_url' )->andReturn( [ 'scheme' => 'https', 'host' => 'site.com' ] );

		$this->instance->build( $indexable, $content );
	}
}

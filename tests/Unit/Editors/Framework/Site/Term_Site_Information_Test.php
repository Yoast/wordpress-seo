<?php

// @phpcs:disable Yoast.NamingConventions.NamespaceName.TooLong -- This namespace should reflect the namespace of the original class.
namespace Yoast\WP\SEO\Tests\Unit\Editors\Framework\Site;

use Brain\Monkey;
use Mockery;
use WP_Taxonomy;
use WP_Term;
use Yoast\WP\SEO\Editors\Framework\Site\Term_Site_Information;
use Yoast\WP\SEO\Helpers\Options_Helper;
use Yoast\WP\SEO\Helpers\Product_Helper;
use Yoast\WP\SEO\Helpers\Short_Link_Helper;
use Yoast\WP\SEO\Introductions\Infrastructure\Wistia_Embed_Permission_Repository;
use Yoast\WP\SEO\Promotions\Application\Promotion_Manager;
use Yoast\WP\SEO\Surfaces\Meta_Surface;
use Yoast\WP\SEO\Tests\Unit\Doubles\Editors\Site_Information_Mocks_Trait;
use Yoast\WP\SEO\Tests\Unit\TestCase;

/**
 * Class Term_Site_Information_Test
 *
 * @group editors
 *
 * @coversDefaultClass \Yoast\WP\SEO\Editors\Framework\Site\Term_Site_Information
 */
final class Term_Site_Information_Test extends TestCase {

	use Site_Information_Mocks_Trait;

	/**
	 * Holds the Options helper instance.
	 *
	 * @var Mockery\MockInterface|Options_Helper
	 */
	private $options_helper;

	/**
	 * Holds the Short_Link_Helper instance.
	 *
	 * @var Mockery\MockInterface|Short_Link_Helper
	 */
	private $short_link_helper;

	/**
	 * Holds the Wistia_Embed_Permission_Repository instance.
	 *
	 * @var Mockery\MockInterface|Wistia_Embed_Permission_Repository
	 */
	private $wistia_embed_repo;

	/**
	 * Holds the Meta_Surface instance.
	 *
	 * @var Mockery\MockInterface|Meta_Surface
	 */
	private $meta_surface;

	/**
	 * Holds the Product_Helper instance.
	 *
	 * @var Mockery\MockInterface|Product_Helper
	 */
	private $product_helper;

	/**
	 * Holds the Promotion_Manager instance.
	 *
	 * @var Mockery\MockInterface|Promotion_Manager
	 */
	private $promotion_manager;

	/**
	 * The Term_Site_Information container.
	 *
	 * @var Term_Site_Information
	 */
	private $instance;

	/**
	 * Set up the test.
	 *
	 * @return void
	 */
	protected function set_up() {
		parent::set_up();
		$this->options_helper    = Mockery::mock( Options_Helper::class );
		$this->short_link_helper = Mockery::mock( Short_Link_Helper::class );
		$this->wistia_embed_repo = Mockery::mock( Wistia_Embed_Permission_Repository::class );
		$this->meta_surface      = Mockery::mock( Meta_Surface::class );
		$this->product_helper    = Mockery::mock( Product_Helper::class );
		$this->promotion_manager = Mockery::mock( Promotion_Manager::class );

		$this->instance      = new Term_Site_Information( $this->short_link_helper, $this->wistia_embed_repo, $this->meta_surface, $this->product_helper, $this->options_helper, $this->promotion_manager );
		$taxonomy            = Mockery::mock( WP_Taxonomy::class )->makePartial();
		$taxonomy->rewrite   = false;
		$mock_term           = Mockery::mock( WP_Term::class )->makePartial();
		$mock_term->taxonomy = 'tax';
		$mock_term->term_id  = 1;

		Monkey\Functions\expect( 'get_taxonomy' )->andReturn( $taxonomy );

		$this->instance->set_term( $mock_term );
		$this->options_helper->expects( 'get' )->with( 'stripcategorybase', false )->andReturnFalse();
		$this->options_helper->expects( 'get' )->with( 'opengraph', false )->andReturn( false );
		$this->options_helper->expects( 'get' )->with( 'twitter', false )->andReturn( false );
		$this->options_helper->expects( 'get' )->with( 'og_default_image' )->andReturn( null );

		$this->set_mocks();
	}

	/**
	 * Tests the get_site_information.
	 *
	 * @covers ::__construct
	 * @covers ::get_site_information
	 * @covers ::search_url
	 * @covers ::base_url_for_js
	 * @covers ::edit_url
	 * @covers ::set_term
	 *
	 * @return void
	 */
	public function test_site_information() {
		$expected = [
			'search_url'                => 'https://example.org',
			'post_edit_url'             => 'https://example.org',
			'base_url'                  => 'https://example.org',
			'adminUrl'                  => 'https://example.org',
			'linkParams'                => [
				'param',
				'param2',
			],
			'pluginUrl'                 => '/location',
			'wistiaEmbedPermission'     => true,
			'site_name'                 => 'examepl.com',
			'contentLocale'             => 'nl_NL',
			'userLocale'                => 'nl_NL',
			'isRtl'                     => false,
			'isPremium'                 => true,
			'siteIconUrl'               => 'https://example.org',
			'showSocial'                => [
				'facebook' => false,
				'twitter'  => false,
			],
			'sitewideSocialImage'       => null,
			'isPrivateBlog'             => true,
			'currentPromotions'         => [
				'the promotion',
				'another one',
			],
			'blackFridayBlockEditorUrl' => '',
		];

		Monkey\Functions\expect( 'admin_url' )->andReturn( 'https://example.org' );
		Monkey\Functions\expect( 'home_url' )->andReturn( 'https://example.org' );
		Monkey\Functions\expect( 'get_option' )
			->once()
			->with( 'blog_public' )
			->andReturn( '0' );

		$this->promotion_manager->expects( 'get_current_promotions' )->andReturn( [ 'the promotion', 'another one' ] );
		$this->promotion_manager->expects( 'is' )->andReturnFalse();

		$this->assertSame( $expected, $this->instance->get_site_information() );
	}

	/**
	 * Tests the get_legacy_site_information.
	 *
	 * @covers ::__construct
	 * @covers ::get_legacy_site_information
	 * @covers ::search_url
	 * @covers ::base_url_for_js
	 * @covers ::edit_url
	 * @covers ::set_term
	 *
	 * @return void
	 */
	public function test_legacy_site_information() {

		$expected = [
			'metabox'                   => [
				'search_url'    => 'https://example.org',
				'post_edit_url' => 'https://example.org',
				'base_url'      => 'https://example.org',
				'site_name'     => 'examepl.com',
				'contentLocale' => 'nl_NL',
				'userLocale'    => 'nl_NL',
				'isRtl'         => false,
				'isPremium'     => true,
				'siteIconUrl'   => 'https://example.org',
				'showSocial'    => [
					'facebook' => false,
					'twitter'  => false,
				],
			],
			'adminUrl'                  => 'https://example.org',
			'linkParams'                => [
				'param',
				'param2',
			],
			'pluginUrl'                 => '/location',
			'wistiaEmbedPermission'     => true,
			'sitewideSocialImage'       => null,
			'isPrivateBlog'             => false,
			'currentPromotions'         => [
				'the promotion',
				'another one',
			],
			'blackFridayBlockEditorUrl' => '',
		];

		Monkey\Functions\expect( 'admin_url' )->andReturn( 'https://example.org' );
		Monkey\Functions\expect( 'home_url' )->andReturn( 'https://example.org' );

		$this->promotion_manager->expects( 'get_current_promotions' )->andReturn( [ 'the promotion', 'another one' ] );
		$this->promotion_manager->expects( 'is' )->andReturnFalse();

		$this->assertSame( $expected, $this->instance->get_legacy_site_information() );
	}
}

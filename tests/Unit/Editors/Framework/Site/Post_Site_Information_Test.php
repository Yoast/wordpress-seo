<?php

// @phpcs:disable Yoast.NamingConventions.NamespaceName.TooLong -- This namespace should reflect the namespace of the original class.
namespace Yoast\WP\SEO\Tests\Unit\Editors\Framework\Site;

use Brain\Monkey;
use Mockery;
use Yoast\WP\SEO\Actions\Alert_Dismissal_Action;
use Yoast\WP\SEO\Editors\Framework\Site\Post_Site_Information;
use Yoast\WP\SEO\Helpers\Options_Helper;
use Yoast\WP\SEO\Helpers\Product_Helper;
use Yoast\WP\SEO\Helpers\Short_Link_Helper;
use Yoast\WP\SEO\Introductions\Infrastructure\Wistia_Embed_Permission_Repository;
use Yoast\WP\SEO\Promotions\Application\Promotion_Manager;
use Yoast\WP\SEO\Surfaces\Meta_Surface;
use Yoast\WP\SEO\Tests\Unit\Doubles\Editors\Site_Information_Mocks_Trait;
use Yoast\WP\SEO\Tests\Unit\TestCase;

/**
 * Class Post_Site_Information_Test
 *
 * @group editors
 *
 * @coversDefaultClass \Yoast\WP\SEO\Editors\Framework\Site\Post_Site_Information
 */
final class Post_Site_Information_Test extends TestCase {

	use Site_Information_Mocks_Trait;

	/**
	 * Holds the Alert_Dismissal_Action instance.
	 *
	 * @var Mockery\MockInterface|Alert_Dismissal_Action
	 */
	protected $alert_dismissal_action;

	/**
	 * Holds the Promotion_Manager instance.
	 *
	 * @var Mockery\MockInterface|Promotion_Manager
	 */
	private $promotion_manager;

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
	 * The options helper.
	 *
	 * @var Mockery\MockInterface|Options_Helper $options_helper
	 */
	private $options_helper;

	/**
	 * The Post_Site_Information container.
	 *
	 * @var Post_Site_Information
	 */
	private $instance;

	/**
	 * Set up the test.
	 *
	 * @return void
	 */
	protected function set_up() {
		parent::set_up();
		$this->promotion_manager      = Mockery::mock( Promotion_Manager::class );
		$this->short_link_helper      = Mockery::mock( Short_Link_Helper::class );
		$this->wistia_embed_repo      = Mockery::mock( Wistia_Embed_Permission_Repository::class );
		$this->meta_surface           = Mockery::mock( Meta_Surface::class );
		$this->product_helper         = Mockery::mock( Product_Helper::class );
		$this->alert_dismissal_action = Mockery::mock( Alert_Dismissal_Action::class );
		$this->options_helper         = Mockery::mock( Options_Helper::class );

		$this->instance = new Post_Site_Information( $this->short_link_helper, $this->wistia_embed_repo, $this->meta_surface, $this->product_helper, $this->alert_dismissal_action, $this->options_helper, $this->promotion_manager );
		$this->instance->set_permalink( 'perma' );
		$this->set_mocks();
	}

	/**
	 * Tests the get_legacy_site_information.
	 *
	 * @covers ::__construct
	 * @covers ::get_legacy_site_information
	 * @covers ::search_url
	 * @covers ::base_url_for_js
	 * @covers ::edit_url
	 * @covers ::set_permalink
	 *
	 * @return void
	 */
	public function test_legacy_site_information() {
		$expected = [
			'dismissedAlerts'            => [
				'the alert',
			],
			'webinarIntroBlockEditorUrl' => 'https://expl.c',
			'metabox'                    => [
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

			'adminUrl'                   => 'https://example.org',
			'linkParams'                 => [
				'param',
				'param2',
			],
			'pluginUrl'                  => '/location',
			'wistiaEmbedPermission'      => true,
			'sitewideSocialImage'        => null,
			'isPrivateBlog'              => false,
			'currentPromotions'          => [
				'the promotion',
				'another one',
			],
			'blackFridayBlockEditorUrl'  => '',

		];

		Monkey\Functions\expect( 'admin_url' )->andReturn( 'https://example.org' );
		Monkey\Functions\expect( 'home_url' )->andReturn( 'https://example.org' );

		$this->alert_dismissal_action->expects( 'all_dismissed' )->andReturn( [ 'the alert' ] );
		$this->promotion_manager->expects( 'get_current_promotions' )->andReturn( [ 'the promotion', 'another one' ] );
		$this->promotion_manager->expects( 'is' )->andReturnFalse();
		$this->short_link_helper->expects( 'get' )->andReturn( 'https://expl.c' );
		$this->options_helper->expects( 'get' )->with( 'opengraph', false )->andReturn( false );
		$this->options_helper->expects( 'get' )->with( 'twitter', false )->andReturn( false );
		$this->options_helper->expects( 'get' )->with( 'og_default_image' )->andReturn( null );

		$this->assertSame( $expected, $this->instance->get_legacy_site_information() );
	}

	/**
	 * Tests the get_site_information.
	 *
	 * @covers ::__construct
	 * @covers ::get_site_information
	 * @covers ::search_url
	 * @covers ::base_url_for_js
	 * @covers ::edit_url
	 * @covers ::set_permalink
	 *
	 * @return void
	 */
	public function test_site_information() {
		$expected = [

			'dismissedAlerts'                => [
				'the alert',
			],
			'webinarIntroBlockEditorUrl'     => 'https://expl.c',
			'search_url'                     => 'https://example.org',
			'post_edit_url'                  => 'https://example.org',
			'base_url'                       => 'https://example.org',

			'adminUrl'                       => 'https://example.org',
			'linkParams'                     => [
				'param',
				'param2',
			],
			'pluginUrl'                      => '/location',
			'wistiaEmbedPermission'          => true,
			'site_name'                      => 'examepl.com',
			'contentLocale'                  => 'nl_NL',
			'userLocale'                     => 'nl_NL',
			'isRtl'                          => false,
			'isPremium'                      => true,
			'siteIconUrl'                    => 'https://example.org',
			'showSocial'                     => [
				'facebook' => false,
				'twitter'  => false,
			],
			'sitewideSocialImage'            => null,
			'isPrivateBlog'                  => false,
			'currentPromotions'              => [
				'the promotion',
				'another one',
			],
			'blackFridayBlockEditorUrl'      => '',
		];

		Monkey\Functions\expect( 'admin_url' )->andReturn( 'https://example.org' );
		Monkey\Functions\expect( 'home_url' )->andReturn( 'https://example.org' );
		Monkey\Functions\expect( 'get_option' )
				->once()
				->with( 'blog_public' )
				->andReturn( '1' );

		$this->alert_dismissal_action->expects( 'all_dismissed' )->andReturn( [ 'the alert' ] );
		$this->promotion_manager->expects( 'get_current_promotions' )->andReturn( [ 'the promotion', 'another one' ] );
		$this->promotion_manager->expects( 'is' )->andReturnFalse();
		$this->short_link_helper->expects( 'get' )->andReturn( 'https://expl.c' );
		$this->options_helper->expects( 'get' )->with( 'og_default_image' )->andReturn( null );
		$this->options_helper->expects( 'get' )->with( 'opengraph', false )->andReturn( false );
		$this->options_helper->expects( 'get' )->with( 'twitter', false )->andReturn( false );

		$this->assertSame( $expected, $this->instance->get_site_information() );
	}
}

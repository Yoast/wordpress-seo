<?php

// @phpcs:disable Yoast.NamingConventions.NamespaceName.TooLong -- This namespace should reflect the namespace of the original class.
namespace Yoast\WP\SEO\Tests\WP\Editors\Framework\Site;

use Mockery;
use Yoast\WP\SEO\Actions\Alert_Dismissal_Action;
use Yoast\WP\SEO\Editors\Framework\Site\Post_Site_Information;
use Yoast\WP\SEO\Helpers\Options_Helper;
use Yoast\WP\SEO\Helpers\Product_Helper;
use Yoast\WP\SEO\Helpers\Short_Link_Helper;
use Yoast\WP\SEO\Introductions\Infrastructure\Wistia_Embed_Permission_Repository;
use Yoast\WP\SEO\Promotions\Application\Promotion_Manager;
use Yoast\WP\SEO\Surfaces\Meta_Surface;
use Yoast\WP\SEO\Tests\WP\TestCase;

/**
 * Class Post_Site_Information_Test
 *
 * @group editors
 *
 * @coversDefaultClass \Yoast\WP\SEO\Editors\Framework\Site\Post_Site_Information
 */
final class Post_Site_Information_Test extends TestCase {

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
	public function set_up() {
		parent::set_up();
		$this->promotion_manager = Mockery::mock( Promotion_Manager::class );
		$this->promotion_manager->expects( 'get_current_promotions' )->andReturn( [] );
		$this->promotion_manager->expects( 'is' )->with( 'black-friday-2023-checklist' )->andReturn( false );
		$this->short_link_helper = \YoastSEO()->helpers->short_link;
		$this->wistia_embed_repo = Mockery::mock( Wistia_Embed_Permission_Repository::class );
		$this->wistia_embed_repo->expects( 'get_value_for_user' )->with( 0 )->andReturnTrue();
		$this->meta_surface           = \YoastSEO()->meta;
		$this->product_helper         = \YoastSEO()->helpers->product;
		$this->options_helper         = \YoastSEO()->helpers->options;
		$this->alert_dismissal_action = \YoastSEO()->classes->get( Alert_Dismissal_Action::class );

		$this->instance = new Post_Site_Information( $this->short_link_helper, $this->wistia_embed_repo, $this->meta_surface, $this->product_helper, $this->alert_dismissal_action, $this->options_helper, $this->promotion_manager );
		$this->instance->set_permalink( 'perma' );
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
			'dismissedAlerts'            => false,
			'webinarIntroBlockEditorUrl' => $this->short_link_helper->get( 'https://yoa.st/webinar-intro-block-editor' ),
			'metabox'                    =>
				[
					'search_url'    => 'http://example.org/wp-admin/edit.php?seo_kw_filter={keyword}',
					'post_edit_url' => 'http://example.org/wp-admin/post.php?post={id}&action=edit',
					'base_url'      => 'http://example.org/',
					'site_name'     => 'Test Blog',
					'contentLocale' => 'en_US',
					'userLocale'    => 'en_US',
					'isRtl'         => false,
					'isPremium'     => false,
					'siteIconUrl'   => '',
					'showSocial'    => [
						'facebook' => true,
						'twitter'  => true,
					],
				],
			'adminUrl'                   => 'http://example.org/wp-admin/admin.php',
			'linkParams'                 => $this->short_link_helper->get_query_params(),
			'pluginUrl'                  => 'http://example.org/wp-content/plugins/wordpress-seo',
			'wistiaEmbedPermission'      => true,
			'sitewideSocialImage'        => '',
			'isPrivateBlog'              => false,
			'currentPromotions'          => [],
			'blackFridayBlockEditorUrl'  => '',
		];

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
		\update_option( 'blog_public', '0' );

		$expected = [
			'dismissedAlerts'            => false,
			'webinarIntroBlockEditorUrl' => $this->short_link_helper->get( 'https://yoa.st/webinar-intro-block-editor' ),
			'search_url'                 => 'http://example.org/wp-admin/edit.php?seo_kw_filter={keyword}',
			'post_edit_url'              => 'http://example.org/wp-admin/post.php?post={id}&action=edit',
			'base_url'                   => 'http://example.org/',
			'adminUrl'                   => 'http://example.org/wp-admin/admin.php',
			'linkParams'                 => $this->short_link_helper->get_query_params(),
			'pluginUrl'                  => 'http://example.org/wp-content/plugins/wordpress-seo',
			'wistiaEmbedPermission'      => true,
			'site_name'                  => 'Test Blog',
			'contentLocale'              => 'en_US',
			'userLocale'                 => 'en_US',
			'isRtl'                      => false,
			'isPremium'                  => false,
			'siteIconUrl'                => '',
			'showSocial'                 => [
				'facebook' => true,
				'twitter'  => true,
			],
			'sitewideSocialImage'        => '',
			'isPrivateBlog'              => true,
			'currentPromotions'          => [],
			'blackFridayBlockEditorUrl'  => '',
		];

		$site_info = $this->instance->get_site_information();

		// Reset the blog_public option before the next test.
		\update_option( 'blog_public', '1' );

		$this->assertSame( $expected, $site_info );
	}
}

<?php

// @phpcs:disable Yoast.NamingConventions.NamespaceName.TooLong -- This namespace should reflect the namespace of the original class.
namespace Yoast\WP\SEO\Tests\WP\Editors\Framework\Site;

use Mockery;
use Yoast\WP\SEO\Actions\Alert_Dismissal_Action;
use Yoast\WP\SEO\Editors\Framework\Site\Post_Site_Information;
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
		$this->promotion_manager = \YoastSEO()->classes->get( Promotion_Manager::class );
		$this->short_link_helper = \YoastSEO()->helpers->short_link;
		$this->wistia_embed_repo = Mockery::mock( Wistia_Embed_Permission_Repository::class );
		$this->wistia_embed_repo->expects( 'get_value_for_user' )->with( 0 )->andReturnTrue();
		$this->meta_surface           = \YoastSEO()->meta;
		$this->product_helper         = \YoastSEO()->helpers->product;
		$this->alert_dismissal_action = \YoastSEO()->classes->get( Alert_Dismissal_Action::class );

		$this->instance = new Post_Site_Information( $this->promotion_manager, $this->short_link_helper, $this->wistia_embed_repo, $this->meta_surface, $this->product_helper, $this->alert_dismissal_action );
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
				],
			'dismissedAlerts'            => false,
			'currentPromotions'          => [],
			'webinarIntroBlockEditorUrl' => 'https://yoa.st/webinar-intro-block-editor?php_version=7.4&platform=wordpress&platform_version=6.6-alpha-57778-src&software=free&software_version=22.7-RC3&days_active=14&user_language=en_US',
			'blackFridayBlockEditorUrl'  => '',
			'linkParams'                 =>
				[
					'php_version'      => '7.4',
					'platform'         => 'wordpress',
					'platform_version' => '6.6-alpha-57778-src',
					'software'         => 'free',
					'software_version' => '22.7-RC3',
					'days_active'      => 14,
					'user_language'    => 'en_US',
				],
			'pluginUrl'                  => 'http://example.org/wp-content/plugins/wordpress-seo',
			'wistiaEmbedPermission'      => true,
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
		$expected = [
			'search_url'                 => 'http://example.org/wp-admin/edit.php?seo_kw_filter={keyword}',
			'post_edit_url'              => 'http://example.org/wp-admin/post.php?post={id}&action=edit',
			'base_url'                   => 'http://example.org/',
			'dismissedAlerts'            => false,
			'currentPromotions'          => [],
			'webinarIntroBlockEditorUrl' => 'https://yoa.st/webinar-intro-block-editor?php_version=7.4&platform=wordpress&platform_version=6.6-alpha-57778-src&software=free&software_version=22.7-RC3&days_active=14&user_language=en_US',
			'blackFridayBlockEditorUrl'  => '',
			'linkParams'                 =>
				[
					'php_version'      => '7.4',
					'platform'         => 'wordpress',
					'platform_version' => '6.6-alpha-57778-src',
					'software'         => 'free',
					'software_version' => '22.7-RC3',
					'days_active'      => 14,
					'user_language'    => 'en_US',
				],
			'pluginUrl'                  => 'http://example.org/wp-content/plugins/wordpress-seo',
			'wistiaEmbedPermission'      => true,
			'site_name'                  => 'Test Blog',
			'contentLocale'              => 'en_US',
			'userLocale'                 => 'en_US',
			'isRtl'                      => false,
			'isPremium'                  => false,
			'siteIconUrl'                => '',

		];

		$this->assertSame( $expected, $this->instance->get_site_information() );
	}
}

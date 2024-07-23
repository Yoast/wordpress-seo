<?php
// phpcs:disable Yoast.NamingConventions.NamespaceName.TooLong
namespace Yoast\WP\SEO\Editors\Framework\Site;

use Exception;
use Yoast\WP\SEO\Helpers\Product_Helper;
use Yoast\WP\SEO\Helpers\Short_Link_Helper;
use Yoast\WP\SEO\Introductions\Infrastructure\Wistia_Embed_Permission_Repository;
use Yoast\WP\SEO\Surfaces\Meta_Surface;

/**
 * The Base_Site_Information class.
 */
abstract class Base_Site_Information {

	/**
	 * The short link helper.
	 *
	 * @var Short_Link_Helper $shortlink_helper
	 */
	protected $short_link_helper;

	/**
	 * The wistia embed permission repository.
	 *
	 * @var Wistia_Embed_Permission_Repository $wistia_embed_permission_repository
	 */
	protected $wistia_embed_permission_repository;

	/**
	 * The meta surface.
	 *
	 * @var Meta_Surface $meta
	 */
	protected $meta;

	/**
	 * The product helper.
	 *
	 * @var Product_Helper $product_helper
	 */
	protected $product_helper;

	/**
	 * The constructor.
	 *
	 * @param Short_Link_Helper                  $short_link_helper                  The short link helper.
	 * @param Wistia_Embed_Permission_Repository $wistia_embed_permission_repository The wistia embed permission
	 *                                                                               repository.
	 * @param Meta_Surface                       $meta                               The meta surface.
	 * @param Product_Helper                     $product_helper                     The product helper.
	 */
	public function __construct(
		Short_Link_Helper $short_link_helper,
		Wistia_Embed_Permission_Repository $wistia_embed_permission_repository,
		Meta_Surface $meta,
		Product_Helper $product_helper
	) {
		$this->short_link_helper                  = $short_link_helper;
		$this->wistia_embed_permission_repository = $wistia_embed_permission_repository;
		$this->meta                               = $meta;
		$this->product_helper                     = $product_helper;
	}

	/**
	 * Returns site information that is the
	 *
	 * @throws Exception If an invalid user ID is supplied to the wistia repository.
	 * @return array<string|string,string[]>
	 */
	public function get_site_information(): array {
		return [
			'linkParams'            => $this->short_link_helper->get_query_params(),
			'pluginUrl'             => \plugins_url( '', \WPSEO_FILE ),
			'wistiaEmbedPermission' => $this->wistia_embed_permission_repository->get_value_for_user( \get_current_user_id() ),
			'site_name'             => $this->meta->for_current_page()->site_name,
			'contentLocale'         => \get_locale(),
			'userLocale'            => \get_user_locale(),
			'isRtl'                 => \is_rtl(),
			'isPremium'             => $this->product_helper->is_premium(),
			'siteIconUrl'           => \get_site_icon_url(),
		];
	}

	/**
	 * Returns site information that is the
	 *
	 * @throws Exception If an invalid user ID is supplied to the wistia repository.
	 * @return array<string|string,string[]>
	 */
	public function get_legacy_site_information(): array {
		return [
			'linkParams'            => $this->short_link_helper->get_query_params(),
			'pluginUrl'             => \plugins_url( '', \WPSEO_FILE ),
			'wistiaEmbedPermission' => $this->wistia_embed_permission_repository->get_value_for_user( \get_current_user_id() ),
			'metabox'               => [
				'site_name'     => $this->meta->for_current_page()->site_name,
				'contentLocale' => \get_locale(),
				'userLocale'    => \get_user_locale(),
				'isRtl'         => \is_rtl(),
				'isPremium'     => $this->product_helper->is_premium(),
				'siteIconUrl'   => \get_site_icon_url(),
			],
		];
	}
}

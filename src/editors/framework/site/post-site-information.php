<?php
// phpcs:disable Yoast.NamingConventions.NamespaceName.TooLong
namespace Yoast\WP\SEO\Editors\Framework\Site;

use Yoast\WP\SEO\Actions\Alert_Dismissal_Action;
use Yoast\WP\SEO\Helpers\Product_Helper;
use Yoast\WP\SEO\Helpers\Short_Link_Helper;
use Yoast\WP\SEO\Introductions\Infrastructure\Wistia_Embed_Permission_Repository;
use Yoast\WP\SEO\Promotions\Application\Promotion_Manager;
use Yoast\WP\SEO\Surfaces\Meta_Surface;

/**
 * The Post_Site_Information class.
 */
class Post_Site_Information extends Base_Site_Information {

	/**
	 * The permalink.
	 *
	 * @var string $permalink
	 */
	private $permalink;

	/**
	 * The alert dismissal action.
	 *
	 * @var Alert_Dismissal_Action $alert_dismissal_action
	 */
	private $alert_dismissal_action;

	/**
	 * The promotion manager.
	 *
	 * @var Promotion_Manager $promotion_manager
	 */
	private $promotion_manager;

	/**
	 * Constructs the class.
	 *
	 * @param Promotion_Manager                  $promotion_manager                  The promotion manager.
	 * @param Short_Link_Helper                  $short_link_helper                  The short link helper.
	 * @param Wistia_Embed_Permission_Repository $wistia_embed_permission_repository The wistia embed permission
	 *                                                                               repository.
	 * @param Meta_Surface                       $meta                               The meta surface.
	 * @param Product_Helper                     $product_helper                     The product helper.
	 * @param Alert_Dismissal_Action             $alert_dismissal_action             The alert dismissal action.
	 *
	 * @return void
	 */
	public function __construct(
		Promotion_Manager $promotion_manager,
		Short_Link_Helper $short_link_helper,
		Wistia_Embed_Permission_Repository $wistia_embed_permission_repository,
		Meta_Surface $meta,
		Product_Helper $product_helper,
		Alert_Dismissal_Action $alert_dismissal_action
	) {
		parent::__construct( $short_link_helper, $wistia_embed_permission_repository, $meta, $product_helper );
		$this->promotion_manager      = $promotion_manager;
		$this->alert_dismissal_action = $alert_dismissal_action;
	}

	/**
	 * Sets the permalink.
	 *
	 * @param string $permalink The permalink.
	 *
	 * @return void
	 */
	public function set_permalink( string $permalink ): void {
		$this->permalink = $permalink;
	}

	/**
	 * Returns post specific site information together with the generic site information.
	 *
	 * @return array<string|string,string[]>
	 */
	public function get_legacy_site_information(): array {
		$dismissed_alerts = $this->alert_dismissal_action->all_dismissed();

		$data = [
			'dismissedAlerts'            => $dismissed_alerts,
			'currentPromotions'          => $this->promotion_manager->get_current_promotions(),
			'webinarIntroBlockEditorUrl' => $this->short_link_helper->get( 'https://yoa.st/webinar-intro-block-editor' ),
			'blackFridayBlockEditorUrl'  => ( $this->promotion_manager->is( 'black-friday-2023-checklist' ) ) ? $this->short_link_helper->get( 'https://yoa.st/black-friday-checklist' ) : '',
			'metabox'                    => [
				'search_url'    => $this->search_url(),
				'post_edit_url' => $this->edit_url(),
				'base_url'      => $this->base_url_for_js(),
			],
		];

		return \array_merge_recursive( $data, parent::get_legacy_site_information() );
	}

	/**
	 * Returns post specific site information together with the generic site information.
	 *
	 * @return array<string|string,string[]>
	 */
	public function get_site_information(): array {
		$dismissed_alerts = $this->alert_dismissal_action->all_dismissed();

		$data = [
			'dismissedAlerts'            => $dismissed_alerts,
			'currentPromotions'          => $this->promotion_manager->get_current_promotions(),
			'webinarIntroBlockEditorUrl' => $this->short_link_helper->get( 'https://yoa.st/webinar-intro-block-editor' ),
			'blackFridayBlockEditorUrl'  => ( $this->promotion_manager->is( 'black-friday-2023-checklist' ) ) ? $this->short_link_helper->get( 'https://yoa.st/black-friday-checklist' ) : '',
			'search_url'                 => $this->search_url(),
			'post_edit_url'              => $this->edit_url(),
			'base_url'                   => $this->base_url_for_js(),
		];

		return \array_merge( $data, parent::get_site_information() );
	}

	/**
	 * Returns the url to search for keyword for the post.
	 *
	 * @return string
	 */
	private function search_url(): string {
		return \admin_url( 'edit.php?seo_kw_filter={keyword}' );
	}

	/**
	 * Returns the url to edit the taxonomy.
	 *
	 * @return string
	 */
	private function edit_url(): string {
		return \admin_url( 'post.php?post={id}&action=edit' );
	}

	/**
	 * Returns a base URL for use in the JS, takes permalink structure into account.
	 *
	 * @return string
	 */
	private function base_url_for_js(): string {
		global $pagenow;

		// The default base is the home_url.
		$base_url = \home_url( '/', null );

		if ( $pagenow === 'post-new.php' ) {
			return $base_url;
		}

		// If %postname% is the last tag, just strip it and use that as a base.
		if ( \preg_match( '#%postname%/?$#', $this->permalink ) === 1 ) {
			$base_url = \preg_replace( '#%postname%/?$#', '', $this->permalink );
		}

		// If %pagename% is the last tag, just strip it and use that as a base.
		if ( \preg_match( '#%pagename%/?$#', $this->permalink ) === 1 ) {
			$base_url = \preg_replace( '#%pagename%/?$#', '', $this->permalink );
		}

		return $base_url;
	}
}

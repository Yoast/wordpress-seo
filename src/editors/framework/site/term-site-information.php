<?php
// phpcs:disable Yoast.NamingConventions.NamespaceName.TooLong
namespace Yoast\WP\SEO\Editors\Framework\Site;

use WP_Taxonomy;
use WP_Term;
use Yoast\WP\SEO\Helpers\Options_Helper;
use Yoast\WP\SEO\Helpers\Product_Helper;
use Yoast\WP\SEO\Helpers\Short_Link_Helper;
use Yoast\WP\SEO\Introductions\Infrastructure\Wistia_Embed_Permission_Repository;
use Yoast\WP\SEO\Surfaces\Meta_Surface;

/**
 * The Term_Site_Information class.
 */
class Term_Site_Information extends Base_Site_Information {

	/**
	 * The options helper.
	 *
	 * @var Options_Helper
	 */
	private $options_helper;

	/**
	 * The taxonomy.
	 *
	 * @var WP_Taxonomy|false
	 */
	private $taxonomy;

	/**
	 * The term.
	 *
	 * @var WP_Term|string|false
	 */
	private $term;

	/**
	 * The constructor.
	 *
	 * @param Options_Helper                     $options_helper                     The options helper.
	 * @param Short_Link_Helper                  $short_link_helper                  The short link helper.
	 * @param Wistia_Embed_Permission_Repository $wistia_embed_permission_repository The wistia embed permission
	 *                                                                               repository.
	 * @param Meta_Surface                       $meta                               The meta surface.
	 * @param Product_Helper                     $product_helper                     The product helper.
	 */
	public function __construct(
		Options_Helper $options_helper,
		Short_Link_Helper $short_link_helper,
		Wistia_Embed_Permission_Repository $wistia_embed_permission_repository,
		Meta_Surface $meta,
		Product_Helper $product_helper
	) {
		parent::__construct( $short_link_helper, $wistia_embed_permission_repository, $meta, $product_helper );
		$this->options_helper = $options_helper;
	}

	/**
	 *  Sets the term for the information object and retrieves its taxonomy.
	 *
	 * @param WP_Term|string|false $term The term.
	 *
	 * @return void
	 */
	public function set_term( $term ) {
		$this->term     = $term;
		$this->taxonomy = \get_taxonomy( $term->taxonomy );
	}

	/**
	 * Returns term specific site information together with the generic site information.
	 *
	 * @return array<string|string,string[]>
	 */
	public function get_site_information(): array {
		$data = [
			'search_url'    => $this->search_url(),
			'post_edit_url' => $this->edit_url(),
			'base_url'      => $this->base_url_for_js(),
		];

		return \array_merge_recursive( $data, parent::get_site_information() );
	}

	/**
	 * Returns term specific site information together with the generic site information.
	 *
	 * @return array<string|string,string[]>
	 */
	public function get_legacy_site_information(): array {
		$data = [
			'metabox' => [
				'search_url'    => $this->search_url(),
				'post_edit_url' => $this->edit_url(),
				'base_url'      => $this->base_url_for_js(),
			],
		];

		return \array_merge_recursive( $data, parent::get_legacy_site_information() );
	}

	/**
	 * Returns the url to search for keyword for the taxonomy.
	 *
	 * @return string
	 */
	private function search_url(): string {
		return \admin_url( 'edit-tags.php?taxonomy=' . $this->term->taxonomy . '&seo_kw_filter={keyword}' );
	}

	/**
	 * Returns the url to edit the taxonomy.
	 *
	 * @return string
	 */
	private function edit_url(): string {
		return \admin_url( 'term.php?action=edit&taxonomy=' . $this->term->taxonomy . '&tag_ID={id}' );
	}

	/**
	 * Returns a base URL for use in the JS, takes permalink structure into account.
	 *
	 * @return string
	 */
	private function base_url_for_js(): string {
		$base_url = \home_url( '/', null );
		if ( ! $this->options_helper->get( 'stripcategorybase', false ) ) {
			if ( $this->taxonomy->rewrite ) {
				$base_url = \trailingslashit( $base_url . $this->taxonomy->rewrite['slug'] );
			}
		}

		return $base_url;
	}
}

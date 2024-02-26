<?php

namespace Yoast\WP\SEO\WooCommerce_Editor\Framework;

use Yoast\WP\SEO\Helpers\Capability_Helper;
use Yoast\WP\SEO\Helpers\Options_Helper;

/**
 * Collects the "adminL10n" data that is passed to the editor integration JS side.
 */
class WooCommerce_Editor_Admin_L10n {

	/**
	 * Holds the Capability_Helper instance.
	 *
	 * @var Capability_Helper
	 */
	private $capability_helper;

	/**
	 * Holds the Options_Helper instance.
	 *
	 * @var Options_Helper
	 */
	private $options_helper;

	/**
	 * Constructs the instance.
	 *
	 * @param Capability_Helper $capability_helper The Capability_Helper.
	 * @param Options_Helper    $options_helper    The Options_Helper.
	 *
	 * @constructor
	 */
	public function __construct( Capability_Helper $capability_helper, Options_Helper $options_helper ) {
		$this->capability_helper = $capability_helper;
		$this->options_helper    = $options_helper;
	}

	/**
	 * Getter for the Adminl10n array. Applies the wpseo_admin_l10n filter.
	 *
	 * Copied from WPSEO_Utils::get_admin_l10n() and modified to use a post type argument.
	 *
	 * @param string $post_type The post type to check.
	 *
	 * @return array<string,int,bool> The Adminl10n array.
	 */
	public function get_data_for( string $post_type ): array {
		$label_object = \get_post_type_object( $post_type );

		$wpseo_admin_l10n = [
			'displayAdvancedTab'    => $this->capability_helper->current_user_can( 'wpseo_edit_advanced_metadata' ) || ! $this->options_helper->get( 'disableadvanced_meta' ),
			'noIndex'               => (bool) $this->options_helper->get( 'noindex-' . $post_type, false ),
			'isPostType'            => (bool) $post_type,
			'postType'              => $post_type,
			'postTypeNamePlural'    => $label_object->label,
			'postTypeNameSingular'  => $label_object->labels->singular_name,
			'isBreadcrumbsDisabled' => $this->options_helper->get( 'breadcrumbs-enable', false ) !== true && ! \current_theme_supports( 'yoast-seo-breadcrumbs' ),
			// phpcs:ignore Generic.ControlStructures.DisallowYodaConditions -- Bug: squizlabs/PHP_CodeSniffer#2962.
			'isPrivateBlog'         => ( (string) \get_option( 'blog_public' ) ) === '0',
			'news_seo_is_active'    => ( \defined( 'WPSEO_NEWS_FILE' ) ),
		];

		$additional_entries = \apply_filters( 'wpseo_admin_l10n', [] );
		if ( \is_array( $additional_entries ) ) {
			$wpseo_admin_l10n = \array_merge( $wpseo_admin_l10n, $additional_entries );
		}

		return $wpseo_admin_l10n;
	}
}

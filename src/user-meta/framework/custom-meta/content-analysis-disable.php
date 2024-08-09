<?php

// phpcs:disable Yoast.NamingConventions.NamespaceName.TooLong
namespace Yoast\WP\SEO\User_Meta\Framework\Custom_Meta;

use Yoast\WP\SEO\Helpers\Options_Helper;
use Yoast\WP\SEO\User_Meta\Domain\Custom_Meta_Interface;

/**
 * The Content_Analysis_Disable custom meta.
 */
class Content_Analysis_Disable implements Custom_Meta_Interface {

	/**
	 * The options helper.
	 *
	 * @var Options_Helper
	 */
	private $options_helper;

	/**
	 * The constructor.
	 *
	 * @param Options_Helper $options_helper The options helper.
	 */
	public function __construct( Options_Helper $options_helper ) {
		$this->options_helper = $options_helper;
	}

	/**
	 * Returns the position where the custom meta's form field should be rendered at.
	 *
	 * @return int The position where the custom meta's form field should be rendered at.
	 */
	public function get_render_position(): int {
		return 5;
	}

	/**
	 * Returns the db key of the Content_Analysis_Disable custom meta.
	 *
	 * @return string The db key of the Content_Analysis_Disable custom meta.
	 */
	public function get_key(): string {
		return 'wpseo_content_analysis_disable';
	}

	/**
	 * Returns the id of the custom meta's form field.
	 *
	 * @return string The id of the custom meta's form field.
	 */
	public function get_field_id(): string {
		return 'wpseo_content_analysis_disable';
	}

	/**
	 * Returns whether the respective global setting is enabled.
	 *
	 * @return bool Whether the respective global setting is enabled.
	 */
	public function is_setting_enabled(): bool {
		return ( $this->options_helper->get( 'content_analysis_active', false ) );
	}

	/**
	 * Returns whether the custom meta is allowed to be empty.
	 *
	 * @return bool Whether the custom meta is allowed to be empty.
	 */
	public function is_empty_allowed(): bool {
		return true;
	}

	/**
	 * Renders the custom meta's field in the user form.
	 *
	 * @param int $user_id The user ID.
	 *
	 * @return void
	 */
	public function render_field( $user_id ): void {
		echo '<input
			class="yoast-settings__checkbox double"
			type="checkbox"
			id="' . \esc_attr( $this->get_field_id() ) . '"
			name="' . \esc_attr( $this->get_field_id() ) . '"
			aria-describedby="wpseo_content_analysis_disable_desc"
			value="on" '
			. \checked( \get_the_author_meta( 'wpseo_content_analysis_disable', $user_id ), 'on', false )
		. '/>';
		echo '<label class="yoast-label-strong" for="' . \esc_attr( $this->get_field_id() ) . '">'
			. \esc_html__( 'Disable readability analysis', 'wordpress-seo' )
		. '</label><br>';
		echo '<p class="description" id="wpseo_content_analysis_disable_desc">'
			. \esc_html__( 'Removes the readability analysis section from the metabox and disables all readability-related suggestions.', 'wordpress-seo' )
		. '</p>';
	}
}

<?php

// phpcs:disable Yoast.NamingConventions.NamespaceName.TooLong
namespace Yoast\WP\SEO\User_Meta\Framework\Custom_Meta;

use Yoast\WP\SEO\Helpers\Options_Helper;
use Yoast\WP\SEO\User_Meta\Domain\Custom_Meta_Interface;

/**
 * The Noindex_Author custom meta.
 */
class Noindex_Author implements Custom_Meta_Interface {

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
	 * Returns the priority which the custom meta's form field should be rendered with.
	 *
	 * @return int The priority which the custom meta's form field should be rendered with.
	 */
	public function get_render_priority(): int {
		return 300;
	}

	/**
	 * Returns the db key of the Noindex_Author custom meta.
	 *
	 * @return string The db key of the Noindex_Author custom meta.
	 */
	public function get_key(): string {
		return 'wpseo_noindex_author';
	}

	/**
	 * Returns the id of the custom meta's form field.
	 *
	 * @return string The id of the custom meta's form field.
	 */
	public function get_field_id(): string {
		return 'wpseo_noindex_author';
	}

	/**
	 * Returns the meta value.
	 *
	 * @param int $user_id The user ID.
	 *
	 * @return string The meta value.
	 */
	public function get_value( $user_id ): string {
		return \get_the_author_meta( $this->get_key(), $user_id );
	}

	/**
	 * Returns whether the respective global setting is enabled.
	 *
	 * @return bool Whether the respective global setting is enabled.
	 */
	public function is_setting_enabled(): bool {
		return ( ! $this->options_helper->get( 'disable-author' ) );
	}

	/**
	 * Returns whether the custom meta is allowed to be empty.
	 *
	 * @return bool Whether the custom meta is allowed to be empty.
	 */
	public function is_empty_allowed(): bool {
		return false;
	}

	/**
	 * Renders the custom meta's field in the user form.
	 *
	 * @param int $user_id The user ID.
	 *
	 * @return void
	 */
	public function render_field( $user_id ): void {
		echo '

		<input
			class="yoast-settings__checkbox double"
			type="checkbox"
			id="' . \esc_attr( $this->get_field_id() ) . '"
			name="' . \esc_attr( $this->get_field_id() ) . '"
			value="on" '
			. \checked( $this->get_value( $user_id ), 'on', false )
		. '/>';

		echo '

		<label class="yoast-label-strong" for="' . \esc_attr( $this->get_field_id() ) . '">'
			. \esc_html__( 'Do not allow search engines to show this author\'s archives in search results.', 'wordpress-seo' )
		. '</label><br>';
	}
}

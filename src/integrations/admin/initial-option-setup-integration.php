<?php

namespace Yoast\WP\SEO\Integrations\Admin;

use Yoast\WP\SEO\Conditionals\Admin_Conditional;
use Yoast\WP\SEO\Helpers\Options_Helper;
use Yoast\WP\SEO\Integrations\Integration_Interface;

/**
 * This integration registers a run of the translating option defaults, whenever applicable.
 */
class Initial_Option_Setup_Integration implements Integration_Interface {

	/**
	 * The options helper.
	 *
	 * @var Options_Helper
	 */
	private $options_helper;

	/**
	 * Returns the conditionals based in which this loadable should be active.
	 *
	 * In this case: when on an admin page.
	 *
	 * @return array<string>
	 */
	public static function get_conditionals() {
		return [ Admin_Conditional::class ];
	}

	/**
	 * Initial_Option_Setup_Integration constructor.
	 *
	 * @param Options_Helper $options_helper The options helper.
	 */
	public function __construct( Options_Helper $options_helper ) {
		$this->options_helper = $options_helper;
	}

	/**
	 * Registers hooks.
	 *
	 * @return void
	 */
	public function register_hooks() {
		\add_action( 'admin_init', [ $this, 'maybe_translate_defaults' ] );
		\add_action( 'new_public_post_type_notifications', [ $this, 'new_post_types' ], 20, 1 );
		\add_action( 'new_public_taxonomy_notifications', [ $this, 'new_taxonomies' ], 20, 1 );
	}

	/**
	 * Translate defaults of newly made public post types.
	 *
	 * @param array<string> $newly_made_public_post_types The newly made public post types.
	 *
	 * @return void
	 */
	public function new_post_types( $newly_made_public_post_types ) {
		foreach ( $newly_made_public_post_types as $newly_made_public_post_type ) {
			$this->replace_enriched_defaults_with_translations( $newly_made_public_post_type, false );
		}
	}

	/**
	 * Translate defaults of newly made public taxonomies.
	 *
	 * @param array<string> $newly_made_public_taxonomies The newly made public taxonomies.
	 *
	 * @return void
	 */
	public function new_taxonomies( $newly_made_public_taxonomies ) {
		foreach ( $newly_made_public_taxonomies as $newly_made_public_taxonomy ) {
			$this->replace_enriched_defaults_with_translations( false, $newly_made_public_taxonomy );
		}
	}

	/**
	 * Possibly translates option defaults.
	 *
	 * @return void
	 */
	public function maybe_translate_defaults() {
		if ( $this->options_helper->get( 'set_up_options', false ) ) {
			return;
		}

		$this->options_helper->set( 'set_up_options', true );

		$this->replace_defaults_with_translations();
		$this->replace_enriched_defaults_with_translations( false, false );
	}

	/**
	 * Replaces options with translations, if values are the default ones.
	 *
	 * @return void
	 */
	private function replace_defaults_with_translations() {
		$translated_default_titles   = $this->options_helper->get_maybe_translated_default_titles( true );
		$untranslated_default_titles = $this->options_helper->get_maybe_translated_default_titles( false );

		foreach ( $translated_default_titles as $key => $value ) {
			if ( \trim( $this->options_helper->get( $key ) ) === \trim( $untranslated_default_titles[ $key ] ) ) {
				$this->options_helper->set( $key, $value );
			}
		}
	}

	/**
	 * Replaces enriched options with translations, if values are the default ones.
	 *
	 * @param string|false $specific_post_type The post types whose defaults should be enriched, false for all post types.
	 * @param string|false $specific_taxonomy  The taxonomies whose defaults should be enriched, false for all taxonomies.
	 *
	 * @return void
	 */
	private function replace_enriched_defaults_with_translations( $specific_post_type, $specific_taxonomy ) {
		$translated_enriched_default_titles   = $this->options_helper->get_maybe_translated_enriched_defaults( true, $specific_post_type, $specific_taxonomy );
		$untranslated_enriched_default_titles = $this->options_helper->get_maybe_translated_enriched_defaults( false, $specific_post_type, $specific_taxonomy );

		foreach ( $translated_enriched_default_titles as $key => $value ) {
			if ( \trim( $this->options_helper->get( $key ) ) === \trim( $untranslated_enriched_default_titles[ $key ] ) ) {
				$this->options_helper->set( $key, $value );
			}
		}
	}
}

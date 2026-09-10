<?php

// phpcs:disable Yoast.NamingConventions.NamespaceName.TooLong -- Needed in the folder structure.
namespace Yoast\WP\SEO\Abilities\User_Interface;

use Yoast\WP\SEO\Abilities\Domain\Ability_Interface;
use Yoast\WP\SEO\Conditionals\Abilities_API_Conditional;
use Yoast\WP\SEO\Integrations\Integration_Interface;

/**
 * Integration that registers Yoast SEO abilities with the WordPress Abilities API.
 */
class Abilities_Integration implements Integration_Interface {

	/**
	 * The abilities to register.
	 *
	 * @var Ability_Interface[]
	 */
	private $abilities;

	/**
	 * Returns the conditionals based on which this loadable should be active.
	 *
	 * @return array<string> The conditionals.
	 */
	public static function get_conditionals() {
		return [ Abilities_API_Conditional::class ];
	}

	/**
	 * Constructor.
	 *
	 * @param Ability_Interface ...$abilities The abilities to register.
	 */
	public function __construct( Ability_Interface ...$abilities ) {
		$this->abilities = $abilities;
	}

	/**
	 * Registers hooks with WordPress.
	 *
	 * @return void
	 */
	public function register_hooks() {
		\add_action( 'wp_abilities_api_init', [ $this, 'register_abilities' ] );
	}

	/**
	 * Registers the available Yoast SEO abilities.
	 *
	 * @return void
	 */
	public function register_abilities() {
		foreach ( $this->abilities as $ability ) {
			if ( ! $ability->is_available() ) {
				continue;
			}

			\wp_register_ability( $ability->get_name(), $ability->get_args() );
		}
	}

	/**
	 * Checks whether the current user can manage Yoast SEO.
	 *
	 * @deprecated 28.6
	 * @codeCoverageIgnore
	 *
	 * @return bool Whether the current user can manage Yoast SEO.
	 */
	public function can_manage_seo(): bool {
		\_deprecated_function( __METHOD__, 'Yoast SEO 28.6', 'Abstract_Score_Ability::can_manage_seo' );

		return \YoastSEO()->helpers->capability->current_user_can( 'wpseo_manage_options' );
	}

	/**
	 * Checks whether the current user can edit advanced SEO metadata.
	 *
	 * @deprecated 28.6
	 * @codeCoverageIgnore
	 *
	 * @return bool Whether the current user can edit advanced SEO metadata.
	 */
	public function can_edit_advanced_metadata(): bool {
		\_deprecated_function( __METHOD__, 'Yoast SEO 28.6', 'Abstract_Post_SEO_Data_Ability::can_edit_advanced_metadata' );

		return \YoastSEO()->helpers->capability->current_user_can( 'wpseo_edit_advanced_metadata' );
	}

	/**
	 * Checks whether the current user can read scores.
	 *
	 * @deprecated 28.2
	 * @codeCoverageIgnore Because of deprecation.
	 *
	 * @return bool Whether the current user can read scores.
	 */
	public function can_read_scores(): bool {
		\_deprecated_function( __METHOD__, 'Yoast SEO 28.2', 'Abstract_Score_Ability::can_manage_seo' );

		return \YoastSEO()->helpers->capability->current_user_can( 'wpseo_manage_options' );
	}
}

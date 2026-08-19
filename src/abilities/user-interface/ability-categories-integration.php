<?php

// phpcs:disable Yoast.NamingConventions.NamespaceName.TooLong -- Needed in the folder structure.
namespace Yoast\WP\SEO\Abilities\User_Interface;

use Yoast\WP\SEO\Conditionals\Abilities_API_Conditional;
use Yoast\WP\SEO\Integrations\Integration_Interface;

/**
 * Integration that registers Yoast SEO ability categories with the WordPress Abilities API.
 */
class Ability_Categories_Integration implements Integration_Interface {

	public const CATEGORY_SLUG = 'yoast-seo';

	/**
	 * Returns the conditionals based on which this loadable should be active.
	 *
	 * @return array<string> The conditionals.
	 */
	public static function get_conditionals() {
		return [ Abilities_API_Conditional::class ];
	}

	/**
	 * Registers hooks with WordPress.
	 *
	 * @return void
	 */
	public function register_hooks() {
		\add_action( 'wp_abilities_api_categories_init', [ $this, 'register_categories' ] );
	}

	/**
	 * Registers the Yoast SEO ability category.
	 *
	 * @return void
	 */
	public function register_categories() {
		\wp_register_ability_category(
			self::CATEGORY_SLUG,
			[
				'label'       => \__( 'Yoast SEO', 'wordpress-seo' ),
				'description' => \__( 'SEO analysis capabilities provided by Yoast SEO.', 'wordpress-seo' ),
			],
		);
	}
}

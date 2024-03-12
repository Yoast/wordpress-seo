<?php

namespace Yoast\WP\SEO\Initializers;

use Yoast\WP\SEO\Conditionals\Non_Multisite_Conditional;
use Yoast\WP\SEO\Conditionals\Third_Party\Wordproof_Integration_Active_Conditional;
use Yoast\WP\SEO\Conditionals\Third_Party\Wordproof_Plugin_Inactive_Conditional;

/**
 * Add wordproof meta field.
 */
class Wordproof_Metadata implements Initializer_Interface {

	/**
	 * Returns the conditionals based in which this loadable should be active.
	 *
	 * @return array<Wordproof_Plugin_Inactive_Conditional|Non_Multisite_Conditional|Wordproof_Integration_Active_Conditional>
	 */
	public static function get_conditionals() {
		return [
			Wordproof_Plugin_Inactive_Conditional::class,
			Non_Multisite_Conditional::class,
			Wordproof_Integration_Active_Conditional::class,
		];
	}

	/**
	 * Initializes the integration.
	 *
	 * This is the place to register hooks and filters.
	 *
	 * @return void
	 */
	public function initialize() {
		/**
		 * Called by WPSEO_Meta to add extra meta fields to the ones defined there.
		 */
		\add_filter( 'add_extra_wpseo_meta_fields', [ $this, 'add_meta_field' ] );
	}

	/**
	 * Adds the WordProof integration toggle to the array.
	 *
	 * @param array<string|array<string>> $fields The currently registered meta fields.
	 *
	 * @return array<string|array<string>> A new array with meta fields.
	 */
	public function add_meta_field( $fields ) {
		$fields['advanced']['wordproof_timestamp'] = [
			'type'          => 'hidden',
			/* translators: %s expands to the post type name. */
			'title'         => \__( 'Timestamp this %s', 'wordpress-seo' ),
			'default_value' => '0',
			'description'   => \__( 'Use WordProof to timestamp this page to comply with legal regulations and join the fight for a more transparant and accountable internet.', 'wordpress-seo' ),
			'options'       => [
				'0' => \__( 'Off', 'wordpress-seo' ),
				'1' => \__( 'On', 'wordpress-seo' ),
			],
		];

		return $fields;
	}
}

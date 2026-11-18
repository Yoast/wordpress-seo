<?php

// phpcs:disable Yoast.NamingConventions.NamespaceName.TooLong -- Needed in the folder structure.
namespace Yoast\WP\SEO\Abilities\User_Interface\Abilities;

/**
 * The ability that enables or disables the Schema aggregation endpoint feature.
 *
 * Only the option is written: the first time the feature is enabled, the option watcher records
 * the timestamp that the schema aggregator's cache warming and announcements rely on.
 */
class Set_Schema_Aggregation_Status_Ability extends Abstract_Set_Option_Status_Ability {

	/**
	 * Returns the part of the ability name that follows the category slug.
	 *
	 * @return string The ability slug.
	 */
	protected function get_slug(): string {
		return 'set-schema-aggregation-endpoint-status';
	}

	/**
	 * Returns the name of the option that enables the Schema aggregation endpoint feature.
	 *
	 * @return string The option name.
	 */
	protected function get_option_name(): string {
		return 'enable_schema_aggregation_endpoint';
	}

	/**
	 * Returns the human-readable name of the feature.
	 *
	 * @return string The feature name.
	 */
	protected function get_feature_name(): string {
		return 'Schema aggregation endpoint';
	}

	/**
	 * Returns the label of the ability.
	 *
	 * @return string The label.
	 */
	protected function get_label(): string {
		return \__( 'Set Schema Aggregation Endpoint Status', 'wordpress-seo' );
	}

	/**
	 * Returns the description of the ability.
	 *
	 * @return string The description.
	 */
	protected function get_description(): string {
		return \sprintf(
			/* translators: %s expands to Yoast SEO */
			\__( 'Enable or disable %s\'s Schema aggregation endpoint feature. Enabling it serves the site\'s public structured data as a schema map at /schemamap.xml and through the schema aggregator REST endpoints, so conversational interfaces like NLWeb can query the site\'s content; disabling it stops serving them.', 'wordpress-seo' ),
			'Yoast SEO',
		);
	}
}

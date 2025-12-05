<?php


// phpcs:disable Yoast.NamingConventions.NamespaceName.TooLong
namespace Yoast\WP\SEO\Schema\Application\Configuration;
/**
 * Responsible for the schema configuration.
 */
class Schema_Configuration {

	/**
	 * Returns the schema configuration.
	 *
	 * @return array<string, bool>
	 */
	public function get_configuration(): array {
		$schema_filtered_output = $this->get_filtered_schema_output();

		$configuration = [
			'isSchemaDisabled' => ( $schema_filtered_output === [] || $schema_filtered_output === false ),
		];

		return $configuration;
	}

	/**
	 * Gets the filtered schema output.
	 *
	 * @return string|array<string> The filtered schema output.
	 */
	private function get_filtered_schema_output() {
		$deprecated_data = [
			'_deprecated' => 'Please use the "wpseo_schema_*" filters to extend the Yoast SEO schema data - see the WPSEO_Schema class.',
		];

		/**
		 * Filter documented in Schema_Presenter::present().
		 */
		return \apply_filters( 'wpseo_json_ld_output', $deprecated_data, '' );
	}
}

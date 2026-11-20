<?php

// phpcs:disable Yoast.NamingConventions.NamespaceName.TooLong -- Needed in the folder structure.
namespace Yoast\WP\SEO\Abilities\Infrastructure\Features;

use Yoast\WP\SEO\Schema\Application\Configuration\Schema_Configuration;

/**
 * The Schema Framework feature, which outputs the structured data graph.
 */
class Schema_Framework_Feature extends Abstract_Feature {

	/**
	 * The key of the feature.
	 *
	 * @var string
	 */
	public const KEY = 'schema_framework';

	/**
	 * The name of the boolean option that enables the feature.
	 *
	 * @var string
	 */
	public const OPTION_NAME = 'enable_schema';

	/**
	 * The human-readable name of the feature.
	 *
	 * @var string
	 */
	public const NAME = 'Schema Framework';

	/**
	 * The Schema configuration.
	 *
	 * @var Schema_Configuration
	 */
	private $schema_configuration;

	/**
	 * Constructor.
	 *
	 * @param Schema_Configuration $schema_configuration The Schema configuration.
	 */
	public function __construct( Schema_Configuration $schema_configuration ) {
		$this->schema_configuration = $schema_configuration;
	}

	/**
	 * Returns the key of the feature.
	 *
	 * @return string The key.
	 */
	public function get_key(): string {
		return self::KEY;
	}

	/**
	 * Returns the name of the boolean option that enables the feature.
	 *
	 * @return string The option name.
	 */
	public function get_option_name(): string {
		return self::OPTION_NAME;
	}

	/**
	 * Returns the human-readable name of the feature.
	 *
	 * @return string The name.
	 */
	public function get_name(): string {
		return self::NAME;
	}

	/**
	 * Returns whether code other than the setting turns the feature off, through the `wpseo_json_ld_output` filter.
	 *
	 * @return bool Whether the feature is turned off programmatically.
	 */
	public function is_disabled_programmatically(): bool {
		return $this->schema_configuration->is_schema_disabled_programmatically();
	}
}

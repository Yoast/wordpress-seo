<?php


// phpcs:disable Yoast.NamingConventions.NamespaceName.TooLong
namespace Yoast\WP\SEO\Schema\Application\Configuration;

use Yoast\WP\SEO\Helpers\Schema_Helper;
/**
 * Responsible for the schema configuration.
 */
class Schema_Configuration {

	/**
	 * The schema presenter.
	 *
	 * @var Schema_Helper
	 */
	private $schema_helper;

	/**
	 * The constructor.
	 *
	 * @param Schema_Helper $schema_helper The schema helper.
	 */
	public function __construct(
		Schema_Helper $schema_helper
	) {
		$this->schema_helper = $schema_helper;
	}

	/**
	 * Returns the schema configuration.
	 *
	 * @return array<string, bool>
	 */
	public function get_configuration(): array {
		$schema_filtered_output = $this->schema_helper->get_filtered_schema_output();

		$configuration = [
			'isSchemaDisabled' => ( $schema_filtered_output === [] || $schema_filtered_output === false ),
		];

		return $configuration;
	}
}

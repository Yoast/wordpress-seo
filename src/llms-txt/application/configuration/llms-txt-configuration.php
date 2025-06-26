<?php


// phpcs:disable Yoast.NamingConventions.NamespaceName.TooLong
namespace Yoast\WP\SEO\Llms_Txt\Application\Configuration;

use Yoast\WP\SEO\Llms_Txt\Application\Health_Check\File_Runner;
use Yoast\WP\SEO\Helpers\Options_Helper;

/**
 * Responsible for the llms.txt configuration.
 */
class Llms_Txt_Configuration {

	/**
	 * Runs the health check.
	 *
	 * @var File_Runner
	 */
	private $runner;

	/**
	 * The options helper.
	 *
	 * @var Options_Helper
	 */
	private $options_helper;

	/**
	 * The constructor.
	 *
	 * @param File_Runner    $runner         The File_Generation health check runner.
	 * @param Options_Helper $options_helper The options helper.
	 */
	public function __construct(
		File_Runner $runner,
		Options_Helper $options_helper
	) {
		$this->runner = $runner;
		$this->options_helper = $options_helper;
	}

	/**
	 * Returns a configuration
	 *
	 * @return array<string, array<string>|array<string, string|array<string, array<string, int>>>>
	 */
	public function get_configuration(): array {
		$this->runner->run();

		$configuration = [
			'generationFailure'       => ! $this->runner->is_successful(),
			'generationFailureReason' => $this->runner->get_generation_failure_reason(),
			'llmsTxtUrl'              => \home_url( 'llms.txt' ),
		];

		return $configuration;
	}
}

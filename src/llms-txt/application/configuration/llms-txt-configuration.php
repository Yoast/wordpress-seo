<?php


// phpcs:disable Yoast.NamingConventions.NamespaceName.TooLong
namespace Yoast\WP\SEO\Llms_Txt\Application\Configuration;

use Yoast\WP\SEO\Llms_Txt\Application\Health_Check\File_Runner;

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
	 * The constructor.
	 *
	 * @param File_Runner $runner The File_Generation health check runner.
	 */
	public function __construct(
		File_Runner $runner
	) {
		$this->runner = $runner;
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

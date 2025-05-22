<?php

namespace Yoast\WP\SEO\Llms_Txt\User_Interface\Health_Check;

use Yoast\WP\SEO\Services\Health_Check\Health_Check;

/**
 * Fails when the llms.txt file fails to be generated.
 */
class File_Check extends Health_Check {

	/**
	 * Runs the health check.
	 *
	 * @var File_Runner
	 */
	private $runner;

	/**
	 * Generates WordPress-friendly health check results.
	 *
	 * @var File_Reports
	 */
	private $reports;

	/**
	 * Constructor.
	 *
	 * @param  File_Runner  $runner  The object that implements the actual health check.
	 * @param  File_Reports $reports The object that generates WordPress-friendly results.
	 */
	public function __construct( File_Runner $runner, File_Reports $reports ) {
		$this->runner  = $runner;
		$this->reports = $reports;
		$this->reports->set_test_identifier( $this->get_test_identifier() );

		$this->set_runner( $this->runner );
	}

	/**
	 * Returns a human-readable label for this health check.
	 *
	 * @return string The human-readable label.
	 */
	public function get_test_label() {
		return \__( 'Your llms.txt file couldn\'t be auto-generated', 'wordpress-seo' );
	}

	/**
	 * Returns the WordPress-friendly health check result.
	 *
	 * @return string[] The WordPress-friendly health check result.
	 */
	protected function get_result() {
		if ( $this->runner->is_successful() ) {
			return $this->reports->get_success_result();
		}

		return $this->reports->get_generation_failure_result( $this->runner->get_generation_failure_reason() );
	}

	/**
	 * Returns whether the health check should be excluded from the results.
	 *
	 * @return false.
	 */
	public function is_excluded() {
		return \get_option( 'wpseo_llms_txt_file_failure', 'does_not_exist' ) === 'does_not_exist';
	}
}

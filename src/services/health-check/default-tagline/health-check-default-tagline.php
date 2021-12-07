<?php

namespace Yoast\WP\SEO\Services\Health_Check\Default_Tagline;

use Yoast\WP\SEO\Services\Health_Check\Health_Check;

/**
 * Health_Check_Default_Tagline
 */
class Health_Check_Default_Tagline extends Health_Check {
	
	/**
	 * runner
	 *
	 * @var Health_Check_Default_Tagline_Runner
	 */
	private $runner;	

	/**
	 * presenter
	 *
	 * @var Health_Check_Default_Tagline_Presenter
	 */
	private $presenter;

	public function __construct() {
		$this->runner = new Health_Check_Default_Tagline_Runner();
		$this->presenter = new Health_Check_Default_Tagline_Presenter($this->get_test_identifier());

		$this->set_runner($this->runner);
	}
	
	/**
	 * get_test_label
	 *
	 * @return string
	 */
	public function get_test_label() {
		return 'Default tagline';
	}
	
	/**
	 * get_result
	 *
	 * @return string[]
	 */
	protected function get_result() {
		if ($this->runner->is_successful()) {
			return $this->presenter->get_success_result();
		}

		return $this->presenter->get_has_default_tagline_result();
	}

}
<?php

namespace Yoast\WP\SEO\Services\Health_Check\Default_Tagline;

use Yoast\WP\SEO\Services\Health_ChecK\Health_Check;

class Health_Check_Default_Tagline extends Health_Check {

	private $runner;
	private $presenter;

	public function __construct() {
		$this->runner = new Health_Check_Default_Tagline_Runner();
		$this->presenter = new Health_Check_Default_Tagline_Presenter($this->get_test_name());

		parent::__construct($this->runner);
	}

	public function get_test_name() {
		return 'default-tagline';
	}

	protected function get_result() {
		if ($this->runner->is_successful()) {
			return $this->presenter->get_success_result();
		}

		return $this->presenter->get_has_default_tagline_result();
	}

}
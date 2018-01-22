<?php

namespace Yoast\Tests\Doubles;

use Yoast\YoastSEO\Config\Plugin;

class Plugin_Double extends Plugin {
	public function get_integrations() {
		return $this->integrations;
	}

	public function get_database_migration() {
		return $this->database_migration;
	}

	public function get_dependency_management() {
		return $this->dependency_management;
	}
}

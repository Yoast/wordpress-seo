<?php

namespace Yoast\WP\Free\Conditionals;

class Admin_Conditional implements Conditional {
	public function is_met() {
		return \is_admin();
	}
}

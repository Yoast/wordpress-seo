<?php

namespace Yoast\WP\Free\Conditionals;

class Indexables_Feature_Flag_Conditional extends Feature_Flag_Conditional {
	protected function get_feature_flag() {
		return 'indexables';
	}
}

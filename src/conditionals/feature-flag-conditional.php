<?php

namespace Yoast\WP\Free\Conditionals;

abstract class Feature_Flag_Conditional implements Conditional {
	public function is_met() {
		$feature_flag = strtoupper( $this->get_feature_flag() );

		return constant( 'YOAST_SEO_' . $feature_flag ) === true;
	}

	protected abstract function get_feature_flag();
}

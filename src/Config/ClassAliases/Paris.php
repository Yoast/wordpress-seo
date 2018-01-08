<?php

namespace Yoast\YoastSEO\Config\ClassAliases;

class Paris implements ClassAlias {
	public function get_classes() {
		return array(
			'Model',
			'ORMWrapper',
			'ParisMethodMissingException',
		);
	}
}

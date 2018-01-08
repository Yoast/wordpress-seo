<?php

namespace Yoast\YoastSEO\Config\ClassAliases;

class Idiorm implements ClassAlias {
	public function get_classes() {
		return array(
			'IdiormMethodMissingException',
			'IdiormResultSet',
			'IdiormString',
			'IdiormStringException',
			'ORM',
		);
	}
}

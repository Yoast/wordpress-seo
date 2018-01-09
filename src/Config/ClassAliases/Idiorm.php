<?php

namespace Yoast\YoastSEO\Config\ClassAliases;

class Idiorm implements ClassAlias {
	/**
	 * Returns a list of classes that need to be prefixed.
	 *
	 * @return array List of classes to prefix.
	 */
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

<?php

namespace Yoast\YoastSEO\Config\ClassAliases;

class ORM implements ClassAlias {
	/**
	 * Returns a list of classes that need to be prefixed.
	 *
	 * @return array List of classes to prefix.
	 */
	public function get_classes() {
		$idiorm = new Idiorm();
		$paris = new Paris();

		return array_merge( $idiorm->get_classes(), $paris->get_classes() );
	}
}

<?php

namespace Yoast\YoastSEO\Config\ClassAliases;

class ORM implements ClassAlias {

	public function get_classes() {
		$idiorm = new Idiorm();
		$paris = new Paris();

		return array_merge( $idiorm->get_classes(), $paris->get_classes() );
	}
}

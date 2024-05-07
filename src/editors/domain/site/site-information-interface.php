<?php

// phpcs:disable Yoast.NamingConventions.NamespaceName.TooLong -- Needed in the folder structure.
namespace Yoast\WP\SEO\Editors\Domain\Site;

interface Site_Information_Interface {

	/**
	 * Returns specific site information together with the generic site information.
	 *
	 * @return array<string|string,string[]>
	 */
	public function get_site_information(): array;

	/**
	 * Returns specific site information together with the generic site information compatible with a legacy way.
	 *
	 * @return array<string|string,string[]>
	 */
	public function get_legacy_site_information(): array;
}

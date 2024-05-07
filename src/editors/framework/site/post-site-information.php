<?php
// phpcs:disable Yoast.NamingConventions.NamespaceName.TooLong
namespace Yoast\WP\SEO\Editors\Framework\Site;

/**
 * The Post_Site_Information class.
 */
class Post_Site_Information extends Base_Site_Information {

	/**
	 * The permalink.
	 *
	 * @var string $permalink
	 */
	private $permalink;

	/**
	 * Sets the permalink.
	 *
	 * @param string $permalink The permalink.
	 *
	 * @return void
	 */
	public function set_permalink( string $permalink ): void {
		$this->permalink = $permalink;
	}

	/**
	 * Returns post specific site information together with the generic site information.
	 *
	 * @return array<string|string,string[]>
	 */
	public function get_legacy_site_information(): array {
		$data = [
			'metabox' => [
				'search_url'    => $this->search_url(),
				'post_edit_url' => $this->edit_url(),
				'base_url'      => $this->base_url_for_js(),
			],
		];

		return \array_merge_recursive( $data, parent::get_legacy_site_information() );
	}

	/**
	 * Returns post specific site information together with the generic site information.
	 *
	 * @return array<string|string,string[]>
	 */
	public function get_site_information(): array {
		$data = [
			'search_url'    => $this->search_url(),
			'post_edit_url' => $this->edit_url(),
			'base_url'      => $this->base_url_for_js(),
		];

		return \array_merge( $data, parent::get_site_information() );
	}

	/**
	 * Returns the url to search for keyword for the post.
	 *
	 * @return string
	 */
	private function search_url(): string {
		return \admin_url( 'edit.php?seo_kw_filter={keyword}' );
	}

	/**
	 * Returns the url to edit the taxonomy.
	 *
	 * @return string
	 */
	private function edit_url(): string {
		return \admin_url( 'post.php?post={id}&action=edit' );
	}

	/**
	 * Returns a base URL for use in the JS, takes permalink structure into account.
	 *
	 * @return string
	 */
	private function base_url_for_js(): string {
		global $pagenow;

		// The default base is the home_url.
		$base_url = \home_url( '/', null );

		if ( $pagenow === 'post-new.php' ) {
			return $base_url;
		}

		// If %postname% is the last tag, just strip it and use that as a base.
		if ( \preg_match( '#%postname%/?$#', $this->permalink ) === 1 ) {
			$base_url = \preg_replace( '#%postname%/?$#', '', $this->permalink );
		}

		// If %pagename% is the last tag, just strip it and use that as a base.
		if ( \preg_match( '#%pagename%/?$#', $this->permalink ) === 1 ) {
			$base_url = \preg_replace( '#%pagename%/?$#', '', $this->permalink );
		}

		return $base_url;
	}
}

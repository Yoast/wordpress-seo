<?php

namespace Yoast\WP\SEO\Routes;

use WP_Error;
use WP_REST_Response;
use Yoast\WP\SEO\Conditionals\No_Conditionals;
use Yoast\WP\SEO\Main;

/**
 * Importing_Route class.
 *
 * Importing route for importing from other SEO plugins.
 */
class Importing_Route extends Abstract_Action_Route {

	use No_Conditionals;

	/**
	 * The import route constant.
	 *
	 * @var string
	 */
	const ROUTE = '/import/(?P<plugin>\w+)/(?P<type>\w+)';

	/**
	 * The aioseo posts import route constant.
	 *
	 * @var string
	 */
	const IMPORT_AIOSEO_POSTS_ROUTE = '/import/aioseo/posts';

	/**
	 * The aioseo terms import route constant.
	 *
	 * @var string
	 */
	const IMPORT_AIOSEO_TERMS_ROUTE = '/import/aioseo/terms';

	/**
	 * Registers routes with WordPress.
	 *
	 * @return void
	 */
	public function register_routes() {
		register_rest_route(
			Main::API_V1_NAMESPACE,
			self::ROUTE,
			[
				'callback'            => [ $this, 'execute' ],
				'permission_callback' => [ $this, 'can_import' ],
				'methods'             => [ 'GET' ],
			]
		);
	}

	/**
	 * Executes the rest request.
	 *
	 * @param mixed $data The request parameters.
	 *
	 * @return WP_REST_Response
	 */
	public function execute( $data ) {
		$plugin = (string) $data['plugin'];
		$type   = (string) $data['type'];

		$method = "import_{$plugin}_{$type}";

		try {
			$result   = $this->{ $method }();
			$next_url = "import/{$plugin}/{$type}";

			if ( count( $result['objects'] ) === 0 ) {
				$next_url = $result['next_url'];
			}

			return $this->respond_with(
				$result['objects'],
				$next_url
			);
		} catch ( \Exception $exception ) {
			return new WP_Error(
				'wpseo_error_indexing',
				$exception->getMessage(),
				[ 'stackTrace' => $exception->getTraceAsString() ]
			);
		}
	}

	/**
	 * Runs the aioseo post importer.
	 *
	 * @return array
	 */
	protected function import_aioseo_posts() {
		return [
			'objects'  => [],
			'next_url' => self::IMPORT_AIOSEO_TERMS_ROUTE,
		];
	}

	/**
	 * Whether or not the current user is allowed to import.
	 *
	 * @return bool Whether or not the current user is allowed to import.
	 */
	public function can_import() {
		return \current_user_can( 'edit_posts' );
	}
}

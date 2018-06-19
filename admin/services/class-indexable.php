<?php
/**
 * WPSEO plugin file.
 *
 * @package WPSEO\Admin\Services
 */

/**
 * Represents the indexable service.
 */
class WPSEO_Indexable_Service {

	/**
	 * Retrieves an indexable.
	 *
	 * @param WP_REST_Request $request The request object.
	 *
	 * @return WP_REST_Response The response.
	 */
	public function get_indexable( WP_REST_Request $request ) {
		$object_type = $request->get_param( 'object_type' );
		$provider    = $this->get_provider( strtolower( $object_type ) );

		if ( $provider === null ) {
			return $this->handle_unknown_object_type( $object_type );
		}

		$object_id = $request->get_param( 'object_id' );

		if ( ! $provider->is_indexable( $object_id ) ) {
			return new WP_REST_Response(
				sprintf(
					/* translators: %1$s expands to the requested indexable type. %2$s expands to the request id */
					__( 'Object %1$s with id %2$s not found', 'wordpress-seo' ),
					$object_type,
					$object_id
				),
				404
			);
		}

		return new WP_REST_Response( $provider->get( $object_id ) );
	}

	/**
	 * Save an indexable.
	 *
	 * @param WP_REST_Request $request The request object.
	 *
	 * @return WP_REST_Response The response.
	 * @throws Exception
	 */
	public function save_indexable( WP_REST_Request $request ) {
		$object_type = $request->get_param( 'object_type' );
		$provider    = $this->get_provider( strtolower( $object_type ) );

		if ( $provider === null ) {
			return $this->handle_unknown_object_type( $object_type );
		}

		try {
			$indexable = new Indexable(
				$request->get_param( 'object_id' ),
				new Object_Type(
					$object_type,
					$request->get_param( 'object_subtype' )
				),
				new Meta_Values(
					$request->get_param( 'title' ),
					$request->get_param( 'description' ),
					$request->get_param( 'permalink' ),
					$request->get_param( 'readability_score' ),
					$request->get_param( 'is_cornerstone' ),
					$request->get_param( 'canonical' ),
					$request->get_param( 'breadcrumb_title' )
				),
				new OpenGraph(
					$request->get_param( 'og_title' ),
					$request->get_param( 'og_description' ),
					$request->get_param( 'og_image' )
				),
				new Twitter(
					$request->get_param( 'twitter_title' ),
					$request->get_param( 'twitter_description' ),
					$request->get_param( 'twitter_image' )
				),
				new Robots(
					$request->get_param( 'is_robots_nofollow' ),
					$request->get_param( 'is_robots_noarchive' ),
					$request->get_param( 'is_robots_noimageindex' ),
					$request->get_param( 'is_robots_nosnippet' ),
					$request->get_param( 'is_robots_noindex' )
				),
				new WPSEO_Keyword(
					$request->get_param( 'primary_focus_keyword' ),
					$request->get_param( 'primary_focus_keyword_score' )
				),
				new Link( 0, 0 )
			);
		} catch (\InvalidArgumentException $exception ) {
			return new WP_REST_Response( $exception->getMessage(), 500 );
		}

		return new WP_REST_Response( $provider->post( $indexable ) );
	}

	/**
	 * Returns a provider based on the given object type.
	 *
	 * @param string $object_type The object type to get the provider for.
	 *
	 * @return null|WPSEO_Indexable_Service_Provider Instance of the service provider.
	 */
	protected function get_provider( $object_type ) {
		if ( $object_type === 'post' ) {
			return new WPSEO_Indexable_Service_Post_Provider();
		}

		if ( $object_type === 'term' ) {
			return new WPSEO_Indexable_Service_Term_Provider();

		}

		return null;
	}

	/**
	 * Handles the situation when the object type is unknown.
	 *
	 * @param string $object_type The unknown object type.
	 *
	 * @return WP_REST_Response The response.
	 */
	protected function handle_unknown_object_type( $object_type ) {
		return new WP_REST_Response(
			sprintf(
			/* translators: %1$s expands to the requested indexable type  */
				__( 'Unknown type %1$s', 'wordpress-seo' ),
				$object_type
			),
			400
		);
	}
}

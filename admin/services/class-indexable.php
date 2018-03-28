<?php


class WPSEO_Indexable_Service {

	/**
	 *
	 */
	public function get_indexable( WP_REST_Request $request ) {

		$type = $request->get_param( 'object_type' );
		$provider = $this->get_provider( $type );

		if ( $provider === null ) {
			return new WP_REST_Response( 'Unknown type '. $type, 404 );
		}

		$object_id = $request->get_param( 'object_id' );
		if( ! $provider->is_indexable( $object_id ) ) {
			return new WP_REST_Response( 'Object with id ' . $object_id . ' not found', 404 );

		}

		return new WP_REST_Response( $provider->get( $object_id ) );
	}

	/**
	 * @param $type
	 *
	 * @return null|WPSEO_Indexable_Service_Provider
	 */
	protected function get_provider( $type ) {
		if ( $type === 'post' ) {
			return new WPSEO_Indexable_Service_Post_Provider();
		}

		if ( $type === 'term' ) {
			return new WPSEO_Indexable_Service_Term_Provider();

		}

		return null;
	}


}
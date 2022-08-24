import { get } from "lodash";

const media = {
	_client: null,
	/**
	 * Gets or creates the media client.
	 * @returns {Object} Media client.
	 */
	get client() {
		if ( this._client ) {
			return this._client;
		}
		const Collection = get( window, "wp.api.collections.Media", null );
		if ( Collection ) {
			this._client = new Collection();
		}
		return this._client;
	},
};

export const mediaClient = media.client;


import 'whatwg-fetch';

let postJSONRequest = null;

if( typeof jQuery === typeof undefined  ) {
	postJSONRequest = ( endpoint, postdata, onsuccess, onfail ) => {
		fetch(
			endpoint,
			{
				method: 'POST',
				headers: {
					'Accept': 'application/json',
					'Content-Type': 'application/json'
				},
				body: postdata
			}
		)
		.then( onsuccess )
		.catch( onfail )
	};
}
else {
	postJSONRequest = ( url, data, success, error ) => {
		let contentType = "application/json";
		let method = "POST";

		jQuery.ajax( { url, data, success, error, contentType, method } );
	}

}

export default postJSONRequest;

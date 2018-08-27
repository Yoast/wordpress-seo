const URL = window.URL || window.webkitURL;
const BlobBuilder = window.BlobBuilder || window.WebKitBlobBuilder || window.MozBlobBuilder;

/**
 * Creates a WebWorker using the given url.
 *
 * @param {string} url The url of the worker.
 *
 * @returns {Worker} The worker.
 */
function createWorker( url ) {
	let worker = null;
	try {
		worker = new Worker( url );
	} catch ( e ) {
		try {
			let blob;
			try {
				blob = new Blob( [ "importScripts('" + url + "');" ], { type: "application/javascript" } );
			} catch ( e1 ) {
				const blobBuilder = new BlobBuilder();
				blobBuilder.append( "importScripts('" + url + "');" );
				blob = blobBuilder.getBlob( "application/javascript" );
			}
			const blobUrl = URL.createObjectURL( blob );
			worker = new Worker( blobUrl );
		} catch ( e2 ) {
			throw e2;
		}
	}
	return worker;
}

export default createWorker;

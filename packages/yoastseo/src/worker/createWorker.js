/**
 * Creates an URL to a blob. This blob imports a script for use in a web worker (using `importScripts`).
 *
 * @param {string} url The URL to the script that has to be loaded.
 * @returns {string} the URL to the blob.
 */
function createBlobURL( url ) {
	const URL = window.URL || window.webkitURL;
	const BlobBuilder = window.BlobBuilder || window.WebKitBlobBuilder || window.MozBlobBuilder;

	let blob;
	try {
		blob = new Blob( [ "importScripts('" + url + "');" ], { type: "application/javascript" } );
	} catch ( e1 ) {
		const blobBuilder = new BlobBuilder();
		blobBuilder.append( "importScripts('" + url + "');" );
		blob = blobBuilder.getBlob( "application/javascript" );
	}
	return URL.createObjectURL( blob );
}

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
			const blobUrl = createBlobURL( url );
			worker = new Worker( blobUrl );
		} catch ( e2 ) {
			throw e2;
		}
	}
	return worker;
}

export default createWorker;

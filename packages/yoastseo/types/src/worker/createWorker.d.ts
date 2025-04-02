export default createWorker;
/**
 * Creates a try catch for a web worker around a script.
 *
 * @param 		{string} originalScript 	The script to put a try-catch around.
 * @returns 	{string} 					The new script including a try-catch.
 */
export function createExceptionHandler(originalScript: string): string;
/**
 * Determines whether or not two URLs have the same origin.
 *
 * @param 		{string} urlA 				First URL to test.
 * @param 		{string} urlB 				Second URL to test.
 *
 * @returns {boolean} Whether the URLs have the same origin.
 */
export function isSameOrigin(urlA: string, urlB: string): boolean;
/**
 * Creates a URL to a blob. This blob imports a script for use in a web worker (using `importScripts`).
 *
 * @param 		{string} url 				The URL to the script that has to be loaded.
 * @returns 	{string} 					The URL to the blob.
 */
export function createBlobURL(url: string): string;
/**
 * Creates a WebWorker using the given url.
 *
 * @param 		{string} url 				The url of the worker.
 * @returns 	{Worker} 					The worker.
 */
export function createWorker(url: string): Worker;
/**
 * Creates the script to run inside the fallback web worker.
 *
 * @param 		{string} url 				The URL for which to create a script.
 * @returns 	{string} 					A script that can be run inside a worker as a blob.
 */
export function createBlobScript(url: string): string;
/**
 * Creates a worker fallback using the blob URL method.
 *
 * @param 		{string} url 				The URL to create a worker for.
 * @returns 	{Worker} 					The web worker.
 */
export function createWorkerFallback(url: string): Worker;

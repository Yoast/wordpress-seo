/**
 * Delays the snapshot to make sure all promises are resolved before the snapshot is made.
 *
 * @param {ReactElement} component The component to create the snapshot for.
 *
 * @returns {Promise} The delayComponentSnapshot promise.
 */
export default function delayComponentSnapshot( component ) {
	return new Promise( ( resolve ) => {
		/**
		 * Creates the snapshot of the component.
		 *
		 * @returns {void}
		 */
		const createSnapshot = () => {
			const tree = component.toJSON();
			expect( tree ).toMatchSnapshot();
			resolve();
		};
		setTimeout( createSnapshot, 0 );
	} );
}

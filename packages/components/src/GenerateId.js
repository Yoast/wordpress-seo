/**
 * Generates a random string that can be used as an ID.
 *
 * Note: this is NOT cryptographically secure!
 *
 * @returns {string} A unique ID.
 */
const generateId = () => {
	return Math.random().toString( 36 ).substring( 2, 6 );
};

/**
 * Returns the id if it is set or generates a new random ID.
 *
 * The idea is that you can pass the props.id to this function. If the id was manually set, it returns that ID.
 * Otherwise, it returns a random ID.
 *
 * @param {string} id The provided ID.
 *
 * @returns {string} The ID or a randomly generated ID.
 */
export const getId = id => {
	return id || generateId();
};

export default generateId;

/**
 * Computes the Gini coefficient of the given array of scores.
 *
 * @param {number[]} scores The array of scores to compute the Gini coefficent from.
 *
 * @returns {number} The Gini coefficient.
 */
export default function gini( scores ) {
	scores = scores.sort();
	let subsum = 0;
	const sumAbsoluteDifferences = scores.reduce( ( accumulator, score, index ) => {
		accumulator += index * score - subsum;
		subsum += score;
		return accumulator;
	}, 0 );

	return subsum === 0 || scores.length === 0 ? -1 : sumAbsoluteDifferences / subsum / scores.length;
}

import Paper from "../../src/values/Paper";

/**
 *
 *
 * @param researcher
 * @returns {function()}
 */
export default function( researcher ) {
	return ( { text, locale } ) => {
		let paper = new Paper(
			text,
			{
				locale,
			}
		);

		researcher.setPaper( paper );

		return paper;
	};
};

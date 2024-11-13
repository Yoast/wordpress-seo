import { useEffect, useState } from "@wordpress/element";
import { ContentStatusDescription } from "./content-status-description";
import { ScoreList } from "./score-list";

/**
 * @type {import("../index").ContentType} ContentType
 * @type {import("../index").Term} Term
 * @type {import("../index").Scores} Scores
 */

/** @type {Scores} **/
const fakeScores = {
	ok: {
		name: "ok",
		amount: 6,
		links: {
			view: "https://basic.wordpress.test/wp-admin/edit.php?category=22",
		},
	},
	good: {
		name: "good",
		amount: 6,
		links: {
			view: null,
		},
	},
	bad: {
		name: "bad",
		amount: 6,
		links: {
			view: null,
		},
	},
	notAnalyzed: {
		name: "notAnalyzed",
		amount: 6,
		links: {
			view: null,
		},
	},
};
const fakeScores2 = {
	ok: {
		name: "ok",
		amount: 7,
		links: {
			view: "https://basic.wordpress.test/wp-admin/edit.php?category=22",
		},
	},
	good: {
		name: "good",
		amount: 12,
		links: {
			view: null,
		},
	},
	bad: {
		name: "bad",
		amount: 0,
		links: {
			view: null,
		},
	},
	notAnalyzed: {
		name: "notAnalyzed",
		amount: 0,
		links: {
			view: null,
		},
	},
};

/**
 * @param {ContentType} contentType The selected contentType.
 * @param {Term?} [term] The selected term.
 * @returns {JSX.Element} The element.
 */
export const Scores = ( { contentType, term } ) => {
	const [ scores, setScores ] = useState();
	useEffect( () => {
		const rand = Math.random();
		if ( rand < 0.5 ) {
			setScores( fakeScores );
		} else {
			setScores( fakeScores2 );
		}
	}, [ contentType.name, term?.name ] );

	return <>
		<ContentStatusDescription scores={ scores } />
		<div className="yst-grid yst-grid-cols-1 @md:yst-grid-cols-3 yst-gap-6">
			{ scores && <ScoreList scores={ scores } /> }
			<div>chart</div>
		</div>
	</>;
};

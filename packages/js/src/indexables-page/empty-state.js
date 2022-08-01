
import PropTypes from "prop-types";

import { Alert } from "@yoast/ui-library";
import { Transition } from "@headlessui/react";
import IconSearch from "../../images/icon-search.svg";
import Indexation from "../components/indexation";
import { __ } from "@wordpress/i18n";

/* eslint-disable camelcase */
/* eslint-disable no-warning-comments */
/* eslint-disable complexity */
/**
 * Renders the four indexable tables.
 *
 * @returns {WPElement} A div containing the empty state page.
 */
function EmptyState( { setIndexingState } ) {
	const preIndexingActions = {};
	const indexingActions = {};

	return <div
		className="yst-max-w-full yst-mt-6 yst-flex"
	>
		<div
			id="empty-state"
			className="yst-grid yst-w-[1088px] yst-grid-cols-1 yst-justify-items-center yst-bg-white yst-rounded-lg yst-px-8 yst-py-10 yst-shadow"
		>
			<img src={ IconSearch } alt="Magnifying lens icon" className="yst-mb-4" />
			<h4 className="yst-mb-2 yst-text-base yst-text-gray-900 yst-font-medium yst-leading-tight">No data to show yet</h4>
			<span className="yst-gray-500 yst-font-normal yst-leading-normal">
				We would like to show you insights into content that we feel could use improving.
			</span>
			<span className="yst-gray-500 yst-font-normal yst-leading-normal yst-mb-6">
				Help us to analyze your site by running the SEO data optimization below.
			</span>
			<div className="yst-grid yst-grid-cols-1 yst-justify-items-center yst-w-1/3">
				<Indexation
					preIndexingActions={ preIndexingActions }
					indexingActions={ indexingActions }
					indexingStateCallback={ setIndexingState }
				/>
			</div>
		</div>
	</div>;
}

EmptyState.propTypes =  {
	setIndexingState: PropTypes.func.isRequired,
};

export default EmptyState;

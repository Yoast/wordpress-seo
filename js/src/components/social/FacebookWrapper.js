import React, { Fragment } from "react";
import { Slot } from "@wordpress/components";

import FacebookView from "../social/FacebookView";

const isPremium = !! window.wpseoPostScraperL10n.isPremium;
/**
 * A
 * @param {*} props A
 *
 * @returns {Component} Renders a React Component.
 */
const FacebookWrapper = ( props ) => {
	return (
		<Fragment>
			{
				isPremium && <FacebookView { ...props } />
			}
			<Slot name="YoastFacebookPremium">
				{
					( fills ) => {
						return fills.map( ( Fill, i ) => <Fill key={ i } { ...props } /> );
					}
				}
			</Slot>
		</Fragment>
	);
};

export default FacebookWrapper;

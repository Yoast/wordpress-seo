import { expect, userEvent } from "@storybook/test";
import { ComparisonMetricsDataFormatter, OrganicSessionsWidget } from "../../src";
import { createRemoteDataProvider } from "./organic-sessions-widget/create-remote-data-provider";
import description from "./organic-sessions-widget/description.md";
import { getCompareData } from "./organic-sessions-widget/get-compare-data";
import { getDailyData } from "./organic-sessions-widget/get-daily-data";
import { getRandom } from "./organic-sessions-widget/get-random";
import noDifference from "./organic-sessions-widget/no-difference.md";

export default {
	title: "Widgets/Organic Sessions widget",
	component: OrganicSessionsWidget,
	parameters: { docs: { description: { component: description } } },
	args: {
		dataProvider: {
			getLink: () => "https://example.com/error-support",
			getEndpoint: () => "https://example.com/time-based-seo-metrics",
		},
		remoteDataProvider: createRemoteDataProvider( getCompareData( 10, 9 ), getDailyData() ),
		dataFormatter: new ComparisonMetricsDataFormatter(),
	},
};

export const Factory = {
	tags: [ "!autodocs" ],
};

export const WithoutData = {
	args: {
		remoteDataProvider: createRemoteDataProvider( [], [] ),
	},
};

export const WithError = {
	args: {
		remoteDataProvider: createRemoteDataProvider( "Error", "Error" ),
	},
};

export const Loading = {
	args: {
		remoteDataProvider: {
			fetchJson: () => new Promise( () => {
				// Never resolve.
			} ),
		},
	},
};

export const WithoutCompareData = {
	args: {
		remoteDataProvider: createRemoteDataProvider( [], getDailyData() ),
	},
};

export const WithoutDailyData = {
	args: {
		remoteDataProvider: createRemoteDataProvider( getCompareData(), [] ),
	},
};

export const WithCompareError = {
	args: {
		remoteDataProvider: createRemoteDataProvider( "Error", getDailyData() ),
	},
};

export const WithDailyError = {
	args: {
		remoteDataProvider: createRemoteDataProvider( getCompareData(), "Error" ),
	},
};

export const NoDifference = {
	parameters: { docs: { description: { story: noDifference } } },
	args: {
		remoteDataProvider: createRemoteDataProvider( getCompareData( getRandom( 1 ), 0 ), getDailyData() ),
	},
};

export const Tooltip = {
	tags: [ "!autodocs" ],
	play: async( { canvas } ) => {
		// Should have a button that opens a tooltip.
		const tooltip = canvas.getByRole( "button" );
		await expect( tooltip ).toBeInTheDocument();
		await expect( tooltip.classList ).toContain( "yst-tooltip-trigger" );

		// Check that the tooltip is not visible by default (but still in the DOM).
		const paragraph = canvas.getByText( "The number of organic sessions that began on your website." );
		await expect( paragraph ).toBeInTheDocument();
		await expect( paragraph.parentElement ).toHaveClass( "yst-hidden" );

		// Check that the tooltip is visible when hovered.
		await userEvent.hover( tooltip );
		// Give time for the tooltip to show, it is debounced for 100ms.
		await new Promise( ( resolve ) => setTimeout( () => resolve(), 100 ) );
		await expect( paragraph.parentElement ).not.toHaveClass( "yst-hidden" );

		// Check that the tooltip remains visible when focused, yet something else is hovered.
		await userEvent.click( tooltip );
		await userEvent.hover( canvas.getByRole( "heading", { name: "Organic sessions" } ) );
		await new Promise( ( resolve ) => setTimeout( () => resolve(), 100 ) );
		await expect( paragraph.parentElement ).not.toHaveClass( "yst-hidden" );
	},
};

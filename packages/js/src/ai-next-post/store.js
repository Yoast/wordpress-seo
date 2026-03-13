import { createReduxStore } from "@wordpress/data";

export const STORE_NAME = "yoast-seo/next-post";

const DEFAULT_STATE = {
	isBannerDismissed: false,
	isModalOpen: false,
};

export const store = createReduxStore( STORE_NAME, {
	reducer( state = DEFAULT_STATE, action ) {
		switch ( action.type ) {
			case "DISMISS_BANNER":
				return { ...state, isBannerDismissed: true };
			case "OPEN_MODAL":
				return { ...state, isModalOpen: true };
			case "CLOSE_MODAL":
				return { ...state, isModalOpen: false };
		}
		return state;
	},
	actions: {
		dismissBanner: () => ( { type: "DISMISS_BANNER" } ),
		openModal: () => ( { type: "OPEN_MODAL" } ),
		closeModal: () => ( { type: "CLOSE_MODAL" } ),
	},
	selectors: {
		getIsBannerDismissed: ( state ) => state.isBannerDismissed,
		getIsModalOpen: ( state ) => state.isModalOpen,
	},
} );



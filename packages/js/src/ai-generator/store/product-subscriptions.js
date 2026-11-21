import { createSlice } from "@reduxjs/toolkit";
import { get } from "lodash";

export const PRODUCT_SUBSCRIPTIONS_NAME = "productSubscriptions";

const slice = createSlice( {
	name: PRODUCT_SUBSCRIPTIONS_NAME,
	initialState: {
		premiumSubscription: false,
		wooCommerceSubscription: false,
	},
	reducers: {},
} );

export const getInitialProductSubscriptionsState = slice.getInitialState;

export const productSubscriptionsSelectors = {
	selectProductSubscriptions: state => get( state, PRODUCT_SUBSCRIPTIONS_NAME, getInitialProductSubscriptionsState() ),
	selectPremiumSubscription: state => get( state, `${ PRODUCT_SUBSCRIPTIONS_NAME }.premiumSubscription` ),
	selectWooCommerceSubscription: state => get( state, `${ PRODUCT_SUBSCRIPTIONS_NAME }.wooCommerceSubscription` ),
};

export const productSubscriptionsActions = slice.actions;

export const productSubscriptionsReducer = slice.reducer;

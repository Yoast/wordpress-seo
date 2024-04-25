import { get } from "lodash";
import { setPrimaryTaxonomyId } from "../../redux/actions";

export const primaryTermSelectors = {
	getPrimaryProductCategory: ( state ) => get( state, "primaryTaxonomies.product_cat", -1 ),
};

export const primaryTermActions = {
	setPrimaryProductCategory: ( id ) => setPrimaryTaxonomyId( "product_cat", id ),
};

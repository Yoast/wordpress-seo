/* eslint-disable max-statements */

/**
 * Creates category elements.
 *
 * @returns {{category1: HTMLInputElement, category2: HTMLInputElement, category3: HTMLInputElement,
 * allCategories: HTMLDivElement, mostUsedCategories: HTMLDivElement}} The elements created for categories.
 */
const createCategoryElements = () => {
	// Create regular category elements.
	const cat1 = document.createElement( "input" );
	cat1.setAttribute( "type", "checkbox" );
	cat1.setAttribute( "value", "cat1" );
	const cat2 = document.createElement( "input" );
	cat2.setAttribute( "type", "checkbox" );
	cat2.setAttribute( "value", "cat2" );
	const cat3 = document.createElement( "input" );
	cat3.setAttribute( "type", "checkbox" );
	cat3.setAttribute( "value", "cat3" );

	const allCats = document.createElement( "div" );
	allCats.setAttribute( "id", "categorychecklist" );
	allCats.appendChild( cat1 );
	allCats.appendChild( cat2 );
	allCats.appendChild( cat3 );

	const mostUsedCats = document.createElement( "div" );
	mostUsedCats.setAttribute( "id", "categorychecklist-pop" );
	mostUsedCats.appendChild( cat1.cloneNode() );
	mostUsedCats.appendChild( cat2.cloneNode() );

	return {
		category1: cat1,
		category2: cat2,
		category3: cat3,
		allCategories: allCats,
		mostUsedCategories: mostUsedCats,
	};
};

/**
 * Creates tag elements.
 *
 * @returns {{parentTagElement: HTMLDivElement}} The element created for tags.
 */
const createTagElements = () => {
	// Create regular tag elements.
	const tag1 = document.createElement( "li" );
	const tag1ChildNode1 = document.createElement( "button" );
	const tag1ChildNode2 = document.createTextNode( "" );
	const tag1ChildNode3 = document.createTextNode( "cat food" );

	tag1.appendChild( tag1ChildNode1 );
	tag1.appendChild( tag1ChildNode2 );
	tag1.appendChild( tag1ChildNode3 );

	const tag2 = document.createElement( "li" );
	const tag2ChildNode1 = document.createElement( "button" );
	const tag2ChildNode2 = document.createTextNode( "" );
	const tag2ChildNode3 = document.createTextNode( "cat snack" );

	tag2.appendChild( tag2ChildNode1 );
	tag2.appendChild( tag2ChildNode2 );
	tag2.appendChild( tag2ChildNode3 );

	const tagsListElement = document.createElement( "ul" );
	tagsListElement.setAttribute( "class", "tagchecklist" );
	tagsListElement.appendChild( tag1 );
	tagsListElement.appendChild( tag2 );

	const parentTagElement = document.createElement( "div" );
	parentTagElement.setAttribute( "id", "post_tag" );
	parentTagElement.appendChild( tagsListElement );

	return {
		parentTagElement: parentTagElement,
	};
};

/**
 * Creates custom taxonomy elements, both hierarchical and non-hierarchical.
 *
 * @returns {{actor1: HTMLInputElement, actor2: HTMLInputElement, actor3: HTMLInputElement,
 * mostUsedActors: HTMLDivElement, nonHierarchicalParentElement: HTMLDivElement, allActors: HTMLDivElement}} The created custom taxonomy elements.
 */
const createCustomTaxonomyElements = () => {
	// Set to the document the hierarchical custom taxonomy elements.
	const actor1 = document.createElement( "input" );
	actor1.setAttribute( "type", "checkbox" );
	actor1.setAttribute( "value", "actor1" );

	const actor2 = document.createElement( "input" );
	actor2.setAttribute( "type", "checkbox" );
	actor2.setAttribute( "value", "actor2" );
	const actor3 = document.createElement( "input" );
	actor3.setAttribute( "type", "checkbox" );
	actor3.setAttribute( "value", "actor3" );

	const allActors = document.createElement( "div" );
	allActors.setAttribute( "id", "actorschecklist" );
	allActors.appendChild( actor1 );
	allActors.appendChild( actor2 );
	allActors.appendChild( actor3 );

	const mostUsedActors = document.createElement( "div" );
	mostUsedActors.setAttribute( "id", "actorschecklist-pop" );
	mostUsedActors.appendChild( actor1.cloneNode() );
	mostUsedActors.appendChild( actor2.cloneNode() );

	// Set to the document the non-hierarchical custom taxonomy elements.
	const director1 = document.createElement( "li" );
	const director1ChildNode1 = document.createElement( "button" );
	const director1ChildNode2 = document.createTextNode( "" );
	const director1ChildNode3 = document.createTextNode( "Steven Spielberg" );

	director1.appendChild( director1ChildNode1 );
	director1.appendChild( director1ChildNode2 );
	director1.appendChild( director1ChildNode3 );

	const director2 = document.createElement( "li" );
	const director2ChildNode1 = document.createElement( "button" );
	const director2ChildNode2 = document.createTextNode( "" );
	const director2ChildNode3 = document.createTextNode( "Spike Lee" );

	director2.appendChild( director2ChildNode1 );
	director2.appendChild( director2ChildNode2 );
	director2.appendChild( director2ChildNode3 );

	const nonHierarchicalCTElement = document.createElement( "ul" );
	nonHierarchicalCTElement.setAttribute( "class", "tagchecklist" );

	// Add new elements for the non-hierarchical custom taxonomies.
	nonHierarchicalCTElement.appendChild( director1 );
	nonHierarchicalCTElement.appendChild( director2 );

	// Set the parent element for the non-hierarchical custom taxonomies.
	const nonHierarchicalParentElement = document.createElement( "div" );
	nonHierarchicalParentElement.setAttribute( "id", "directors" );
	nonHierarchicalParentElement.appendChild( nonHierarchicalCTElement );

	return {
		actor1: actor1,
		actor2: actor2,
		actor3: actor3,
		allActors: allActors,
		mostUsedActors: mostUsedActors,
		nonHierarchicalParentElement: nonHierarchicalParentElement,
	};
};

/**
 * Creates the elements for post and term slug.
 *
 * @returns {{fullLengthSlugElement: HTMLSpanElement, postNameElement: HTMLInputElement,
 * slugEditDiv: HTMLDivElement, shortSlugElement: HTMLSpanElement}} The created slug elements
 */
const createSlugElements = () => {
	// Creates post slug elements.
	const fullLengthSlugElement = document.createElement( "span" );
	fullLengthSlugElement.setAttribute( "id", "editable-post-name-full" );

	const fullLengthSlugText = document.createTextNode( "best-cat-food" );
	fullLengthSlugElement.appendChild( fullLengthSlugText );

	const shortSlugElement = document.createElement( "span" );
	shortSlugElement.setAttribute( "id", "editable-post-name" );

	const shortSlugText = document.createTextNode( "best-cat" );
	shortSlugElement.appendChild( shortSlugText );

	const slugEditDiv = document.createElement( "div" );
	slugEditDiv.appendChild( fullLengthSlugElement );
	slugEditDiv.appendChild( shortSlugElement );

	const postNameElement = document.createElement( "input" );
	postNameElement.setAttribute( "id", "post_name" );
	postNameElement.setAttribute( "value", "cat-toys" );

	// Creates term slug elements.
	const termSlugElement = document.createElement( "input" );
	termSlugElement.setAttribute( "id", "slug" );
	termSlugElement.setAttribute( "value", "cat-adoption" );

	return {
		fullLengthSlugElement: fullLengthSlugElement,
		shortSlugElement: shortSlugElement,
		slugEditDiv: slugEditDiv,
		postNameElement: postNameElement,
		termSlugElement: termSlugElement,
	};
};

export {
	createCategoryElements,
	createTagElements,
	createCustomTaxonomyElements,
	createSlugElements,
};

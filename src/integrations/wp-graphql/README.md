# Yoast SEO WP GraphQL integration

This is an extension to the WPGraphQL plugin (https://github.com/wp-graphql/wp-graphql) that returns Yoast SEO data.

**Currently returning SEO data for:**

-   Pages
-   Posts
-   Custom post types
-   Products (WooCommerce)
-   Categories
-   Custom taxonomies
-   WooCommerce Products
-   Yoast Configuration
    -   Webmaster verification
    -   Social profiles
    -   Schemas
    -   Breadcrumbs

## Usage with Gatsby
Checkout the companion [Gatsby plugin](https://github.com/ashhitch/gatsby-plugin-wpgraphql-seo) to add in Metadata and JSON LD schema with ease.

## Usage

To query for the Yoast Data simply add the seo object to your query:

### Post Type Data

```graphql
query GetPages {
    pages(first: 10) {
        edges {
            node {
                id
                title
                seo {
                    canonical
                    title
                    metaDesc
                    focuskw
                    metaRobotsNoindex
                    metaRobotsNofollow
                    opengraphAuthor
                    opengraphDescription
                    opengraphTitle
                    opengraphDescription
                    opengraphImage {
                        altText
                        sourceUrl
                        srcSet
                    }
                    opengraphUrl
                    opengraphSiteName
                    opengraphPublishedTime
                    opengraphModifiedTime
                    twitterTitle
                    twitterDescription
                    twitterImage {
                        altText
                        sourceUrl
                        srcSet
                    }
                    breadcrumbs {
                        url
                        text
                    }
                    cornerstone
                    schema {
                        pageType
                        articleType
                        raw
                    }
                }
                author {
                    node {
                        seo {
                            metaDesc
                            metaRobotsNofollow
                            metaRobotsNoindex
                            title
                            social {
                                youTube
                                wikipedia
                                twitter
                                soundCloud
                                pinterest
                                mySpace
                                linkedIn
                                instagram
                                facebook
                            }
                        }
                    }
                }
            }
        }
    }
}
```

### Post Taxonomy Data

```graphql
query GetCategories {
    categories(first: 10) {
        edges {
            node {
                id
                seo {
                    canonical
                    title
                    metaDesc
                    focuskw
                    metaRobotsNoindex
                    metaRobotsNofollow
                    opengraphAuthor
                    opengraphDescription
                    opengraphTitle
                    opengraphDescription
                    opengraphImage {
                        altText
                        sourceUrl
                        srcSet
                    }
                    twitterTitle
                    twitterDescription
                    twitterImage {
                        altText
                        sourceUrl
                        srcSet
                    }
                    breadcrumbs {
                        url
                        text
                    }
                }
                name
            }
        }
    }
}
```

### User Data

```graphql
query GetUsers {
    users {
        nodes {
            seo {
                metaDesc
                metaRobotsNofollow
                metaRobotsNoindex
                title
                social {
                    youTube
                    wikipedia
                    twitter
                    soundCloud
                    pinterest
                    mySpace
                    linkedIn
                    instagram
                    facebook
                }
            }
        }
    }
}
```

### Edge and Page Info Data

```graphql
query GetPostsWithIsPrimary {
    posts {
        pageInfo {
            startCursor
            seo {
                schema {
                    raw
                }
            }
        }
        nodes {
            title
            slug
            categories {
                edges {
                    isPrimary
                    node {
                        name
                        count
                    }
                }
            }
        }
    }
}
```

### Yoast Config Data

```graphql
query GetSeoConfig {
    seo {
        webmaster {
            googleVerify
            yandexVerify
            msVerify
            baiduVerify
        }
        schema {
            siteName
            wordpressSiteName
            siteUrl
            inLanguage
            companyName
            companyOrPerson
            companyLogo {
                mediaItemUrl
            }
            logo {
                mediaItemUrl
            }
            personLogo {
                mediaItemUrl
            }
        }
        breadcrumbs {
            showBlogPage
            separator
            searchPrefix
            prefix
            homeText
            enabled
            boldLast
            archivePrefix
            notFoundText
        }
        social {
            facebook {
                url
                defaultImage {
                    mediaItemUrl
                }
            }
            instagram {
                url
            }
            linkedIn {
                url
            }
            mySpace {
                url
            }
            pinterest {
                url
                metaTag
            }
            twitter {
                cardType
                username
            }
            wikipedia {
                url
            }
            youTube {
                url
            }
        }
        openGraph {
            frontPage {
                title
                description
                image {
                    altText
                    sourceUrl
                    mediaItemUrl
                }
            }
            defaultImage {
                altText
                sourceUrl
                mediaItemUrl
            }
        }
        contentTypes {
            post {
                title
                schemaType
                metaRobotsNoindex
                metaDesc
                schema {
                    raw
                }
            }
            page {
                metaDesc
                metaRobotsNoindex
                schemaType
                title
                schema {
                    raw
                }
            }
        }
        redirects {
            origin
            target
            format
            type
        }
    }
}
```

## Credits
Thanks to [@ash_hitchcock](https://twitter.com/ash_hitchcock) for initializing launching this integration as a separate plugin.

# WPGraphQl Yoast SEO Plugin

This is an extension to the WPGraphQL plugin (https://github.com/wp-graphql/wp-graphql) that returns Yoast SEO data.

> Currently returning SEO data for pages, posts, custom post types, categories and custom taxonomies.

## Quick Install

1. Install & activate [WPGraphQL](https://www.wpgraphql.com/)
2. Clone or download the zip of this repository into your WordPress plugin directory & activate the **WP GraphQL Yoast SEO** plugin

## Composer

```
composer require ashhitch/wp-graphql-yoast-seo
```

## Usage

To query for the Yoast Data as the seo object to your query.:

```
{
  pages(first: 10) {
    edges {
      node {
        id
        title
        seo {
          title
          metaDesc
          focuskw
          metaKeywords
          metaRobotsNoindex
          metaRobotsNofollow
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
        }
      }
    }
  }
}

```

## V3 breaking change.

Image urls are now returned as `mediaItem` type.

This applies to `twitterImage` and `opengraphImage`

## Notes

This can be used in production, however it is still under active development.

## Support

[Open an issue](https://github.com/ashhitch/wp-graphql-yoast-seo/issues)

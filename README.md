# WPGraphQl Yoast SEO Plugin

This is an extension to the WPGraphQL plugin (https://github.com/wp-graphql/wp-graphql) that returns Yoast SEO data.

> Using this plugin? I would love to see what you make with it. 😃 [@ash_hitchcock](https://twitter.com/ash_hitchcock)

**Currently returning SEO data for:**

- Pages
- Posts
- Custom post types
- Categories
- Custom taxonomies
- WooCommerce Products
- Yoast Configuration
  - Webmaster verification
  - Social profiles
  - Schemas
  - Breadcrumbs

> If there is any Yoast data that is not currently returned, please raise an issue so we can add it to the roadmap.

## Quick Install

1. Install & activate [WPGraphQL](https://www.wpgraphql.com/)
2. Clone or download the zip of this repository into your WordPress plugin directory & activate the **WP GraphQL Yoast SEO** plugin

## Composer

```
composer require ashhitch/wp-graphql-yoast-seo
```

## Usage

To query for the Yoast Data as the seo object to your query:

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


To query for the site configuration data you can query from the root.

```
{
  posts {

  }

  seo {
    webmaster {
      googleVerify
      yandexVerify
      msVerify
      baiduVerify
    }
    schema {
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

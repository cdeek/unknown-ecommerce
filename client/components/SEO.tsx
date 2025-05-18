import React from 'react';
import { Helmet } from 'react-helmet-async';

interface ImageMeta {
  url: string;
  width?: string;
  height?: string;
  alt?: string;
}

interface CustomMeta {
  name?: string;
  property?: string;
  content: string;
}

interface ProductStructuredData {
  title: string;
  description: string;
  sku: string;
  brand: string;
  images: string;
  url: string;
  price: string;
  currency: string;
  availability: 'InStock' | 'OutOfStock' | 'PreOrder';
  condition?: 'NewCondition' | 'UsedCondition' | 'RefurbishedCondition';
  releaseDate?: string;
  priceValidUntil?: string;
}

interface SEOProps {
  title: string;
  description: string;
  keywords?: string[];
  images?: ImageMeta[];
  authors?: string[];
  tags?: string[];
  customMeta?: CustomMeta[];
  url?: string;
  type?: string;
  robots?: string;
  structuredData?: Record<string, any>;
  productData?: ProductStructuredData;
  children?: React.ReactNode;
}

const SEO: React.FC<SEOProps> = ({
  title,
  description,
  keywords = [],
  images = [],
  authors = [],
  tags = [],
  customMeta = [],
  url,
  type = 'website',
  robots = 'index,follow',
  structuredData,
  productData,
  children
}) => {
  const defaultImageWidth = '1200';
  const defaultImageHeight = '630';
  const defaultImage = '/default-og.jpg';
  const mainImage = images[0]?.url || defaultImage;
  const siteName = 'App';

  const finalStructuredData =
    structuredData ||
    (type === 'product' && productData
      ? {
          '@context': 'https://schema.org',
          '@type': 'Product',
          name: productData.title,
          description: productData.description,
          sku: productData.sku,
          image: [productData.images[0]],
          brand: {
            '@type': 'Brand',
            name: productData.brand
          },
          offers: {
            '@type': 'Offer',
            url: productData.url,
            priceCurrency: productData.currency,
            price: productData.price,
            availability: `https://schema.org/${productData.availability}`,
            itemCondition: productData.condition
              ? `https://schema.org/${productData.condition}`
              : 'https://schema.org/NewCondition',
            ...(productData.priceValidUntil && {
              priceValidUntil: productData?.priceValidUntil
            })
          },
          ...(productData.releaseDate && { releaseDate: productData.releaseDate })
        }
      : null);

  return (
    <Helmet>
      <title>{`${title} | ${siteName}`}</title>
      <meta name="description" content={description} />
      <meta name="robots" content={robots} />
      <meta name="keywords" content={keywords.join(', ')} />
      {url && <link rel="canonical" href={url} />}

      {/* Authors */}
      {authors.map((author, index) => (
        <meta key={`author-${index}`} name="author" content={author} />
      ))}

      {/* Tags */}
      {tags.map((tag, index) => (
        <meta key={`tag-${index}`} property="article:tag" content={tag} />
      ))}

      {/* Custom Meta */}
      {customMeta.map((meta, index) => (
        <meta
          key={`custom-${index}`}
          {...(meta.name ? { name: meta.name } : {})}
          {...(meta.property ? { property: meta.property } : {})}
          content={meta.content}
        />
      ))}

      {/* Open Graph */}
      <meta property="og:type" content={type} />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:site_name" content={siteName} />
      {url && <meta property="og:url" content={url} />}

      {/* Open Graph Images */}
      <meta property="og:image" content={mainImage} />
      {images.map((image, index) => (
        <React.Fragment key={`og-image-${index}`}>
          {index > 0 && <meta property="og:image" content={image.url} />}
          <meta
            property="og:image:width"
            content={image.width || defaultImageWidth}
          />
          <meta
            property="og:image:height"
            content={image.height || defaultImageHeight}
          />
          {image.alt && <meta property="og:image:alt" content={image.alt} />}
        </React.Fragment>
      ))}

      {/* Twitter */}
      <meta name="twitter:card" content={images.length > 1 ? 'summary_large_image' : 'summary'} />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={mainImage} />

      {/* Structured Data */}
      {finalStructuredData && (
        <script type="application/ld+json">
          {JSON.stringify(finalStructuredData)}
        </script>
      )}

      {/* Additional Elements */}
      {children}
    </Helmet>
  );
};

export default SEO;

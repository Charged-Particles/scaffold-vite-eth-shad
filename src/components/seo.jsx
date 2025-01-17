import React from 'react';
import PropTypes from 'prop-types';
import { Helmet } from 'react-helmet';
import _ from 'lodash';

import { GLOBALS } from '@/utils/globals';

// Central Logging
import { Logger } from '@/utils/logger';
const log = Logger('SEO');
log.debug('initialized');


function SEO({ title, description, lang, meta = [] }) {
  const metaDescription = _.isEmpty(description) ? GLOBALS.SEO.desc : description;
  const keywords = [ 'ethereum' ];

  const defaultMeta = [
    {
      name: 'image',
      content: GLOBALS.SEO.image,
    },
    {
      name: 'keywords',
      content: keywords.join(' '),
    },
    {
      property: 'og:url',
      content: GLOBALS.SEO.url,
    },
    {
      property: 'og:title',
      content: title,
    },
    {
      property: 'og:description',
      content: metaDescription,
    },
    {
      name: 'og:image',
      content: GLOBALS.SEO.image,
    },
    {
      property: 'og:type',
      content: 'website',
    },
    {
      name: 'twitter:card',
      content: 'summary',
    },
    {
      name: 'twitter:creator',
      content: GLOBALS.SEO.twitterUsername,
    },
    {
      name: 'twitter:title',
      content: title,
    },
    {
      name: 'twitter:description',
      content: metaDescription,
    },
    {
      name: 'twitter:image',
      content: GLOBALS.SEO.image,
    },
  ];

  const metadata = _.unionBy(meta, defaultMeta, meta => `${meta.name}-${meta.property}`);

  return (
    <Helmet
      defer={false}
      htmlAttributes={{
        lang,
      }}
      title={GLOBALS.SEO.defaultTitle}
      titleTemplate={GLOBALS.SEO.titleTemplate}
    >
      {/* {import.meta.env.NODE_ENV === 'production' && (
        <base href={GLOBALS.SEO.url} />
      )} */}

      {/* {!_.isEmpty(title) && (
        <title itemProp="name" lang="en">{title}</title>
      )} */}
      <meta name="description" content={metaDescription} />

      <meta property="og:type" content="website" />
      {_.map(metadata, (m, i) => (<meta key={i} property={m.name} content={m.content} />))}

      <link rel="canonical" href={GLOBALS.SEO.url} />
    </Helmet>
  );
}

SEO.defaultProps = {
  lang: 'en',
  meta: [],
  description: '',
  title: '',
};

SEO.propTypes = {
  description: PropTypes.string,
  lang: PropTypes.string,
  meta: PropTypes.arrayOf(PropTypes.object),
  title: PropTypes.string,
};

export default SEO;

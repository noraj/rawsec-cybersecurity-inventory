// See https://docusaurus.io/docs/site-config for all the possible
// site configuration options.

// List of projects/orgs using your project for the users page.
/*
const users = [
  {
    caption: 'noraj',
    // You will need to prepend the image path with your baseUrl
    // if it is not '/', like: '/test-site/img/docusaurus.svg'.
    image: '/img/docusaurus.svg',
    infoLink: 'https://www.facebook.com',
    pinned: true,
  },
];
*/

const siteConfig = {
  title: 'Documentation', // Title for your website.
  tagline: "Rawsec's CyberSecurity Inventory documentation",
  url: 'https://inventory.raw.pm/', // Your website URL
  baseUrl: '/docs/', // Base URL for your project
  // For github.io type URLs, you would set the url and baseUrl like:
  //   url: 'https://facebook.github.io',
  //   baseUrl: '/test-site/',

  // Used for publishing and more
  projectName: 'docs', // used as build sub-folder too
  organizationName: 'rawsec',
  // For top-level user or org sites, the organization is still the same.
  // e.g., for the https://JoelMarcey.github.io site, it would be set like...
  //   organizationName: 'JoelMarcey'

  // For no header links in the top nav bar -> headerLinks: [],
  headerLinks: [
    {doc: 'usage', label: 'Usage'},
    {doc: 'add', label: 'Contribution'},
    {doc: 'install', label: 'Development'},
    {doc: 'api', label: 'API'},
    {doc: 'faq', label: 'F.A.Q.'},
    {page: 'help', label: 'Help'},
    {href: 'https://gitlab.com/rawsec/rawsec-cybersecurity-list', label: 'GitLab'},
  ],

  // If you have users set above, you add it here:
  //users,

  /* path to images for header/footer */
  headerIcon: 'img/logo5_50x40.png',
  footerIcon: 'img/logo5_50x40.png',
  favicon: 'img/favicon/favicon.ico',

  /* Colors for website */
  colors: {
    primaryColor: '#FF5050',
    secondaryColor: '#33363B',
  },

  /* Custom fonts for website */
  /*
  fonts: {
    myFont: [
      "Times New Roman",
      "Serif"
    ],
    myOtherFont: [
      "-apple-system",
      "system-ui"
    ]
  },
  */

  // This copyright info is used in /core/Footer.js and blog RSS/Atom feeds.
  copyright: `Copyright © ${new Date().getFullYear()} Rawsec`,

  highlight: {
    // The name of the theme used by Highlight.js when highlighting code.
    // You can find the list of supported themes here:
    // https://github.com/isagalaev/highlight.js/tree/master/src/styles
    theme: 'default',
    // Default language.
    // It will be used if one is not specified at the top of the code block. You can find the list of supported languages here:
    // https://github.com/isagalaev/highlight.js/tree/master/src/languages
    defaultLang: 'plaintext',
  },

  // Add custom scripts here that would be placed in <script> tags.
  scripts: [],

  // On page navigation for the current documentation page.
  onPageNav: 'separate',
  // No .html extensions for paths.
  cleanUrl: true,

  // Open Graph image.
  ogImage: 'img/logo5_dark_355x286.png',

  // Edit URL
  editUrl: 'https://gitlab.com/rawsec/rawsec-cybersecurity-list/edit/master/docs/',

  // Enable the scroll to top button.
  scrollToTop: true,

  // Twitter infos
  twitter: true,
  twitterUsername: 'rawsec_cyber',
  twitterImage: 'img/logo5_dark_355x286.png',

  // /en/ in URL
  useEnglishUrl: true,

  algolia: {
    apiKey: '4bae026c39902ddf54b2f37bcb8ed56b',
    indexName: 'rawsec-cybersecurity-inventory',
  },

  // You may provide arbitrary config keys to be used as needed by your
  // template. For example, if you need your repo's URL...
  //   repoUrl: 'https://github.com/facebook/test-site',
};

module.exports = siteConfig;

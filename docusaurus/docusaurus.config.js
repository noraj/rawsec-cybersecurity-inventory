module.exports={
  title: 'Documentation',
  tagline: "Rawsec's CyberSecurity Inventory documentation",
  url: 'https://inventory.raw.pm/',
  baseUrl: '/docs/',
  organizationName: 'rawsec',
  scripts: [],
  favicon: 'img/favicon/favicon.ico',
  onBrokenLinks: 'log',
  onBrokenMarkdownLinks: 'log',
  plugins: [
    [
      '@docusaurus/plugin-client-redirects',
      {
        fromExtensions: ['html'],
      },
    ],
    [
      '@docusaurus/plugin-content-pages',
      {}
    ],
    [
      '@docusaurus/plugin-content-docs',
      {
        path: 'docs',
        editUrl: 'https://gitlab.com/rawsec/rawsec-cybersecurity-list/edit/dev/docusaurus/',
        routeBasePath: '/',
        tagsBasePath: 'tags',
        sidebarPath: require.resolve('./sidebars.js'),
        sidebarCollapsible: false,
        sidebarCollapsed: false,
        showLastUpdateAuthor: true,
        showLastUpdateTime: true,
        breadcrumbs: true,
        //disableVersioning: true,
        //includeCurrentVersion: true
      }
    ]
  ],
  themes: [
    [
      '@docusaurus/theme-classic',
      {
        customCss: require.resolve('./src/css/customTheme.css'),
      }
    ],
    [
      require.resolve('@easyops-cn/docusaurus-search-local'),
      {
        indexDocs: true,
        indexBlog: false,
        indexPages: true,
        hashed: true
      }
    ]
  ],
  themeConfig: {
    defaultMode: 'dark',
    navbar: {
      title: 'Documentation',
      logo: {
        alt: 'Rawsec logo',
        srcDark: 'img/rawsec_logo_355x286.svg',
        src: 'img/rawsec_logo_dark_355x286.svg',
        width: 42,
        height: 34
      },
      items: [
        {
          type: 'doc',
          docId: 'usage',
          label: 'Usage',
          position: 'right'
        },
        {
          type: 'doc',
          docId: 'add',
          label: 'Contribution',
          position: 'right'
        },
        {
          type: 'doc',
          docId: 'install',
          label: 'Development',
          position: 'right'
        },
        {
          type: 'doc',
          docId: 'api',
          label: 'API',
          position: 'right'
        },
        {
          type: 'doc',
          docId: 'faq',
          label: 'F.A.Q.',
          position: 'right'
        },
        {
          to: 'help',
          label: 'Help',
          position: 'right'
        },
        {
          href: 'https://gitlab.com/rawsec/rawsec-cybersecurity-list',
          label: 'GitLab',
          position: 'right'
        },
        {
          type: 'search',
          position: 'right',
        },
      ],
      hideOnScroll: false
    },
    image: 'img/rawsec_logo_dark_355x286.svg',
    footer: {
      links: [
        {
          title: 'Docs',
          items: [
            {
              label: 'User Guide',
              to: '/docs/usage'
            },
            {
              label: 'Contribution Guidelines',
              to: '/docs/add'
            },
            {
              label: 'Development Guidelines',
              to: '/docs/install'
            },
            {
              label: 'API Reference',
              to: '/docs/api'
            },
            {
              label: 'F.A.Q.',
              to: '/docs/faq'
            }
          ]
        },
        {
          title: 'Community and Social',
          items: [
            {
              label: 'Discord',
              to: 'https://discord.gg/xvTb2vx'
            },
            {
              label: 'Twitter (Rawsec)',
              to: 'https://twitter.com/rawsec_cyber'
            },
            {
              label: 'Twitter (Rawsec bot)',
              to: 'https://twitter.com/RawsecBot'
            },
            {
              label: "Twitter (noraj: Rawsec's captain)",
              to: 'https://twitter.com/noraj_rawsec'
            }
          ]
        },
        {
          title: 'Source',
          items: [
            {
              label: 'Main',
              to: 'https://gitlab.com/rawsec/rawsec-cybersecurity-list'
            },
            {
              label: 'Mirror',
              to: 'https://github.com/noraj/rawsec-cybersecurity-inventory'
            }
          ]
        }
      ],
      copyright: 'Copyright © 2022 Rawsec',
      logo: {
        alt: 'Rawsec logo',
        srcDark: 'img/rawsec_logo_355x286.svg',
        src: 'img/rawsec_logo_dark_355x286.svg',
        width: 50,
        height: 40
      },
      style: 'dark',
    },
    prism: {
      theme: require("prism-react-renderer").themes.dracula,
      darkTheme: require("prism-react-renderer").themes.oceanicNext,
    },
    docs: {
      sidebar: {
        hideable: true,
        autoCollapseCategories: false,
      }
    }
  },
  customFields: {
    rawsec: {
      primaryColor: '#FF5050'
    }
  }
}

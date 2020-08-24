module.exports = {
  base: '/vue-tinder/',
  locales: {
    '/': {
      lang: 'en-US',
      title: 'VueTinder',
      description: 'Vue-powered Static Site Generator'
    },

  },
  themeConfig: {
    repo: 'shanlh/vue-tinder',
    smoothScroll: true,
    locales: {
      '/': {
        selectText: 'Languages',
        label: 'English',
        editLinkText: 'Edit this page on GitHub',

        nav: [
          { text: 'Guide', link: '/guide/', ariaLabel: 'Guide' },
          { text: 'API', link: '/api/' }
        ],
        sidebar: {
          '/guide/': [
            {
              title: 'Guide',
              collapsable: false,
              children: [
                ['/guide/', 'Introduction'],
                ['/guide/getting-started', 'Getting Started'],
                ['/guide/bing-images', 'Start With Bing Images'],
                ['/guide/how-to-click', 'How To Click?'],
                ['/guide/oops', 'Oops!']
              ]
            }
          ],
          '/api/': [
            {
              title: 'API',
              collapsable: false,
              children: [
                ['/api/', 'Props'],
                ['/api/events', 'Events'],
                ['/api/methods', 'Methods'],
                ['/api/slots', 'Slots']
              ]
            }
          ]
        }
      },
    }
  },
  plugins: [
    [
      '@vuepress/google-analytics',
      {
        ga: 'UA-150557393-1'
      }
    ]
  ]
}

module.exports = {
  output: "export",
  images: {
    loader: "custom",
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
  },
  transpilePackages: ["next-image-export-optimizer"],
  env: {
    nextImageExportOptimizer_imageFolderPath: "public/images",
    nextImageExportOptimizer_exportFolderPath: "out",
    nextImageExportOptimizer_quality: "75",
    nextImageExportOptimizer_storePicturesInWEBP: "true",
    nextImageExportOptimizer_exportFolderName: "nextImageExportOptimizer",

    // If you do not want to use blurry placeholder images, then you can set
    // nextImageExportOptimizer_generateAndUseBlurImages to false and pass
    // `placeholder="empty"` to all <ExportedImage> components.
    nextImageExportOptimizer_generateAndUseBlurImages: "true",

    // If you want to cache the remote images, you can set the time to live of the cache in seconds.
    // The default value is 0 seconds.
    nextImageExportOptimizer_remoteImageCacheTTL: "0",
  },
  // async redirects() {
  //   return [
  //     // Old blog post format
  //     {
  //       source: "/2020/05/03/check-for-undefined-in-javascript",
  //       destination: "/check-for-undefined-in-javascript",
  //       permanent: true,
  //     },
  //     {
  //       source: "/2020/01/29/the-power-of-mvp",
  //       destination: "/the-power-of-mvp",
  //       permanent: true,
  //     },

  //     {
  //       source: "/2019/12/07/solid-principles-of-object-oriented-design",
  //       destination: "/solid-principles-of-object-oriented-design",
  //       permanent: true,
  //     },

  //     {
  //       source: "/2019/06/17/adaptative-media-serving-using-service-workers",
  //       destination: "/adaptative-media-serving-using-service-workers",
  //       permanent: true,
  //     },
  //     {
  //       source: "/2019/02/18/bloc-pattern-with-react-hooks",
  //       destination: "/bloc-pattern-with-react-hooks",
  //       permanent: true,
  //     },
  //     {
  //       source: "/2019/01/26/todomvc-redux-starter-kit",
  //       destination: "/todomvc-redux-starter-kit",
  //       permanent: true,
  //     },
  //     {
  //       source: "/2016/07/04/watch-with-angular2",
  //       destination: "/watch-with-angular2",
  //       permanent: true,
  //     },
  //     {
  //       source: "/2016/07/03/events-in-angular2",
  //       destination: "/events-in-angular2",
  //       permanent: true,
  //     },
  //     {
  //       source: "/2016/06/29/midterm",
  //       destination: "/midterm",
  //       permanent: true,
  //     },
  //     {
  //       source: "/2016/06/26/angularbeers-with-misko-hevery",
  //       destination: "/angularbeers-with-misko-hevery",
  //       permanent: true,
  //     },
  //     {
  //       source: "/2016/06/12/moving-big-parts-to-angular-2",
  //       destination: "/moving-big-parts-to-angular-2",
  //       permanent: true,
  //     },
  //     {
  //       source: "/2016/06/05/component-migration-started",
  //       destination: "/component-migration-started",
  //       permanent: true,
  //     },
  //     {
  //       source: "/2016/05/29/first-coding-week",
  //       destination: "/first-coding-week",
  //       permanent: true,
  //     },
  //     {
  //       source: "/2016/05/22/ending-community-bonding-period",
  //       destination: "/ending-community-bonding-period",
  //       permanent: true,
  //     },
  //   ];
  // },
  swcMinify: true,
  webpack: (config, { dev, isServer }) => {
    if (isServer) {
      require("./scripts/generate-sitemap");
      require("./scripts/generate-rss");
    }

    // Replace React with Preact only in client production build
    // if (!dev && !isServer) {
    //   Object.assign(config.resolve.alias, {
    //     react: "preact/compat",
    //     "react-dom/test-utils": "preact/test-utils",
    //     "react-dom": "preact/compat",
    //   });
    // }

    return config;
  },
};

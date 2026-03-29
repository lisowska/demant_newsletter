const nextConfig = {
  distDir: ".next",
  productionBrowserSourceMaps: true,
  i18n: {
    // These are all the locales you want to support in your application.
    // These should generally match (or at least be a subset of) those in Sitecore.
    locales: ["en"],
    // This is the locale that will be used when visiting a non-locale
    // prefixed path e.g. `/styleguide`.
    defaultLocale: "en",
  },

  // Enable React Strict Mode
  reactStrictMode: true,

  // Dev only: allow HMR when opening the app by LAN IP / hostname (not localhost)
  allowedDevOrigins: ["10.138.68.215"],

  webpack(config) {
    config.module.rules.push({
      test: /\.svg$/,
      use: ["@svgr/webpack"],
    });

    return config;
  },
};

module.exports = nextConfig;

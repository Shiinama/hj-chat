module.exports = function (api) {
  api.cache(true);
  return {
    presets: ["babel-preset-expo"],
    plugins: [
      require.resolve("expo-router/babel"),
      [
        "module-resolver",
        {
          root: ["./"],
          alias: {
            "@utils": "./utils",
            "@store": "./store",
            "@hooks": "./hooks",
            "@assets": "./assets",
            "@types": "./types",
            "@constants": "./constants",
          },
        },
      ],
    ],
  };
};

const path = require("path");

module.exports = {
  // entry file 가장먼저 실행될 js파일 지정 (진입점)
  entry: ["@babel/polyfill", "./src/js/main.js", "./src/css/style.css"],
  // 컴파일 + 번들링된 js 파일이 저장될 경로와 이름 지정
  output: {
    // 여러개의 js파일의 경로와 이름 설정
    path: path.resolve(__dirname, "public"),
    filename: "bundle.js",
  },
  // Webpack이 babel 호출
  module: {
    rules: [
      {
        test: /\.css$/,
        use: ["style-loader", "css-loader"],
      }, // 플러그인들이 쓰는 것
      {
        test: /\.js$/, // 정규표현식으로 표기
        // node_modules을 제외하고 babel로드하여 가동
        include: [path.resolve(__dirname, "src/js")],
        exclude: /node_modules/,
        use: {
          loader: "babel-loader",
          options: {
            presets: ["@babel/preset-env"],
            plugins: ["@babel/plugin-proposal-class-properties"],
          },
        },
      },
    ],
  },
  devtool: "source-map",
  // https://webpack.js.org/concepts/mode/#mode-development
  mode: "development",
};

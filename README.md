# gourd

基于前端项目与构建分离的想法，前端工程师专注于业务开发，无需关心构建。前端工程师只需要通过一个配置文件说明自己的输入输出，由 `gourd` 负责构建。

与[roadhog]()想法类似。

## Getting Started


## 配置

配置文件 `gourd.config.js` 在项目根目录下

默认配置：
```
module.exports = {
  paths: {
    src: 'src',
    build: 'build',
    public: 'public',
  },
  entry: './index.js',
  publicPath: '/',
  externals: {
  },
  disableCSSModules: false,
  html: {
    filename: 'index.html',
    template: './index.html',
  },
  server: {
    host: '127.0.0.1',
    port: 8080,
    proxy: {},
  }
}
```

配置说明：

- paths 基本上不会有变动
  src 源代码路径，一般不会变动，entry 和 template 均是相对这个路径
  build 构建目的目录
  public 放置 favicon 的目录
- entry 入口，只支持字符串，或者字符串数组
- publicPath 构建后的资源路径
- externals 第三方库配置
- disableCSSModules 禁用 CSS modules
- html
  filename build 生成的文件名
  template html 模板文件
- server 可能会改动
  host
  port
  proxy

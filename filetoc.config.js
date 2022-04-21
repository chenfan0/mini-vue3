module.exports = {
  remoteUrl: "https://github.com/chenfan0/mini-vue3", // 仓库地址
  mainBranch: "main", // 主分支
  dirPath: "./src/", // 要生成toc的目录路径
  mdPath: "./README.md", // 生成的toc添加到的md文件路径
  excludes: ["example"],
};

// 212 root.helpers.splice(root.helpers.indexOf(name), 1)
// 200
// if (count === 0) {
//   context.root.helpers.push(name)
// }

# byfe-scripts

## 安装

```shell
npm install -g byfe-scripts
```

## bs-icon-dart

将iconfont上的css文件转为dart文件，以Map<iconName, IconValue>的形式导出；

### 用法

```shell
bs-icon-dart css文件路径 [导出dart的路径]
```

默认输出为： ./icons.dart

### 使用

```shell
bs-icon-dart http://at.alicdn.com/t/font_1147625_d6nqb83uorg.css ./test.dart
```

### 输出

test.dart

```dart
class Icons {
    static icon_arrow = 0xe697;
    // ...
}
```

# ezyfox-server-react-native-client <img src="https://github.com/youngmonkeys/ezyfox-server/blob/master/logo.png" width="48" height="48" />
react-native client for ezyfox server

# Synopsis

react-native client for ezyfox server

# Configuration

Run to fix `error: SDK "iphoneos" cannot be located.`

```bash
sudo xcode-select --switch /Applications/Xcode.app
```

With `xcode 12.5`, 

# Fix build errors

1. `xcrun: error: SDK "iphoneos" cannot be located`: take a look: [https://infinitbility.com/build-failed-after-update-xcode-12.5](https://infinitbility.com/build-failed-after-update-xcode-12.5)
2. `Unknown argument type ‘attribute’ in method -[RCTAppState getCurrentAppState:error:]`: [https://igniz87.medium.com/](https://igniz87.medium.com/react-native-unknown-argument-type-attribute-in-method-rctappstate-5daf904b2367)

App.info({
  id: 'com.yarntale.app',
  name: 'YarnTale',
  description: 'YarnTale - create online slide show',
  author: 'author',
  email: 'dev@yarntale.com',
  website: 'http://yarntale.cloudspaint.com',
  version: "1.8",
  buildNumber: '108008'
});

App.appendToConfig(`
  <platform name="ios">
    <config-file platform="ios" target="*-Info.plist" parent="NSMicrophoneUsageDescription">
        <string>Create slide show.</string>
    </config-file>
  </platform>
`);

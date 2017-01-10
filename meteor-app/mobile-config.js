App.info({
  id: 'com.yarntale.app',
  name: 'YarnTale',
  description: 'YarnTale - create online slide show',
  author: 'author',
  email: 'dev@yarntale.com',
  website: 'http://yarntale.cloudspaint.com',
  version: "0.5",
  buildNumber: '1'
});

App.appendToConfig(`
  <platform name="ios">
    <config-file platform="ios" target="*-Info.plist" parent="NSMicrophoneUsageDescription">
        <string>Create slide show.</string>
    </config-file>
    <config-file platform="ios" target="*-Info.plist" parent="NSCameraUsageDescription">
        <string>Create slide show.</string>
    </config-file>
    <config-file platform="ios" target="*-Info.plist" parent="NSPhotoLibraryUsageDescription">
        <string>Create slide show.</string>
    </config-file>
  </platform>
`);

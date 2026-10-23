/**
 * 在电脑上检查国服/国际服配置，不需要 AutoX 或安卓设备：
 *   node src/tests/test_server_profile.js
 */
var assert = require('assert');
var path = require('path');
var profile = require(path.join(__dirname, '..', '..', 'NIKKE', 'serverProfile.js'));

var resolveServerProfile = profile.resolveServerProfile;
var normalizeRegion = profile.normalizeRegion;
var isValidPackageName = profile.isValidPackageName;

var intl = resolveServerProfile();
assert.strictEqual(intl.region, 'intl');
assert.strictEqual(intl.appName, 'NIKKE');
assert.strictEqual(intl.packageName, '');
assert.strictEqual(intl.usePackageLaunch, false);
assert.strictEqual(intl.lipEnabled, true);
assert.strictEqual(intl.emailLoginEnabled, true);
assert.deepStrictEqual(intl.launchNames, ['NIKKE']);
assert.strictEqual(
  intl.launchError,
  '无法启动NIKKE，请确保Autox.js拥有“读取已安装应用列表”权限'
);

var unknown = resolveServerProfile({ serverRegion: 'global' });
assert.strictEqual(unknown.region, 'intl');
assert.strictEqual(unknown.usePackageLaunch, false);

var cn = resolveServerProfile({ serverRegion: 'cn' });
assert.strictEqual(cn.region, 'cn');
assert.strictEqual(cn.packageName, 'com.tencent.nikke');
assert.strictEqual(cn.appName, '胜利女神：新的希望');
assert.strictEqual(cn.usePackageLaunch, true);
assert.strictEqual(cn.lipEnabled, false);
assert.strictEqual(cn.emailLoginEnabled, false);
assert.deepStrictEqual(cn.launchNames, ['胜利女神：新的希望', '胜利女神:新的希望']);
assert.ok(cn.launchNames.indexOf('NIKKE') < 0);
assert.ok(cn.launchError.indexOf('com.tencent.nikke') >= 0);
assert.ok(cn.launchError.indexOf('自行手动进入游戏') >= 0);
assert.ok(cn.hint.indexOf('com.tencent.nikke') >= 0);
assert.ok(cn.lipHint.indexOf('Level Infinite Pass') >= 0);

assert.strictEqual(normalizeRegion('国服'), 'cn');
assert.strictEqual(normalizeRegion('CN'), 'cn');
assert.strictEqual(normalizeRegion(''), 'intl');

var overridden = resolveServerProfile({
  serverRegion: 'cn',
  packageNameOverride: '  com.example.nikke  ',
  appNameOverride: ' 自定义名称 '
});
assert.strictEqual(overridden.packageName, 'com.example.nikke');
assert.strictEqual(overridden.appName, '自定义名称');
assert.strictEqual(overridden.packageNameOverridden, true);
assert.strictEqual(overridden.appNameOverridden, true);
assert.deepStrictEqual(overridden.launchNames, ['自定义名称']);
assert.ok(overridden.launchError.indexOf('com.example.nikke') >= 0);

var intlPackage = resolveServerProfile({
  serverRegion: 'intl',
  packageNameOverride: 'com.proximabeta.nikke'
});
assert.strictEqual(intlPackage.usePackageLaunch, true);
assert.strictEqual(intlPackage.lipEnabled, true);
assert.strictEqual(intlPackage.emailLoginEnabled, true);
assert.strictEqual(intlPackage.appName, 'NIKKE');
assert.strictEqual(intlPackage.packageName, 'com.proximabeta.nikke');

var blankOverride = resolveServerProfile({
  serverRegion: 'intl',
  packageNameOverride: '   ',
  appNameOverride: ''
});
assert.strictEqual(blankOverride.usePackageLaunch, false);
assert.strictEqual(blankOverride.packageName, '');
assert.strictEqual(blankOverride.appName, 'NIKKE');

assert.strictEqual(isValidPackageName(''), true);
assert.strictEqual(isValidPackageName('  '), true);
assert.strictEqual(isValidPackageName('com.tencent.nikke'), true);
assert.strictEqual(isValidPackageName('com.proximabeta.nikke'), true);
assert.strictEqual(isValidPackageName('com.gamamobi.nikke'), true);
assert.strictEqual(isValidPackageName('NIKKE'), false);
assert.strictEqual(isValidPackageName('胜利女神'), false);
assert.strictEqual(isValidPackageName('com.tencent.'), false);

console.log('serverProfile checks passed');

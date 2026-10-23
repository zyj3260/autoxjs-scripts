/**
 * 国服 / 国际服的启动配置。
 * 只做纯数据判断，不调用 AutoX 的 app / storages，方便在电脑上检查。
 */
var CN_PACKAGE = 'com.tencent.nikke';
var CN_APP_NAME = '胜利女神：新的希望';
var INTL_APP_NAME = 'NIKKE';

var SERVER_REGION_OPTIONS = [
  {
    value: 'intl',
    displayValue: '国际服'
  },
  {
    value: 'cn',
    displayValue: '国服'
  }
];

function trimText(value) {
  if (value == null)
    return '';
  return String(value).trim();
}

function normalizeRegion(region) {
  var text = trimText(region).toLowerCase();
  if (text === 'cn' || text === '国服')
    return 'cn';
  return 'intl';
}

function isValidPackageName(packageName) {
  var text = trimText(packageName);
  if (!text)
    return true;
  return /^[A-Za-z]\w*(?:\.[A-Za-z]\w*)+$/.test(text);
}

function launchNamesFor(region, appName, appNameOverridden) {
  var names = [];
  if (appName)
    names.push(appName);
  // 国服商店名有全角/半角冒号两种写法。不要回退到「NIKKE」，避免同时安装国际服时打开错客户端。
  if (region === 'cn' && !appNameOverridden) {
    var aliases = [CN_APP_NAME, '胜利女神:新的希望'];
    for (var i = 0; i < aliases.length; ++i) {
      if (names.indexOf(aliases[i]) < 0)
        names.push(aliases[i]);
    }
  }
  if (!names.length)
    names.push(INTL_APP_NAME);
  return names;
}

function hintFor(region) {
  if (region === 'cn') {
    return '国服默认包名 ' + CN_PACKAGE + '，应用名「' + CN_APP_NAME + '」。'
      + '渠道包不同请填写实际包名。仍无法启动时，把启动方式改为「自行手动进入游戏」。'
      + 'OurPlay 启动方式仍然可用。';
  }
  return '国际服按应用名「NIKKE」启动，包名和应用名留空即可。'
    + '启动失败可填包名（国际服常见 com.proximabeta.nikke，港澳台常见 com.gamamobi.nikke），'
    + '或改为「自行手动进入游戏」。';
}

function lipHintFor(region) {
  if (region === 'cn')
    return '国服没有 Level Infinite Pass，此项不会执行。切回国际服后会恢复原来的开关。';
  return '';
}

function launchErrorFor(region, packageName, appName) {
  if (region === 'cn') {
    return '无法启动国服。请确认已安装「' + appName + '」（默认包名 ' + CN_PACKAGE
      + '，本次尝试 ' + (packageName || CN_PACKAGE) + '）。'
      + '渠道包请填写实际包名，或把启动方式改为「自行手动进入游戏」。';
  }
  if (packageName) {
    return '无法启动' + appName + '（包名 ' + packageName + '）。请检查包名，或改为「自行手动进入游戏」。';
  }
  return '无法启动' + appName + '，请确保Autox.js拥有“读取已安装应用列表”权限';
}

function resolveServerProfile(options) {
  options = options || {};
  var region = normalizeRegion(options.serverRegion);
  var packageNameOverride = trimText(options.packageNameOverride);
  var appNameOverride = trimText(options.appNameOverride);
  var isCn = region === 'cn';
  var packageName = packageNameOverride || (isCn ? CN_PACKAGE : '');
  var appName = appNameOverride || (isCn ? CN_APP_NAME : INTL_APP_NAME);
  return {
    region: region,
    displayValue: isCn ? '国服' : '国际服',
    packageName: packageName,
    appName: appName,
    packageNameOverridden: !!packageNameOverride,
    appNameOverridden: !!appNameOverride,
    usePackageLaunch: isCn || !!packageNameOverride,
    lipEnabled: !isCn,
    emailLoginEnabled: !isCn,
    launchNames: launchNamesFor(region, appName, !!appNameOverride),
    hint: hintFor(region),
    lipHint: lipHintFor(region),
    launchError: launchErrorFor(region, packageName, appName),
    defaultPackageName: isCn ? CN_PACKAGE : '',
    knownPackages: isCn
      ? [CN_PACKAGE]
      : ['com.proximabeta.nikke', 'com.gamamobi.nikke']
  };
}

module.exports = {
  CN_PACKAGE: CN_PACKAGE,
  CN_APP_NAME: CN_APP_NAME,
  INTL_APP_NAME: INTL_APP_NAME,
  SERVER_REGION_OPTIONS: SERVER_REGION_OPTIONS,
  normalizeRegion: normalizeRegion,
  isValidPackageName: isValidPackageName,
  resolveServerProfile: resolveServerProfile
};

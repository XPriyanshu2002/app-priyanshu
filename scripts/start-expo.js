const { spawn, spawnSync } = require('child_process');
const fs = require('fs');
const path = require('path');

const isWindows = process.platform === 'win32';
const env = {};

for (const [key, value] of Object.entries(process.env)) {
  // Windows shell may expose special keys like "=C:" that break spawn when passed through.
  if (!key.startsWith('=') && typeof value === 'string') {
    env[key] = value;
  }
}

const pathKey = Object.keys(env).find((key) => key.toLowerCase() === 'path') || 'PATH';
for (const key of Object.keys(env)) {
  if (key !== pathKey && key.toLowerCase() === 'path') {
    delete env[key];
  }
}

const defaultSdkRoot =
  isWindows && process.env.LOCALAPPDATA
    ? path.join(process.env.LOCALAPPDATA, 'Android', 'Sdk')
    : null;

const sdkRoot = process.env.ANDROID_SDK_ROOT || process.env.ANDROID_HOME || defaultSdkRoot;
const cliArgs = process.argv.slice(2);
const shouldOpenAndroid = cliArgs.includes('--android');
const preferredAndroidAvd = process.env.ANDROID_AVD_NAME || 'Pixel_9_Pro_XL';

if (sdkRoot && fs.existsSync(sdkRoot)) {
  env.ANDROID_SDK_ROOT = sdkRoot;
  env.ANDROID_HOME = sdkRoot;
  env.ANDROID_AVD_NAME = preferredAndroidAvd;

  const androidToolPaths = [
    path.join(sdkRoot, 'platform-tools'),
    path.join(sdkRoot, 'emulator'),
    path.join(sdkRoot, 'cmdline-tools', 'latest', 'bin'),
  ].filter((toolPath) => fs.existsSync(toolPath));

  const currentPaths = (env[pathKey] || '').split(path.delimiter).filter(Boolean);

  for (const toolPath of androidToolPaths) {
    const exists = currentPaths.some((existingPath) => {
      if (isWindows) {
        return existingPath.toLowerCase() === toolPath.toLowerCase();
      }
      return existingPath === toolPath;
    });

    if (!exists) {
      currentPaths.unshift(toolPath);
    }
  }

  env[pathKey] = currentPaths.join(path.delimiter);
}

const getAndroidBinary = (relativeSegments, fallbackBinary) => {
  if (sdkRoot) {
    const candidate = path.join(sdkRoot, ...relativeSegments);
    if (fs.existsSync(candidate)) {
      return candidate;
    }
  }

  return fallbackBinary;
};

const getSpawnSyncOptions = () => ({
  env,
  encoding: 'utf8',
  windowsHide: true,
});

const isAndroidEmulatorRunning = () => {
  const adbBinary = getAndroidBinary(
    ['platform-tools', isWindows ? 'adb.exe' : 'adb'],
    isWindows ? 'adb.exe' : 'adb'
  );

  const result = spawnSync(adbBinary, ['devices'], getSpawnSyncOptions());
  if (result.error || result.status !== 0 || typeof result.stdout !== 'string') {
    return false;
  }

  return result.stdout
    .split(/\r?\n/)
    .map((line) => line.trim())
    .some((line) => /^emulator-\d+\s+device\b/.test(line));
};

const listAvailableAvds = () => {
  const emulatorBinary = getAndroidBinary(
    ['emulator', isWindows ? 'emulator.exe' : 'emulator'],
    isWindows ? 'emulator.exe' : 'emulator'
  );

  const result = spawnSync(emulatorBinary, ['-list-avds'], getSpawnSyncOptions());
  if (result.error || result.status !== 0 || typeof result.stdout !== 'string') {
    return [];
  }

  return result.stdout
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean);
};

const ensurePreferredAndroidEmulator = () => {
  if (!shouldOpenAndroid) {
    return;
  }

  if (isAndroidEmulatorRunning()) {
    return;
  }

  const availableAvds = listAvailableAvds();
  if (!availableAvds.includes(preferredAndroidAvd)) {
    if (availableAvds.length > 0) {
      console.warn(
        `Preferred AVD "${preferredAndroidAvd}" was not found. Available AVDs: ${availableAvds.join(', ')}`
      );
    } else {
      console.warn(`Preferred AVD "${preferredAndroidAvd}" was not found and no AVDs were detected.`);
    }
    return;
  }

  const emulatorBinary = getAndroidBinary(
    ['emulator', isWindows ? 'emulator.exe' : 'emulator'],
    isWindows ? 'emulator.exe' : 'emulator'
  );

  const emulatorProcess = spawn(emulatorBinary, ['-avd', preferredAndroidAvd], {
    env,
    detached: true,
    stdio: 'ignore',
    windowsHide: true,
  });

  emulatorProcess.on('error', (error) => {
    console.warn(`Failed to launch AVD "${preferredAndroidAvd}": ${error.message}`);
  });

  emulatorProcess.unref();
  console.log(`Starting Android emulator "${preferredAndroidAvd}"...`);
};

ensurePreferredAndroidEmulator();

// Auto-start the backend server
const backendEntry = path.join(__dirname, '..', 'backend', 'src', 'server.js');
if (fs.existsSync(backendEntry)) {
  const backendProcess = spawn(process.execPath, [backendEntry], {
    env: { ...env, NODE_ENV: env.NODE_ENV || 'development' },
    stdio: 'pipe',
    cwd: path.join(__dirname, '..', 'backend'),
  });

  backendProcess.stdout.on('data', (data) => {
    const msg = data.toString().trim();
    if (msg) console.log(`[backend] ${msg}`);
  });

  backendProcess.stderr.on('data', (data) => {
    const msg = data.toString().trim();
    if (msg) console.error(`[backend] ${msg}`);
  });

  backendProcess.on('error', (error) => {
    console.warn(`[backend] Failed to start: ${error.message}`);
  });

  process.on('exit', () => {
    try { backendProcess.kill(); } catch (_) { /* ignore */ }
  });
}

const command = process.execPath;
const expoCli = require.resolve('expo/bin/cli');
const args = [expoCli, 'start', ...cliArgs];
const expoProcess = spawn(command, args, {
  env,
  stdio: 'inherit',
});

expoProcess.on('error', (error) => {
  console.error(`Failed to start Expo CLI: ${error.message}`);
  process.exit(1);
});

expoProcess.on('exit', (code, signal) => {
  if (signal) {
    process.kill(process.pid, signal);
    return;
  }
  process.exit(code ?? 0);
});

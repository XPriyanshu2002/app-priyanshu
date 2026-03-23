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
const isTunnelRequested = cliArgs.includes('--tunnel');
const isInteractiveExpoSession = Boolean(
  process.stdin.isTTY && process.stdout.isTTY && process.stderr.isTTY && process.env.CI !== 'true'
);
const shouldOpenAndroid = cliArgs.includes('--android');
const preferredAndroidAvd = process.env.ANDROID_AVD_NAME || 'Pixel_9_Pro_XL';
const isWebRequested = cliArgs.includes('--web');
const hasHostModeArg = cliArgs.some((arg) => {
  if (arg === '--localhost' || arg === '--lan' || arg === '--tunnel') {
    return true;
  }

  return arg === '--host' || arg.startsWith('--host=');
});

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

const getFlagValue = (args, ...names) => {
  for (let i = 0; i < args.length; i += 1) {
    const arg = args[i];

    for (const name of names) {
      if (arg === name) {
        const value = args[i + 1];
        if (value && !value.startsWith('-')) {
          return value;
        }
      }

      if (arg.startsWith(`${name}=`)) {
        return arg.slice(name.length + 1);
      }
    }
  }

  return null;
};

const resolveExpoPort = () => {
  const requested = getFlagValue(cliArgs, '--port', '-p');
  const parsed = Number(requested);

  if (Number.isFinite(parsed) && parsed > 0) {
    return parsed;
  }

  return 8081;
};

const resolveApiPorts = () => {
  const basePort = Number(process.env.EXPO_PUBLIC_API_PORT || 5000);
  if (!Number.isFinite(basePort) || basePort <= 0) {
    return [5000, 5001, 5002, 5003];
  }

  return [basePort, basePort + 1, basePort + 2, basePort + 3];
};

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

const listConnectedAndroidDevices = () => {
  const adbBinary = getAndroidBinary(
    ['platform-tools', isWindows ? 'adb.exe' : 'adb'],
    isWindows ? 'adb.exe' : 'adb'
  );

  const result = spawnSync(adbBinary, ['devices'], getSpawnSyncOptions());
  if (result.error || result.status !== 0 || typeof result.stdout !== 'string') {
    return [];
  }

  return result.stdout
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter((line) => line && !line.startsWith('List of devices attached'))
    .map((line) => line.split(/\s+/))
    .filter((parts) => parts[0] && parts[1] === 'device')
    .map((parts) => parts[0]);
};

const reverseAndroidPort = (port) => {
  const adbBinary = getAndroidBinary(
    ['platform-tools', isWindows ? 'adb.exe' : 'adb'],
    isWindows ? 'adb.exe' : 'adb'
  );

  const result = spawnSync(adbBinary, ['reverse', `tcp:${port}`, `tcp:${port}`], getSpawnSyncOptions());
  if (result.error || result.status !== 0) {
    const details = (result.stderr || result.error?.message || '').toString().trim();
    if (details) {
      console.warn(`[android] adb reverse tcp:${port} failed: ${details}`);
    } else {
      console.warn(`[android] adb reverse tcp:${port} failed.`);
    }
    return false;
  }

  return true;
};

const waitForAndroidDevice = () => {
  const adbBinary = getAndroidBinary(
    ['platform-tools', isWindows ? 'adb.exe' : 'adb'],
    isWindows ? 'adb.exe' : 'adb'
  );

  const result = spawnSync(adbBinary, ['wait-for-device'], {
    ...getSpawnSyncOptions(),
    timeout: 60000,
  });

  if (result.error || result.status !== 0) {
    return false;
  }

  return true;
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

const connectedDevices = !isWebRequested ? listConnectedAndroidDevices() : [];
const hasConnectedEmulator = connectedDevices.some((id) => id.startsWith('emulator-'));
const hasConnectedPhysicalDevice = connectedDevices.some((id) => !id.startsWith('emulator-'));
const shouldAutoUseLocalhostForAndroid =
  !isWebRequested &&
  !hasHostModeArg &&
  !hasConnectedPhysicalDevice &&
  (hasConnectedEmulator || shouldOpenAndroid);
const explicitlyRequestedLocalhost = cliArgs.includes('--localhost');
const wantsLocalhostForAndroid = explicitlyRequestedLocalhost || shouldAutoUseLocalhostForAndroid;
const explicitlyRequestedExpoPort = getFlagValue(cliArgs, '--port', '-p');
const expoPort = resolveExpoPort();
let useLocalhostForAndroid = wantsLocalhostForAndroid;

if (wantsLocalhostForAndroid) {
  const isDeviceReady = waitForAndroidDevice();
  if (!isDeviceReady && shouldAutoUseLocalhostForAndroid) {
    console.warn('[android] Emulator is not ready for adb reverse yet. Falling back to LAN mode.');
    useLocalhostForAndroid = false;
  }
}

if (useLocalhostForAndroid) {
  const expoPortReverseOk = reverseAndroidPort(expoPort);
  if (!expoPortReverseOk && shouldAutoUseLocalhostForAndroid) {
    console.warn('[android] Failed to map Metro port through adb reverse. Falling back to LAN mode.');
    useLocalhostForAndroid = false;
  } else {
    const apiPorts = resolveApiPorts();
    for (const port of apiPorts) {
      reverseAndroidPort(port);
    }
  }
}

if (useLocalhostForAndroid && shouldAutoUseLocalhostForAndroid) {
  console.log('[android] Emulator detected. Using localhost mode with adb reverse for reliable Metro connection.');
}

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
const baseExpoCliArgs =
  useLocalhostForAndroid && !explicitlyRequestedLocalhost ? ['--localhost', ...cliArgs] : cliArgs;
const MAX_EXPO_PORT_RETRIES = 4;

const startExpo = (port, attempt = 0) => {
  if (useLocalhostForAndroid) {
    reverseAndroidPort(port);
  }

  const args = explicitlyRequestedExpoPort
    ? [expoCli, 'start', ...baseExpoCliArgs]
    : [expoCli, 'start', '--port', String(port), ...baseExpoCliArgs];

  if (isInteractiveExpoSession) {
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

    return;
  }

  if (isTunnelRequested && attempt === 0) {
    console.warn(
      "[expo] Tunnel mode is running without an interactive terminal. If startup fails, install '@expo/ngrok@^4.1.0' globally first."
    );
  }

  const expoProcess = spawn(command, args, {
    env,
    stdio: ['inherit', 'pipe', 'pipe'],
  });

  let stdoutBuffer = '';
  let stderrBuffer = '';

  expoProcess.stdout.on('data', (data) => {
    const text = data.toString();
    stdoutBuffer += text;
    process.stdout.write(data);
  });

  expoProcess.stderr.on('data', (data) => {
    const text = data.toString();
    stderrBuffer += text;
    process.stderr.write(data);
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

    const canRetryWithNextPort =
      !explicitlyRequestedExpoPort &&
      attempt < MAX_EXPO_PORT_RETRIES &&
      code !== 0 &&
      /EADDRINUSE|address already in use|Port \d+ is being used by another process|Use port \d+ instead|Skipping dev server/i.test(
        `${stdoutBuffer}\n${stderrBuffer}`
      );

    if (canRetryWithNextPort) {
      const nextPort = port + 1;
      console.warn(`[expo] Port ${port} is in use. Retrying on port ${nextPort}...`);
      startExpo(nextPort, attempt + 1);
      return;
    }

    process.exit(code ?? 0);
  });
};

startExpo(expoPort);

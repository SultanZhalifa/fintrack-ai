/**
 * Versioned localStorage migration. Runs once on app start, idempotently.
 * Preserves any real user data from earlier versions; only adds/normalizes
 * structures the new schema needs. Never injects demo data.
 */
import { STORAGE_KEYS, SCHEMA_VERSION, DEFAULT_SETTINGS } from '../constants/config';
import { readStorage, writeStorage } from './storage';

/** Read the persisted meta, or null if this is a first run / pre-meta install. */
function readMeta() {
  return readStorage(STORAGE_KEYS.meta, null);
}

/**
 * Ensure storage matches the current schema. Returns the resolved settings.
 * - Fresh install: writes meta with DEFAULT_SETTINGS, marks not-onboarded.
 * - Pre-v2 install (has transactions but no meta): keeps data, adds meta.
 */
export function runMigrations() {
  const meta = readMeta();

  // Fresh install — no meta at all.
  if (meta == null) {
    const hadV1Data = readStorage(STORAGE_KEYS.transactions, null) != null;
    const settings = {
      ...DEFAULT_SETTINGS,
      // Existing v1 users have already used the app; don't force onboarding on them.
      onboarded: hadV1Data,
    };
    writeStorage(STORAGE_KEYS.meta, { schemaVersion: SCHEMA_VERSION, settings });
    return settings;
  }

  // Already current.
  if (meta.schemaVersion >= SCHEMA_VERSION) {
    return { ...DEFAULT_SETTINGS, ...(meta.settings || {}) };
  }

  // Future incremental upgrades would chain here (v2 -> v3, ...).
  const settings = { ...DEFAULT_SETTINGS, ...(meta.settings || {}) };
  writeStorage(STORAGE_KEYS.meta, { schemaVersion: SCHEMA_VERSION, settings });
  return settings;
}

/** Persist settings back into meta (keeps schemaVersion current). */
export function saveSettings(settings) {
  writeStorage(STORAGE_KEYS.meta, { schemaVersion: SCHEMA_VERSION, settings });
}

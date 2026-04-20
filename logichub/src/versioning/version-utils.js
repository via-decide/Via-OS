'use strict';

const SEMVER_REGEX = /^\d+\.\d+\.\d+(?:-[0-9a-z.-]+)?(?:\+[0-9a-z.-]+)?$/i;

function isValidSemver(version) {
  return SEMVER_REGEX.test(String(version || '').trim());
}

function compareVersions(a, b) {
  const [aCore] = String(a || '').split('-');
  const [bCore] = String(b || '').split('-');
  const [aMaj, aMin, aPatch] = aCore.split('.').map((v) => Number.parseInt(v, 10) || 0);
  const [bMaj, bMin, bPatch] = bCore.split('.').map((v) => Number.parseInt(v, 10) || 0);

  if (aMaj !== bMaj) return aMaj > bMaj ? 1 : -1;
  if (aMin !== bMin) return aMin > bMin ? 1 : -1;
  if (aPatch !== bPatch) return aPatch > bPatch ? 1 : -1;
  return 0;
}

function bumpVersion(version = '1.0.0', bumpType = 'patch') {
  const [core] = String(version).split('-');
  const [major, minor, patch] = core.split('.').map((v) => Number.parseInt(v, 10) || 0);

  if (bumpType === 'major') return `${major + 1}.0.0`;
  if (bumpType === 'minor') return `${major}.${minor + 1}.0`;
  return `${major}.${minor}.${patch + 1}`;
}

module.exports = {
  isValidSemver,
  compareVersions,
  bumpVersion
};

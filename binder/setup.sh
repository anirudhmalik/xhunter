#!/usr/bin/env bash
# Verifies java + all bundled binder assets (xhunter-dist/binder).
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
cd "$SCRIPT_DIR"

# XHUNTER — colors in this script only (NO_COLOR=1 or non-TTY → plain; BINDER_XH_FORCE_COLOR=1 to force)
if [[ -n "${BINDER_XH_FORCE_COLOR:-}" ]] || { [[ -t 1 ]] && [[ -t 2 ]] && [[ -z "${NO_COLOR:-}" ]]; }; then
  _R=$'\033[0m' _B=$'\033[1m' _D=$'\033[2m' _E=$'\033[1;31m' _G=$'\033[0;90m'
  _C=$'\033[1;36m' _M=$'\033[1;35m' _K=$'\033[1;32m' _W=$'\033[1;33m'
else
  _R= _B= _D= _E= _G= _C= _M= _K= _W=
fi

_xh_setup_banner() {
  echo "${_B}${_C}XHUNTER${_R} ${_M}Setup${_R}"
  echo "${_D}Check Java and bundled assets before running the binder.${_R}"
}
_xh_info()  { echo "${_G}setup${_R}  $*"; }
_xh_err()   { echo "${_E}setup: $*${_R}" >&2; }
_xh_warn()  { echo "${_W}setup: $*${_R}" >&2; }

err() { _xh_err "$*"; exit 1; }
info() { _xh_info "$*"; }

echo ""
_xh_setup_banner
echo ""

command -v java >/dev/null 2>&1 || err "java not on PATH. Install a JDK (17+ recommended; see README)."

if ! _java_version_out="$(java -version 2>&1)"; then
  err "java is on PATH but a runtime is not available. Install a JDK (17+ recommended; see README). Output: ${_java_version_out}"
fi
IFS=$'\n' read -r _java_version_first_line _rest <<<"$_java_version_out"
unset _rest
info "${_B}java${_R} ${_D}${_java_version_first_line}${_R}"

# Prefer JDK 17+ (picocli + binder-cli); 11+ often works; warn if very old
if [[ ! "$_java_version_first_line" =~ version\ \"1[7-9]\.|version\ \"[2-9][0-9] ]]; then
  if [[ ! "$_java_version_first_line" =~ version\ \"1[1-6]\. ]]; then
    :
  else
    _xh_warn "JDK 11–16; xhunter monorepo docs recommend 17+."
  fi
fi
unset _java_version_out _java_version_first_line

[[ -f lib/binder-cli.jar ]] || err "Missing lib/binder-cli.jar in $SCRIPT_DIR (build with xhunter: ./gradlew :binder-cli:fatJar and copy the jar to lib/ here)."

[[ -f vendor/apktool/apktool_3.0.2.jar ]] || err "Missing vendor/apktool/apktool_3.0.2.jar (download from Apktool releases or copy from xhunter/binder-cli/vendor)."

[[ -f vendor/client/xhunter_client_merge.apk ]] || err "Missing vendor/client/xhunter_client_merge.apk (build :client:assembleRelease in xhunter repo, then copy the merge apk)."

[[ -f vendor/client/xhunter_signing_key.pk8 ]] || err "Missing vendor/client/xhunter_signing_key.pk8"
[[ -f vendor/client/xhunter_signing_cert.pem ]] || err "Missing vendor/client/xhunter_signing_cert.pem"

[[ -f config.txt ]] || err "Missing config.txt in $SCRIPT_DIR (should ship with the binder folder; set HOST and HOST_APK inside)."

info "${_K}OK —${_R} all required files are present under ${_D}$SCRIPT_DIR${_R}"
info "1) Edit ${_B}config.txt${_R}  (required: ${_B}HOST${_R}, ${_B}HOST_APK${_R})"
info "2) Run ${_B}./binder.sh${_R}  — Bash (Terminal / Git Bash / WSL); TTY required for hook menu"
echo ""

#!/usr/bin/env bash
# Run xhunter binder (fat JAR) from xhunter-dist/binder. Needs interactive TTY for hook selection.
# Prereq: ./setup.sh  and  config.txt (edit HOST and HOST_APK in that file)
set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
BINDER_DIR="$SCRIPT_DIR"

# XHUNTER Binder — colors in this script only (NO_COLOR=1 or non-TTY → plain)
if [[ -n "${BINDER_XH_FORCE_COLOR:-}" ]] || { [[ -t 1 ]] && [[ -t 2 ]] && [[ -z "${NO_COLOR:-}" ]]; }; then
  _R=$'\033[0m' _B=$'\033[1m' _D=$'\033[2m' _E=$'\033[1;31m' _G=$'\033[0;90m'
  _C=$'\033[1;36m' _M=$'\033[1;35m'
else
  _R= _B= _D= _E= _G= _C= _M=
fi
_xh_banner() {
  echo "${_B}${_C}XHUNTER${_R} ${_M}Binder${_R}"
  echo "${_D}Host APK + client merge · set HOST / HOST_APK in config.txt${_R}"
}
_xh_log() { echo "${_G}binder${_R} $*"; }
_xh_err() { echo "${_E}$*${_R}" >&2; }

JAR="$BINDER_DIR/lib/binder-cli.jar"

# Defaults; overridden by config.txt
OUT_APK="$BINDER_DIR/out/xhunter-merged.apk"
WORK_DIR=""
SIGN_KEY=""
SIGN_CERT=""
JAVA_EXE=""
FRAMEWORK_DIR=""
AAPT2=""
INJECT_PERMISSIONS="false"
MIN_SDK="24"
KEEP_WORK="false"
HOOK_LIST_MAX="20"
HOST_APK=""

CONFIG_FILE="$BINDER_DIR/config.txt"
if [[ ! -f "$CONFIG_FILE" ]]; then
  _xh_err "Missing $CONFIG_FILE"
  _xh_err "  Add config.txt in $BINDER_DIR (see repo; set HOST and HOST_APK at least)."
  exit 1
fi
set -a
# shellcheck source=/dev/null
source "$CONFIG_FILE"
set +a

if [[ -z "${HOST:-}" ]]; then
  _xh_err "Set HOST in $CONFIG_FILE"
  exit 1
fi

if [[ -z "${HOST_APK:-}" ]]; then
  _xh_err "Set HOST_APK in $CONFIG_FILE"
  exit 1
fi

# Relative paths in config are relative to this binder directory, not the caller’s cwd
if [[ "$HOST_APK" != /* ]]; then
  HOST_APK="$BINDER_DIR/$HOST_APK"
fi
if [[ -f "$HOST_APK" ]]; then
  HOST_APK="$(cd "$(dirname -- "$HOST_APK")" && pwd -P)/$(basename -- "$HOST_APK")"
fi

if [[ ! -f "$JAR" ]]; then
  _xh_err "Missing $JAR — run ./setup.sh; put the binder-cli fat jar at lib/binder-cli.jar"
  exit 1
fi
if [[ ! -f "$HOST_APK" ]]; then
  _xh_err "Host APK not found: $HOST_APK"
  _xh_err "  Set HOST_APK in $CONFIG_FILE to a real path (relative paths resolve from the binder directory)."
  exit 1
fi
if [[ ! -t 0 ]] || [[ ! -t 1 ]]; then
  _xh_err "Needs an interactive terminal (hook activity menu)."
  exit 1
fi

mkdir -p "$(dirname "$OUT_APK")"

cd "$BINDER_DIR"

echo ""
_xh_banner
echo ""
_xh_log "gateway ${_B}${HOST}${_R}  ·  host ${_B}${HOST_APK##*/}${_R}  ·  out ${_B}$(basename "$OUT_APK")${_R}"

if [[ -n "$WORK_DIR" ]]; then
  _xh_log "Apktool workspace: ${_D}${WORK_DIR}${_R}"
elif [[ "$KEEP_WORK" == "true" ]]; then
  _xh_log "Apktool: temp dir, kept if successful (${_B}--keep-work${_R})"
fi
echo ""

args=(
  -jar "$JAR"
  --host "$HOST_APK"
  --out "$OUT_APK"
  --gateway "$HOST"
  --min-sdk "$MIN_SDK"
)

if [[ "$INJECT_PERMISSIONS" == "true" ]]; then
  args+=(--inject-permissions)
fi
if [[ "$KEEP_WORK" == "true" ]]; then
  args+=(--keep-work)
fi
# Bundled client + apktool (vendor layout next to this script)
args+=(
  --client "$BINDER_DIR/vendor/client/xhunter_client_merge.apk"
  --apktool-jar "$BINDER_DIR/vendor/apktool/apktool_3.0.2.jar"
)
if [[ -z "$SIGN_KEY" ]]; then
  args+=(--sign-key "$BINDER_DIR/vendor/client/xhunter_signing_key.pk8")
else
  args+=(--sign-key "$SIGN_KEY")
fi
if [[ -z "$SIGN_CERT" ]]; then
  args+=(--sign-cert "$BINDER_DIR/vendor/client/xhunter_signing_cert.pem")
else
  args+=(--sign-cert "$SIGN_CERT")
fi
if [[ -n "$WORK_DIR" ]]; then args+=(--work "$WORK_DIR"); fi
if [[ -n "$JAVA_EXE" ]]; then args+=(--java "$JAVA_EXE"); fi
if [[ -n "$FRAMEWORK_DIR" ]]; then args+=(--framework-dir "$FRAMEWORK_DIR"); fi
if [[ -n "$AAPT2" ]]; then args+=(--aapt2 "$AAPT2"); fi
if [[ -n "$HOOK_LIST_MAX" ]]; then args+=(--hook-list-max "$HOOK_LIST_MAX"); fi

exec java "${args[@]}"

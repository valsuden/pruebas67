// =============================================================================
// CONFIGURACIÓN GLOBAL
// =============================================================================

const CONFIG = {
    // 1. URL API GOOGLE APPS SCRIPT
    API_URL: "https://script.google.com/macros/s/AKfycbxPdMN-iYGaD_ueL5lW5Ca0mCzXe4Dmzm1SjVxgnDskrm_GlPI_DZErIid40xpNxbLHOg/exec",

    // ⚠️ ATENCIÓN: NO CAMBIAR ESTA URL DE NOTAS. ES UNA FUNCIÓN INTER-GOOGLE UNIVERSAL PARA TODOS LOS GRADOS DEL COLEGIO.
    NOTES_API_URL: "https://script.google.com/macros/s/AKfycbyWlTNNSM0SjaZlwtXD8xJzYYYoIk1rQ0CfepNr29rNjxs6_8bu73dxHbYCtNgs5rs2/exec",

    SECURITY_SALT_COINS: "ArcaneMastery2026_X",
    SECURITY_SALT_STORAGE: "tom_secure_salt_2026_X",
    SECURITY_SALT_API: "trialsofmastery2025",

    ADMIN_PASSWORD_HASH: "92115aa11c4ebbd8547544c0d18015d06f5787e79e89936805cb110403725f7e"
};

window.CONFIG = CONFIG;
console.log("⚙️ Configuración global cargada.");

<?php
/**
 * BongBangla Media Vault - File Upload API
 * 
 * Install location: vault.bongbangla.top/upload.php
 * (Place this file in Hostinger public_html of vault.bongbangla.top)
 * 
 * Usage: POST multipart/form-data to https://vault.bongbangla.top/upload.php
 *   - file: The file to upload
 *   - folder: Subfolder (models / reels / hero / thumbnails)
 *   - password: API secret key (must match $API_SECRET below)
 */

// =============================================
// CONFIGURATION - Change these values
// =============================================
$API_SECRET   = 'Aktmtbar@1mzs';   // Must match vault-config.js DEFAULT_VAULT_PASS
$ALLOWED_USER = 'model@bongbangla.top';
$UPLOAD_DIR   = __DIR__ . '/media'; // Files saved to vault.bongbangla.top/media/
$BASE_URL     = 'https://vault.bongbangla.top/media';
$MAX_SIZE_MB  = 100;                // Max file size in MB

// =============================================
// CORS - Allow requests from bongbangla.top
// =============================================
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: POST, OPTIONS');
header('Access-Control-Allow-Headers: Authorization, X-Vault-User, Content-Type, X-Requested-With');
header('Content-Type: application/json; charset=utf-8');

// Handle preflight OPTIONS request
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

// =============================================
// Only allow POST requests
// =============================================
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    http_response_code(405);
    echo json_encode(['error' => 'Method not allowed. Use POST.']);
    exit();
}

// =============================================
// Authentication Check
// =============================================
$authenticated = false;

// Check Basic Auth header
$authHeader = '';
if (isset($_SERVER['HTTP_AUTHORIZATION'])) {
    $authHeader = $_SERVER['HTTP_AUTHORIZATION'];
} elseif (isset($_SERVER['REDIRECT_HTTP_AUTHORIZATION'])) {
    $authHeader = $_SERVER['REDIRECT_HTTP_AUTHORIZATION'];
}

if (!empty($authHeader) && strpos($authHeader, 'Basic ') === 0) {
    $encoded = substr($authHeader, 6);
    $decoded = base64_decode($encoded);
    list($user, $pass) = explode(':', $decoded, 2);
    if ($pass === $API_SECRET) {
        $authenticated = true;
    }
}

// Also check form field password (fallback)
if (!$authenticated) {
    $formPass = isset($_POST['password']) ? $_POST['password'] : '';
    if ($formPass === $API_SECRET || $formPass === 'Aktmtbar@1') {
        $authenticated = true;
    }
}

if (!$authenticated) {
    http_response_code(401);
    echo json_encode(['error' => 'Unauthorized. Invalid credentials.']);
    exit();
}

// =============================================
// File Validation
// =============================================
if (!isset($_FILES['file']) || $_FILES['file']['error'] !== UPLOAD_ERR_OK) {
    $errMsg = isset($_FILES['file']) ? 'Upload error code: ' . $_FILES['file']['error'] : 'No file provided';
    http_response_code(400);
    echo json_encode(['error' => $errMsg]);
    exit();
}

$file     = $_FILES['file'];
$origName = $file['name'];
$tmpPath  = $file['tmp_name'];
$fileSize = $file['size'];
$mimeType = $file['type'];

// Size check
$maxBytes = $MAX_SIZE_MB * 1024 * 1024;
if ($fileSize > $maxBytes) {
    http_response_code(413);
    echo json_encode(['error' => "File too large. Max size: {$MAX_SIZE_MB}MB"]);
    exit();
}

// Allowed MIME types
$allowedMimes = [
    'image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/gif',
    'video/mp4', 'video/webm', 'video/quicktime', 'video/x-msvideo',
    'video/mpeg', 'video/3gpp', 'video/x-ms-wmv',
    'image/svg+xml', 'application/octet-stream'
];

// Detect MIME from file content for safety
$finfo = finfo_open(FILEINFO_MIME_TYPE);
$detectedMime = finfo_file($finfo, $tmpPath);
finfo_close($finfo);

// Allow if either reported or detected MIME is valid
if (!in_array($mimeType, $allowedMimes) && !in_array($detectedMime, $allowedMimes)) {
    // Only block if both say it's not an image/video
    if (strpos($detectedMime, 'image/') === false && strpos($detectedMime, 'video/') === false) {
        http_response_code(415);
        echo json_encode(['error' => "File type not allowed: $detectedMime"]);
        exit();
    }
}

// =============================================
// Determine Folder & Build File Path
// =============================================
$folder = isset($_POST['folder']) ? preg_replace('/[^a-zA-Z0-9_\-]/', '', $_POST['folder']) : 'uploads';
if (empty($folder)) $folder = 'uploads';

// Sanitize filename
$ext = strtolower(pathinfo($origName, PATHINFO_EXTENSION));
if (empty($ext)) {
    // Guess extension from MIME
    $mimeExt = [
        'image/jpeg' => 'jpg', 'image/png' => 'png', 'image/webp' => 'webp',
        'image/gif' => 'gif', 'video/mp4' => 'mp4', 'video/webm' => 'webm',
        'video/quicktime' => 'mov',
    ];
    $ext = $mimeExt[$detectedMime] ?? 'bin';
}

// Generate unique filename: timestamp_originalname.ext
$baseName = pathinfo($origName, PATHINFO_FILENAME);
$cleanBase = preg_replace('/[^a-zA-Z0-9_\-]/', '_', $baseName);
$cleanBase = substr($cleanBase, 0, 60); // Limit length
$uniqueFilename = time() . '_' . $cleanBase . '.' . $ext;

// Create folder if it doesn't exist
$targetDir = $UPLOAD_DIR . '/' . $folder;
if (!is_dir($targetDir)) {
    if (!mkdir($targetDir, 0755, true)) {
        http_response_code(500);
        echo json_encode(['error' => 'Failed to create upload directory']);
        exit();
    }
}

$targetPath = $targetDir . '/' . $uniqueFilename;

// =============================================
// Move File to Server
// =============================================
if (!move_uploaded_file($tmpPath, $targetPath)) {
    http_response_code(500);
    echo json_encode(['error' => 'Failed to save file to server']);
    exit();
}

// Set proper permissions
chmod($targetPath, 0644);

// =============================================
// Return Success Response
// =============================================
$publicUrl = $BASE_URL . '/' . $folder . '/' . $uniqueFilename;

echo json_encode([
    'success'  => true,
    'url'      => $publicUrl,
    'filename' => $uniqueFilename,
    'folder'   => $folder,
    'size'     => $fileSize,
    'type'     => $detectedMime,
    'storage'  => 'vault'
]);

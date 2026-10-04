const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/webp", "image/avif"];

const MAX_FILE_SIZE = 20 * 1024 * 1024; // 20 MB

export function validateImage(file) {
  if (!ALLOWED_TYPES.includes(file.type)) {
    return {
      valid: false,
      error: `${file.name} is not a supported image format.`,
    };
  }

  if (file.size > MAX_FILE_SIZE) {
    return {
      valid: false,
      error: `${file.name} is larger than 20 MB.`,
    };
  }

  return {
    valid: true,
    error: null,
  };
}

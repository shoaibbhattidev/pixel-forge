import ExifReader from "exifreader";

export async function readMetadata(file) {
  try {
    const tags = await ExifReader.load(file);

    return tags;
  } catch (error) {
    console.error("Failed to read metadata:", error);
    return {};
  }
}

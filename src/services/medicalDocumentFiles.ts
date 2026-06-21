import { Directory, File, Paths } from "expo-file-system";
import { Platform } from "react-native";
import { createUid } from "@dog-care/core/utils";

export function persistMedicalDocumentImages(sourceUris: string[]) {
  if (Platform.OS === "web") return sourceUris;
  const documentsDirectory = getDocumentsDirectory();
  ensureDocumentsDirectory(documentsDirectory);
  const savedUris: string[] = [];

  try {
    for (const uri of sourceUris) {
      const source = new File(uri);
      const extension = source.extension || ".jpg";
      const destination = new File(documentsDirectory, `${createUid()}${extension}`);
      source.copy(destination);
      savedUris.push(destination.uri);
    }
    return savedUris;
  } catch (error) {
    deleteMedicalDocumentImages(savedUris);
    throw error;
  }
}

export function deleteMedicalDocumentImages(uris: string[]) {
  if (Platform.OS === "web") return;
  const documentsDirectory = getDocumentsDirectory();
  for (const uri of uris) {
    if (!uri.startsWith(documentsDirectory.uri)) continue;
    try {
      const file = new File(uri);
      if (file.exists) file.delete();
    } catch {
      // The journal entry can still be removed if a file was already unavailable.
    }
  }
}

function ensureDocumentsDirectory(documentsDirectory: Directory) {
  if (!documentsDirectory.exists) {
    documentsDirectory.create({ intermediates: true, idempotent: true });
  }
}

function getDocumentsDirectory() {
  return new Directory(Paths.document, "medical-documents");
}

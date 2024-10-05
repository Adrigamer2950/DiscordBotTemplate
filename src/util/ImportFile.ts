export async function importFile(filePath: string) {
    return new (await import(filePath)).default();
}
import { Router, type IRouter, type Request, type Response } from "express";
import { ObjectStorageService } from "../lib/objectStorage";

const router: IRouter = Router();
const objectStorageService = new ObjectStorageService();

/**
 * GET /storage-test
 *
 * Diagnostic endpoint: resolves wellcast-logo.png from App Storage
 * and returns the public URL format for use in frontend code.
 */
router.get("/storage-test", async (req: Request, res: Response) => {
  const searchPaths = objectStorageService.getPublicObjectSearchPaths();
  const filesToTry = [
    "Logos/wellcast-logo.png",
    "Logos/favicon.png",
    "wellcast-logo.png",
  ];

  const results: Record<string, { found: boolean; publicUrl: string }> = {};

  for (const filePath of filesToTry) {
    const file = await objectStorageService.searchPublicObject(filePath).catch(() => null);
    results[filePath] = {
      found: !!file,
      publicUrl: `/api/storage/public-objects/${filePath}`,
    };
  }

  res.json({
    searchPaths,
    files: results,
    urlFormat: {
      pattern: "/api/storage/public-objects/<path-relative-to-public-folder>",
      examples: {
        logoInLogosFolder: "/api/storage/public-objects/Logos/wellcast-logo.png",
        faviconInLogosFolder: "/api/storage/public-objects/Logos/favicon.png",
        fileAtRoot: "/api/storage/public-objects/filename.png",
      },
    },
  });
});

export default router;

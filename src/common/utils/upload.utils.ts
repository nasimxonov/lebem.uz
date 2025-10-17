import { diskStorage } from 'multer';
import { extname } from 'path';
import { v4 as uuid } from 'uuid';

export const createMulterOptions = (destination: string, withLimits = false, maxFileSize = 100 * 1024 * 1024) => {
  const opts: any = {
    storage: diskStorage({
      destination,
      filename: (req, file, callback) => {
        const uniqueName = uuid() + extname(file.originalname);
        callback(null, uniqueName);
      },
    }),
  };

  if (withLimits) {
    opts.limits = { fileSize: maxFileSize };
  }

  return opts;
};

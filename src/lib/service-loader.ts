import fs from 'node:fs';
import path from 'node:path';
import { ServiceInformation } from '../types/helper';
import { EXTENSION } from '../utils/constant';
import { tsModule } from '../utils/module';

export function getServicesPaths() {
  const rootPath = tsModule.getRootPath();
  const { servicePaths } = tsModule.getConfig();

  return servicePaths.map((p) => path.join(rootPath, p));
}

export function readServiceDir(dirPath: string) {
  const infos = fs.readdirSync(dirPath);

  return infos.map((info) => {
    let finalPath = path.join(dirPath, info);

    if (info.match(EXTENSION)) {
      return finalPath;
    }

    if (fs.existsSync(path.join(finalPath, 'index.ts'))) {
      finalPath = path.join(finalPath, 'index.ts');
    } else {
      finalPath = path.join(finalPath, 'index.js');
    }

    return finalPath;
  });
}

export function getServiceInformation(
  servicePath: string
): ServiceInformation | null {
  try {
    const relativePath = path.relative(
      tsModule.getOutputPath(),
      path.dirname(servicePath)
    );
    let fileName = '';

    if (fs.lstatSync(servicePath).isDirectory()) {
      fileName = path.basename(servicePath);
    } else {
      fileName = path.basename(path.join(servicePath, '..'));
    }

    fileName = fileName.replace(/\.|-/g, '_');

    return {
      importPath: relativePath,
      fileName,
    };
  } catch (err) {
    tsModule.logger(`Failed to load service: ${servicePath}`);
    tsModule.logger((err as Error)?.message);

    return null;
  }
}

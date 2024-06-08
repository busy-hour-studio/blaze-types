import ts from 'typescript/lib/tsserverlibrary';
import chokidar from 'chokidar';
import { tsModule } from '../utils/module';
import { getServicesPaths } from './service-loader';
import { writeDefinition } from './writer';

export function createPlugin(info: ts.server.PluginCreateInfo) {
  tsModule.setTsInfo(info);
  tsModule.setRootPath(info.project.getCurrentDirectory());
  tsModule.setConfig(info.config);

  const services = getServicesPaths();

  tsModule.logger(`Starting up plugin!`);
  tsModule.logger(`Watching on: ${services.join(', ')}`);

  for (const service of services) {
    const watcher = chokidar.watch(service);

    watcher.on('all', (evtName) => {
      switch (evtName) {
        case 'add':
          tsModule.logger(`New service added!`);
          break;

        case 'change':
          tsModule.logger(`Current service modified!`);
          break;

        case 'unlink':
        case 'unlinkDir':
        default:
          tsModule.logger(`Current service deleted!`);
          break;
      }

      writeDefinition();
    });
  }

  return info.languageService;
}

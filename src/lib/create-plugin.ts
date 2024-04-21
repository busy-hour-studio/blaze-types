import ts from 'typescript/lib/tsserverlibrary';
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

  services.forEach((service) => {
    info.serverHost.watchFile(service, (_, eventKind) => {
      switch (eventKind) {
        case ts.FileWatcherEventKind.Created:
          tsModule.logger(`New service added!`);
          break;
        case ts.FileWatcherEventKind.Changed:
          tsModule.logger(`Current service modified!`);
          break;

        case ts.FileWatcherEventKind.Deleted:
        default:
          tsModule.logger(`Current service deleted!`);
          break;
      }
    });

    writeDefinition();
  });

  return info.languageService;
}

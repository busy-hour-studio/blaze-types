import ts from 'typescript/lib/tsserverlibrary';
import { tsModule } from './utils/module';
import type { CreatePlugin } from './types/helper';

function init(modules: CreatePlugin) {
  tsModule.setModule(modules.typescript);

  return {
    create(info: ts.server.PluginCreateInfo) {
      return info.languageService;
    },
  };
}

export = init;

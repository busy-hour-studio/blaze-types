import { tsModule } from './utils/module';
import { createPlugin } from './lib/create-plugin';
import type { CreatePlugin } from './types/helper';

function init(modules: CreatePlugin) {
  tsModule.setModule(modules.typescript);

  return {
    create: createPlugin,
  };
}

export = init;

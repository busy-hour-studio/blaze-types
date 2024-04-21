import path from 'node:path';
import type tss from 'typescript/lib/tsserverlibrary';
import type { PluginConfig } from '../types/helper';

class TsModule {
  private $ts: typeof tss | null;
  private $tsInfo: tss.server.PluginCreateInfo | null;
  private $rootPath: string | null;
  private $config: PluginConfig | null;
  private $outputPath: string | null;

  constructor() {
    this.$ts = null;
    this.$tsInfo = null;
    this.$rootPath = null;
    this.$config = null;
    this.$outputPath = null;
  }

  public setModule(typescript: typeof tss) {
    this.$ts = typescript;
  }

  public getModule() {
    if (!this.$ts) {
      throw new Error('[Blaze Types]: ts module is not set');
    }

    return this.$ts;
  }

  public setTsInfo(info: tss.server.PluginCreateInfo) {
    this.$tsInfo = info;
  }

  public getTsInfo() {
    if (!this.$tsInfo) {
      throw new Error('[Blaze Types]: ts info is not set');
    }

    return this.$tsInfo;
  }

  public setRootPath(rootPath: string) {
    this.$rootPath = rootPath;
  }

  public getRootPath() {
    if (!this.$rootPath) {
      throw new Error('[Blaze Types]: root path is not set');
    }

    return this.$rootPath;
  }

  public setConfig(config: PluginConfig) {
    this.$config = config;
    this.$outputPath = path.join(this.getRootPath(), config.outputPath);
  }

  public getConfig() {
    if (!this.$config) {
      throw new Error('[Blaze Types]: config is not set');
    }

    return this.$config;
  }

  public getOutputPath() {
    if (!this.$outputPath) {
      throw new Error('[Blaze Types]: output path is not set');
    }

    return this.$outputPath;
  }

  public logger(msg: string) {
    const tsInfo = this.getTsInfo();

    tsInfo.project.projectService.logger.info(`[Blaze Types]: ${msg}`);
  }
}

export const tsModule = new TsModule();

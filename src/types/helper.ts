import type ts from 'typescript/lib/tsserverlibrary';

export type {
  Random,
  RecordString,
  RecordUnknown,
} from '@busy-hour/blaze/dist/types/types/common';

export type TsServer = typeof ts;

export interface CreatePlugin {
  typescript: TsServer;
}

export interface PluginConfig {
  servicePaths: string[];
  outputPath: string;
}

export interface ServiceInformation {
  importPath: string;
  fileName: string;
}

export interface ServiceDefinition {
  action: string;
  event: string;
  import: string;
  trpcQuery: string;
  trpcMutation: string;
}

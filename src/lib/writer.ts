import fs from 'node:fs';
import path from 'node:path';
import {
  getServiceInformation,
  getServicesPaths,
  readServiceDir,
} from './service-loader';
import { ServiceDefinition, ServiceInformation } from '../types/helper';
import { tsModule } from '../utils/module';
import { DISCLAIMER, IMPORTS } from '../utils/constant';

function buildDefinition(info: ServiceInformation): ServiceDefinition {
  const action = `
    ActionsExtractor<typeof ${info.fileName}>`;
  const event = `
    EventsExtractor<typeof ${info.fileName}>`;
  const imports = `import ${info.fileName} from '${info.importPath}';`;
  const trpcQuery = `
    TrpcQueryExtractor<typeof ${info.fileName}>`;
  const trpcMutation = `
    TrpcMutationExtractor<typeof ${info.fileName}>`;

  return {
    action,
    event,
    trpcQuery,
    trpcMutation,
    import: imports,
  };
}

function generateDefinition(definitions: ServiceDefinition[]) {
  const isShouldExtend = definitions.length > 0;
  const imports = [...IMPORTS];
  const actions = isShouldExtend
    ? `export interface ActionCallRecord extends ${definitions.map((def) => def.action).join(',')} {}`
    : `export interface ActionCallRecord {}`;
  const events = isShouldExtend
    ? `export interface EventCallRecord extends ${definitions.map((def) => def.event).join(',')} {}`
    : `export interface EventCallRecord {}`;
  const trpcQuery = isShouldExtend
    ? `export interface TrpcQueryCallRecord extends ${definitions.map((def) => def.trpcQuery).join(',')} {}`
    : '';
  const trpcMutation = isShouldExtend
    ? `export interface TrpcMutationCallRecord extends ${definitions.map((def) => def.trpcMutation).join(',')} {}`
    : '';

  if (isShouldExtend) {
    imports.push(...definitions.map((def) => def.import));
  }

  return `${DISCLAIMER}
/* eslint-disable */

${imports.join('\n')}

declare module '@busy-hour/blaze' {
  ${actions}

  ${events}

  ${tsModule.getConfig().withTrpc ? trpcQuery : ''}

  ${tsModule.getConfig().withTrpc ? trpcMutation : ''}
}
`;
}

export function writeDefinition() {
  const services = getServicesPaths().map(readServiceDir).flat(1);
  const servicesInfo = services
    .map(getServiceInformation)
    .filter(Boolean) as unknown as ServiceInformation[];
  const definitions = servicesInfo.map(buildDefinition);
  const filePath = path.join(tsModule.getOutputPath(), 'blaze.d.ts');
  const content = generateDefinition(definitions);

  if (!fs.existsSync(tsModule.getOutputPath())) {
    fs.mkdirSync(tsModule.getOutputPath(), {
      recursive: true,
    });
  }

  return fs.writeFileSync(filePath, content, 'utf8');
}

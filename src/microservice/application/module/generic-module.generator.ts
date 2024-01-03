import {
  GenericModule,
  ModelEntityTokens
} from '@devseeder/nestjs-microservices-commons';
import { DynamicModule } from '@nestjs/common';

export interface GeneratorModuleOptions {
  authGuard;
  interceptor;
  configuration;
  modelTokens: ModelEntityTokens;
  projectKey: string;
  scopeKey: string;
}

export class GenericModuleGenerator {
  static generateModules(
    moduleOptions: GeneratorModuleOptions
  ): DynamicModule[] {
    const modules = [];
    const moduleKeys = Object.keys(moduleOptions.modelTokens);
    moduleKeys.forEach((key) => {
      const entityToken = moduleOptions.modelTokens[key];
      modules.push(
        GenericModule.forFeature({
          ...moduleOptions,
          entity: entityToken['entity'],
          modelName: entityToken['modelName'],
          customProvider: entityToken['customProvider']
        })
      );
    });
    return modules;
  }
}

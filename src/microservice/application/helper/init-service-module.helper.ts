import { Type } from '@nestjs/common';
import { AbstractDBService } from '../service/abstract/abstract-db.service';

export function importAsyncService(useClass: Type<any>) {
  const dependencies = getDependencies(useClass);

  return {
    provide: useClass,
    useFactory: async (...args: any[]) => {
      const instances = dependencies.map((dependency) =>
        args.find((arg) => arg instanceof dependency)
      );
      const instance: AbstractDBService<any, any, any, any> = new useClass(
        ...instances
      );
      await instance.init(); // Inicialização assíncrona
      return instance;
    },
    inject: [...dependencies]
  };
}

function getDependencies(serviceClass: Type<any>): Type<any>[] {
  const dependencies =
    Reflect.getMetadata('design:paramtypes', serviceClass) || [];
  return dependencies;
}

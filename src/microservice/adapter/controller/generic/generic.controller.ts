import {
  EnumScopes,
  SCOPE_KEY
} from 'src/microservice/domain/enum/enum-scopes.enum';

export function buildControllerScopes(
  entity: string,
  accessKey: string,
  user: boolean,
  allKey: string,
  extraScopes = []
): string[] {
  const scopes = [];
  if (user) scopes.push(EnumScopes.USER);
  scopes.push(
    `${SCOPE_KEY}/${entity.toUpperCase()}/${accessKey.toUpperCase()}`
  );
  scopes.push(
    `${SCOPE_KEY}/${entity.toUpperCase()}/${allKey.toUpperCase()}_ALL`
  );
  extraScopes.forEach((extra) => {
    scopes.push(`${SCOPE_KEY}/${extra.toUpperCase()}`);
  });

  if (entity === 'expenses' && accessKey == 'GET_BY_ID') {
    console.log(scopes);
  }

  return scopes;
}

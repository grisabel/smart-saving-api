import { ValidationChain, body, param } from 'express-validator';
import { required } from './RequiredFieldValidator';
import { equalFields } from './EqualFieldsValidator';
import { date } from './DateValidator';

const bindAll = <T>(object: T): { [K in keyof T]: T[K] } => {
  const protoKeys = Object.getOwnPropertyNames(
    Object.getPrototypeOf(object)
  ) as (keyof T)[];
  protoKeys.forEach((key) => {
    const maybeFn = object[key];
    if (typeof maybeFn === 'function' && key !== 'constructor') {
      object[key] = maybeFn.bind(object);
    }
  });

  return object;
};

type CustomValidationChain = ValidationChain & {
  required: () => CustomValidationChain;
  date: () => CustomValidationChain;
  equalFields: (
    otherFieldName: string,
    errorMsg: string
  ) => CustomValidationChain;
};

export function Body(fieldname: string): CustomValidationChain {
  const chain = body(fieldname);

  const api = {
    required: () => {
      return required(chain, fieldname);
    },
    date: () => {
      return chain.custom(date(fieldname));
    },
    equalFields: (otherFieldName, errorMsg) => {
      return chain.custom(equalFields(otherFieldName, errorMsg));
    },
  };

  const apiProxy = new Proxy(api, {
    get(target, prop) {
      const value = target[prop];

      if (value instanceof Function) {
        return function (...args) {
          const resul = value.apply(target, args);
          return Object.assign(resul, bindAll(target));
        };
      }
      return value;
    },
  });

  return Object.assign(
    chain,
    bindAll(apiProxy)
  ) as unknown as CustomValidationChain;
}

export function Param(fieldname: string): CustomValidationChain {
  const chain = param(fieldname);

  const api = {
    required: () => {
      return required(chain, fieldname);
    },
    date: () => {
      return chain.custom(date(fieldname));
    },
  };

  const apiProxy = new Proxy(api, {
    get(target, prop) {
      const value = target[prop];

      if (value instanceof Function) {
        return function (...args) {
          const resul = value.apply(target, args);
          return Object.assign(resul, bindAll(target));
        };
      }
      return value;
    },
  });

  return Object.assign(
    chain,
    bindAll(apiProxy)
  ) as unknown as CustomValidationChain;
}

// export function Body(fieldname: string): CustomValidationChain {
//   const chain = body(fieldname);
//   const api = {
//     required: () => {
//       const _chain = required(chain, fieldname);
//       return Object.assign(_chain, bindAll(api));
//     },
//     equalFields: (otherFieldName, errorMsg) => {
//       const _chain = chain.custom(equalFields(otherFieldName, errorMsg));
//       return Object.assign(_chain, bindAll(api));
//     },
//   };

//   return Object.assign(chain, bindAll(api));
// }

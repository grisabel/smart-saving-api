import { ValidationChain, body, param } from 'express-validator';
import { required } from './RequiredFieldValidator';
import { equalFields } from './EqualFieldsValidator';
import { date } from './DateValidator';
import { email } from './EmailValidator';
import { password } from './PasswordValidator';
import { id } from './IdValidator';
import { financialAccount } from './FinancialAccount';
import { concept } from './ConceptValidator';
import { DATE_FORMATS } from '@application/services/DateTimeService/constants';

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
  date: (config?: { format?: string }) => CustomValidationChain;
  email: () => CustomValidationChain;
  password: () => CustomValidationChain;
  financialAccount: () => CustomValidationChain;
  id: () => CustomValidationChain;
  concept: () => CustomValidationChain;
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
    date: (config = { format: DATE_FORMATS.Date }) => {
      return chain.custom(date(fieldname, config.format));
    },
    email: () => {
      return chain.custom(email());
    },
    password: () => {
      return chain.custom(password());
    },
    id: () => {
      return chain.custom(id());
    },
    financialAccount: () => {
      return chain.custom(financialAccount());
    },
    equalFields: (otherFieldName, errorMsg) => {
      return chain.custom(equalFields(otherFieldName, errorMsg));
    },
    concept: () => {
      return chain.custom(concept());
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
    date: ({ format = DATE_FORMATS.Date }) => {
      return chain.custom(date(fieldname, format));
    },
    email: () => {
      return chain.custom(email());
    },
    id: () => {
      return chain.custom(id());
    },
    password: () => {
      return chain.custom(password());
    },
    financialAccount: () => {
      return chain.custom(financialAccount());
    },
    concept: () => {
      return chain.custom(concept());
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

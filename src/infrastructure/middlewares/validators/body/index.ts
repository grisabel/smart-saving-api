import { ValidationChain, body, param, query } from 'express-validator';
import { required } from './RequiredFieldValidator';
import { equalFields } from './EqualFieldsValidator';
import { date, isDateEarlier } from './DateValidator';
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
  isDateEarlier: (
    otherFieldName: string,
    config?: { format?: string }
  ) => CustomValidationChain;
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

function ChainFactory(
  chain: ValidationChain,
  fieldname: string
): CustomValidationChain {
  const api = {
    required: () => {
      return required(chain, fieldname);
    },
    date: (config = { format: DATE_FORMATS.Date }) => {
      return chain.custom(date(fieldname, config.format));
    },
    isDateEarlier: (
      otherFieldName: string,
      config = { format: DATE_FORMATS.Date }
    ) => {
      return chain.custom(isDateEarlier(otherFieldName, config.format)); //todo
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
      return chain.custom(equalFields(otherFieldName, errorMsg)); //todo
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

export function Body(fieldname: string): CustomValidationChain {
  const chain = body(fieldname);

  return ChainFactory(chain, fieldname);
}

export function Param(fieldname: string): CustomValidationChain {
  const chain = param(fieldname);

  return ChainFactory(chain, fieldname);
}

export function Query(fieldname: string): CustomValidationChain {
  const chain = query(fieldname);

  return ChainFactory(chain, fieldname);
}

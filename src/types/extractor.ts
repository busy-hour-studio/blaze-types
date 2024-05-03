/* eslint-disable @typescript-eslint/ban-ts-comment */
import type {
  Action,
  Actions,
  ActionValidator,
  Event,
  Events,
  Service,
  z,
  ActionHook,
  AcceptedAfterHook,
} from '@busy-hour/blaze';
import type {
  Random,
  RecordString,
  RecordUnknown,
  ReturnTypeOfLastFunction,
} from './helper';

type AnyValidator = ActionValidator<
  z.ZodObject<z.ZodRawShape>,
  z.ZodObject<z.ZodRawShape>,
  z.ZodObject<z.ZodRawShape>
>;

type AnyAction = Action<Random, Random, Random, Random, Random>;

type AnyEvent = Event<RecordUnknown, Random>;

export type ExtractActionValidator<
  S extends Service,
  A extends keyof S['actions'],
  V extends keyof AnyValidator,
  D = V extends 'body'
    ? unknown
    : V extends 'headers'
      ? RecordString
      : RecordUnknown,
> =
  NonNullable<S['actions']> extends Actions
    ? NonNullable<S['actions']>[A] extends AnyAction
      ? NonNullable<
          NonNullable<NonNullable<S['actions']>[A]>['validator']
        > extends AnyValidator
        ? NonNullable<
            NonNullable<
              NonNullable<NonNullable<S['actions']>[A]>['validator']
            >[V]
          > extends z.ZodObject<z.ZodRawShape>
          ? z.infer<
              NonNullable<
                NonNullable<
                  NonNullable<NonNullable<S['actions']>[A]>['validator']
                >[V]
              >
            >
          : D
        : D
      : D
    : D;

export type ExtractActionHandler<
  S extends Service,
  A extends keyof S['actions'],
> =
  NonNullable<S['actions']> extends Actions
    ? NonNullable<S['actions']>[A] extends AnyAction
      ? NonNullable<
          NonNullable<NonNullable<S['actions']>[A]>['hooks']
        > extends ActionHook
        ? NonNullable<
            NonNullable<NonNullable<S['actions']>[A]>['hooks']
          >['after'] extends AcceptedAfterHook
          ? ReturnTypeOfLastFunction<
              NonNullable<
                NonNullable<NonNullable<S['actions']>[A]>['hooks']
              >['after']
            >
          : Awaited<
              ReturnType<NonNullable<NonNullable<S['actions']>[A]>['handler']>
            >
        : Awaited<
            ReturnType<NonNullable<NonNullable<S['actions']>[A]>['handler']>
          >
      : unknown
    : unknown;

export type ExtractEventValidator<
  S extends Service,
  E extends keyof S['events'],
> =
  NonNullable<S['events']> extends Events
    ? NonNullable<S['events']>[E] extends AnyEvent
      ? NonNullable<
          NonNullable<NonNullable<S['events']>[E]>['validator']
        > extends z.ZodObject<z.ZodRawShape>
        ? z.infer<
            NonNullable<NonNullable<NonNullable<S['events']>[E]>['validator']>
          >
        : unknown
      : unknown
    : unknown;

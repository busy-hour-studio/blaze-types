/* eslint-disable @typescript-eslint/ban-ts-comment */
import type {
  Actions,
  Events,
  Service,
  z,
  AnyAction,
  AnyEvent,
  AnyValidator,
  AnyActionHook,
  AnyAfterHook,
  AnyAfterHookHandler,
} from '@busy-hour/blaze';
import type { RecordString, RecordUnknown } from './helper';

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
          > extends
            | z.ZodObject<z.ZodRawShape>
            | z.ZodEffects<z.ZodObject<z.ZodRawShape>>
          ? z.input<
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
        > extends AnyActionHook
        ? NonNullable<
            NonNullable<
              NonNullable<NonNullable<S['actions']>[A]>['hooks']
            >['after']
          > extends AnyAfterHook
          ? NonNullable<
              NonNullable<
                NonNullable<NonNullable<S['actions']>[A]>['hooks']
              >['after']
            > extends Array<infer U>
            ? U extends AnyAfterHookHandler
              ? Awaited<ReturnType<U>>
              : Awaited<
                  ReturnType<
                    NonNullable<NonNullable<S['actions']>[A]>['handler']
                  >
                >
            : NonNullable<
                  NonNullable<
                    NonNullable<NonNullable<S['actions']>[A]>['hooks']
                  >['after']
                > extends AnyAfterHookHandler
              ? Awaited<
                  ReturnType<
                    NonNullable<
                      NonNullable<
                        NonNullable<NonNullable<S['actions']>[A]>['hooks']
                      >['after']
                    >
                  >
                >
              : Awaited<
                  ReturnType<
                    NonNullable<NonNullable<S['actions']>[A]>['handler']
                  >
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
        ? z.input<
            NonNullable<NonNullable<NonNullable<S['events']>[E]>['validator']>
          >
        : unknown
      : unknown
    : unknown;

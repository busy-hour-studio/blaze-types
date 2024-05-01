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
import type { Random, RecordUnknown, ReturnTypeOfLastFunction } from './helper';

type AnyAction = Action<RecordUnknown, Random, Random, Random>;

type AnyEvent = Event<RecordUnknown, Random>;

export type ExtractActionValidator<
  DefinedService extends Service,
  ActionName extends keyof DefinedService['actions'],
  ValidationName extends keyof ActionValidator,
  DefaultType = ValidationName extends 'body' ? unknown : RecordUnknown,
> =
  NonNullable<DefinedService['actions']> extends Actions
    ? NonNullable<DefinedService['actions'][ActionName]> extends AnyAction
      ? NonNullable<
          // @ts-ignore
          DefinedService['actions'][ActionName]['validator']
        > extends ActionValidator<Random, Random, Random>
        ? NonNullable<
            // @ts-ignore
            DefinedService['actions'][ActionName]['validator'][ValidationName]
          > extends z.ZodObject<z.ZodRawShape>
          ? z.infer<
              // @ts-ignore
              DefinedService['actions'][ActionName]['validator'][ValidationName]
            >
          : DefaultType
        : DefaultType
      : DefaultType
    : DefaultType;

export type ExtractActionHandler<
  DefinedService extends Service,
  ActionName extends keyof DefinedService['actions'],
> =
  NonNullable<DefinedService['actions']> extends Actions
    ? NonNullable<DefinedService['actions'][ActionName]> extends AnyAction
      ? // @ts-ignore
        DefinedService['actions'][ActionName]['hooks'] extends ActionHook
        ? NonNullable<
            // @ts-ignore
            DefinedService['actions'][ActionName]['hooks']['after']
          > extends AcceptedAfterHook
          ? ReturnTypeOfLastFunction<
              // @ts-ignore
              DefinedService['actions'][ActionName]['hooks']['after']
            >
          : Awaited<
              // @ts-ignore
              ReturnType<DefinedService['actions'][ActionName]['handler']>
            >
        : // @ts-ignore
          Awaited<ReturnType<DefinedService['actions'][ActionName]['handler']>>
      : unknown
    : unknown;

export type ExtractEventValidator<
  DefinedService extends Service,
  EventName extends keyof DefinedService['events'],
> =
  NonNullable<DefinedService['events']> extends Events
    ? NonNullable<DefinedService['events'][EventName]> extends AnyEvent
      ? NonNullable<
          // @ts-ignore
          DefinedService['events'][EventName]['validator']
        > extends z.ZodObject<z.ZodRawShape>
        ? z.infer<
            // @ts-ignore
            DefinedService['events'][EventName]['validator']
          >
        : unknown
      : unknown
    : unknown;

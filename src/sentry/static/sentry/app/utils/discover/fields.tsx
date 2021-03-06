import {assert} from 'app/types/utils';

export type Sort = {
  kind: 'asc' | 'desc';
  field: string;
};

// Contains the URL field value & the related table column width.
// Can be parsed into a Column using explodeField()
export type Field = {
  field: string;
  width?: number;
};

export type ColumnType =
  | 'boolean'
  | 'date'
  | 'duration'
  | 'integer'
  | 'number'
  | 'percentage'
  | 'string';

export type ColumnValueType = ColumnType | 'never'; // Matches to nothing

export type AggregateParameter =
  | {
      kind: 'column';
      columnTypes: Readonly<ColumnType[]>;
      defaultValue?: string;
      required: boolean;
    }
  | {
      kind: 'value';
      dataType: ColumnType;
      defaultValue?: string;
      required: boolean;
    };

export type AggregationRefinement = string | undefined;

// The parsed result of a Field.
// Functions and Fields are handled as subtypes to enable other
// code to work more simply.
// This type can be converted into a Field.field using generateFieldAsString()
export type Column =
  | {
      kind: 'field';
      field: string;
    }
  | {
      kind: 'function';
      function: [Aggregation, string, AggregationRefinement];
    };

// Refer to src/sentry/api/event_search.py
export const AGGREGATIONS = {
  count: {
    parameters: [],
    outputType: 'number',
    isSortable: true,
  },
  count_unique: {
    parameters: [
      {
        kind: 'column',
        columnTypes: ['string', 'integer', 'number', 'duration', 'date', 'boolean'],
        required: true,
      },
    ],
    outputType: 'number',
    isSortable: true,
  },
  min: {
    parameters: [
      {
        kind: 'column',
        columnTypes: ['integer', 'number', 'duration', 'date'],
        required: true,
      },
    ],
    outputType: null,
    isSortable: true,
  },
  max: {
    parameters: [
      {
        kind: 'column',
        columnTypes: ['integer', 'number', 'duration', 'date'],
        required: true,
      },
    ],
    outputType: null,
    isSortable: true,
  },
  avg: {
    parameters: [
      {
        kind: 'column',
        columnTypes: ['integer', 'number', 'duration'],
        required: true,
      },
    ],
    outputType: null,
    isSortable: true,
  },
  sum: {
    parameters: [
      {
        kind: 'column',
        columnTypes: ['integer', 'number', 'duration'],
        required: true,
      },
    ],
    outputType: null,
    isSortable: true,
  },
  last_seen: {
    parameters: [],
    outputType: 'date',
    isSortable: true,
  },

  // Tracing functions.
  p50: {
    parameters: [],
    outputType: 'duration',
    isSortable: true,
  },
  p75: {
    parameters: [],
    outputType: 'duration',
    isSortable: true,
  },
  p95: {
    parameters: [],
    outputType: 'duration',
    type: [],
    isSortable: true,
  },
  p99: {
    parameters: [],
    outputType: 'duration',
    isSortable: true,
  },
  p100: {
    parameters: [],
    outputType: 'duration',
    isSortable: true,
  },
  percentile: {
    parameters: [
      {
        kind: 'column',
        columnTypes: ['duration'],
        defaultValue: 'transaction.duration',
        required: true,
      },
      {
        kind: 'value',
        dataType: 'number',
        defaultValue: '0.5',
        required: true,
      },
    ],
    outputType: null,
    isSortable: true,
  },
  error_rate: {
    parameters: [],
    outputType: 'percentage',
    isSortable: true,
  },
  apdex: {
    parameters: [
      {
        kind: 'value',
        dataType: 'number',
        defaultValue: '300',
        required: true,
      },
    ],
    outputType: 'percentage',
    isSortable: true,
  },
  impact: {
    parameters: [
      {
        kind: 'value',
        dataType: 'number',
        defaultValue: '300',
        required: true,
      },
    ],
    outputType: 'number',
    isSortable: true,
  },
  user_misery: {
    parameters: [
      {
        kind: 'value',
        dataType: 'number',
        defaultValue: '300',
        required: true,
      },
    ],
    outputType: 'number',
    isSortable: true,
  },
  rps: {
    parameters: [],
    outputType: 'number',
    isSortable: true,
  },
  rpm: {
    parameters: [],
    outputType: 'number',
    isSortable: true,
  },
} as const;

assert(
  AGGREGATIONS as Readonly<
    {
      [key in keyof typeof AGGREGATIONS]: {
        parameters: Readonly<AggregateParameter[]>;
        // null means to inherit from the column.
        outputType: null | ColumnType;
        isSortable: boolean;
      };
    }
  >
);

export type Aggregation = keyof typeof AGGREGATIONS | '';

/**
 * Refer to src/sentry/snuba/events.py, search for Columns
 */
export const FIELDS = {
  id: 'string',
  // issue.id and project.id are omitted on purpose.
  // Customers should use `issue` and `project` instead.
  timestamp: 'date',
  time: 'date',

  culprit: 'string',
  location: 'string',
  message: 'string',
  'platform.name': 'string',
  environment: 'string',
  release: 'string',
  dist: 'string',
  title: 'string',
  'event.type': 'string',
  // tags.key and tags.value are omitted on purpose as well.

  transaction: 'string',
  user: 'string',
  'user.id': 'string',
  'user.email': 'string',
  'user.username': 'string',
  'user.ip': 'string',
  'sdk.name': 'string',
  'sdk.version': 'string',
  'http.method': 'string',
  'http.url': 'string',
  'os.build': 'string',
  'os.kernel_version': 'string',
  'device.name': 'string',
  'device.brand': 'string',
  'device.locale': 'string',
  'device.uuid': 'string',
  'device.arch': 'string',
  'device.battery_level': 'number',
  'device.orientation': 'string',
  'device.simulator': 'boolean',
  'device.online': 'boolean',
  'device.charging': 'boolean',
  'geo.country_code': 'string',
  'geo.region': 'string',
  'geo.city': 'string',
  'error.type': 'string',
  'error.value': 'string',
  'error.mechanism': 'string',
  'error.handled': 'boolean',
  'stack.abs_path': 'string',
  'stack.filename': 'string',
  'stack.package': 'string',
  'stack.module': 'string',
  'stack.function': 'string',
  'stack.in_app': 'boolean',
  'stack.colno': 'number',
  'stack.lineno': 'number',
  'stack.stack_level': 'number',
  // contexts.key and contexts.value omitted on purpose.

  // Transaction event fields.
  'transaction.duration': 'duration',
  'transaction.op': 'string',
  'transaction.status': 'string',

  trace: 'string',
  'trace.span': 'string',
  'trace.parent_span': 'string',

  // Field alises defined in src/sentry/api/event_search.py
  project: 'string',
  issue: 'string',
} as const;
assert(FIELDS as Readonly<{[key in keyof typeof FIELDS]: ColumnType}>);

export type Fields = keyof typeof FIELDS | string | '';

// This list should be removed with the tranaction-events feature flag.
export const TRACING_FIELDS = [
  'avg',
  'sum',
  'transaction.duration',
  'transaction.op',
  'transaction.status',
  'p50',
  'p75',
  'p95',
  'p99',
  'p100',
  'percentile',
  'error_rate',
  'apdex',
  'impact',
  'user_misery',
  'rps',
  'rpm',
];

const AGGREGATE_PATTERN = /^([^\(]+)\((.*?)(?:\s*,\s*(.*))?\)$/;

export function explodeFieldString(field: string): Column {
  const results = field.match(AGGREGATE_PATTERN);

  if (results && results.length >= 3) {
    return {
      kind: 'function',
      function: [
        results[1] as Aggregation,
        results[2],
        results[3] as AggregationRefinement,
      ],
    };
  }

  return {kind: 'field', field};
}

export function explodeField(field: Field): Column {
  const results = explodeFieldString(field.field);

  return results;
}

/**
 * Get the alias that the API results will have for a given aggregate function name
 */
export function getAggregateAlias(field: string): string {
  if (!field.match(AGGREGATE_PATTERN)) {
    return field;
  }
  return field
    .replace(AGGREGATE_PATTERN, '$1_$2_$3')
    .replace(/\./g, '_')
    .replace(/\,/g, '_')
    .replace(/_+$/, '');
}

/**
 * Check if a field name looks like an aggregate function or known aggregate alias.
 */
export function isAggregateField(field: string): boolean {
  return field.match(AGGREGATE_PATTERN) !== null;
}

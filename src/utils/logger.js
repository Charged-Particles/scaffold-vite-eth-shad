import _ from 'lodash';

// App Components
import { GLOBALS } from './globals';

const _supressComponents = [
  '🚀 Contracts',
];
const _isSupressed = componentName => (_.indexOf(_supressComponents, componentName) > -1);

const _logFn = (type, componentName, props) => {
  if (_isSupressed(componentName)) { return; }
  if (type === 'log' && !GLOBALS.DEBUG_MODE) { return; }
  if (type === 'info' && GLOBALS.IS_PRD) { return; }
  console[type](`[${componentName}]`, ...props);
};

const Logger = componentName => ({
  debug: (...props) => _logFn('log', componentName, props),
  info: (...props) => _logFn('info', componentName, props),
  warn: (...props) => _logFn('warn', componentName, props),
  error: (...props) => _logFn('error', componentName, props),
});

export { Logger };

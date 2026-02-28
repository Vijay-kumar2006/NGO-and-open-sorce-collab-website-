const isProd = process.env.NODE_ENV === 'production';

function format(level, msg) {
  const ts = new Date().toISOString();
  return `[${ts}] [${level}] ${msg}`;
}

export const info = (msg) => {
  if (!isProd) console.log(format('INFO', typeof msg === 'string' ? msg : JSON.stringify(msg)));
};

export const warn = (msg) => {
  console.warn(format('WARN', typeof msg === 'string' ? msg : JSON.stringify(msg)));
};

export const error = (msg) => {
  console.error(format('ERROR', typeof msg === 'string' ? msg : JSON.stringify(msg)));
};

export default { info, warn, error };

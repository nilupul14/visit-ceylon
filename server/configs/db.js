import mongoose from 'mongoose';
import dns from 'dns';
import { promises as dnsPromises } from 'dns';

const DEFAULT_DB = 'visitceylon';
const DEFAULT_DNS_SERVERS = ['8.8.8.8', '1.1.1.1'];

const configureDns = () => {
  if (configureDns.applied) return;
  const envServers = process.env.MONGODB_DNS_SERVERS;
  const servers = envServers
    ? envServers.split(',').map((s) => s.trim()).filter(Boolean)
    : DEFAULT_DNS_SERVERS;
  if (servers.length > 0) {
    dns.setServers(servers);
  }
  configureDns.applied = true;
};
configureDns.applied = false;

const appendDbName = (uri, dbName = DEFAULT_DB) => {
  if (!uri) throw new Error('MONGODB_URI is not set');
  try {
    const parsed = new URL(uri);
    if (!parsed.pathname || parsed.pathname === '/' || parsed.pathname === '') {
      parsed.pathname = `/${dbName}`;
    }
    return parsed.toString();
  } catch (err) {
    if (uri.includes('?')) {
      const [left, right] = uri.split('?');
      const withDb = /\/[^/?]+$/.test(left) ? left : `${left.replace(/\/?$/, '/')}${dbName}`;
      return `${withDb}?${right}`;
    }
    return uri.endsWith('/') ? `${uri}${dbName}` : `${uri}/${dbName}`;
  }
};

configureDns();

const originalLookup = dns.lookup.bind(dns);
dns.lookup = function patchedLookup(hostname, options, callback) {
  let opts = options;
  let cb = callback;

  if (typeof options === 'function') {
    cb = options;
    opts = {};
  } else if (!opts) {
    opts = {};
  }

  const family = opts.family === 6 ? 6 : 4;
  const resolver = family === 6 ? dnsPromises.resolve6 : dnsPromises.resolve4;
  resolver(hostname)
    .then((addresses) => {
      if (!addresses || addresses.length === 0) {
        throw new Error(`No DNS results for ${hostname}`);
      }
      if (opts.all) {
        const mapped = addresses.map((address) => ({ address, family }));
        cb(null, mapped);
      } else {
        cb(null, addresses[0], family);
      }
    })
    .catch((err) => {
      // fallback to original lookup in case of errors (to keep node behavior)
      originalLookup(hostname, options, callback);
    });
};

const connectDB = async () => {
  try {
    mongoose.connection.on('connected', () => console.log('Database is successfully connected'));
    const uri = appendDbName(process.env.MONGODB_URI);
    await mongoose.connect(uri);
  } catch (error) {
    console.error('MongoDB connection error:', error);
    if (error?.reason?.servers) {
      for (const [address, info] of error.reason.servers.entries()) {
        console.error('Server info:', address, info);
      }
    }
  }
};

export default connectDB;

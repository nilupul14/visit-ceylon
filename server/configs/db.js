import mongoose from 'mongoose';

const DEFAULT_DB = 'visitceylon';

const appendDbName = (uri, dbName = DEFAULT_DB) => {
  if (!uri) throw new Error('MONGODB_URI is not set');
  try {
    const parsed = new URL(uri);
    if (!parsed.pathname || parsed.pathname === '/' || parsed.pathname === '') {
      parsed.pathname = `/${dbName}`;
    }
    return parsed.toString();
  } catch (err) {
    // Fallback for non-WHATWG-compatible strings. Preserve query params if present.
    if (uri.includes('?')) {
      const [left, right] = uri.split('?');
      const withDb = /\/[^/?]+$/.test(left) ? left : `${left.replace(/\/?$/, '/')}${dbName}`;
      return `${withDb}?${right}`;
    }
    return uri.endsWith('/') ? `${uri}${dbName}` : `${uri}/${dbName}`;
  }
};

const connectDB = async () => {
  try {
    mongoose.connection.on('connected', () => console.log('Database connected'));
    const uri = appendDbName(process.env.MONGODB_URI);
    await mongoose.connect(uri);
  } catch (error) {
    console.log(error.message);
  }
};

export default connectDB;

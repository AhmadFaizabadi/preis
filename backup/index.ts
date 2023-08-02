import { serve } from '@hono/node-server'
import { Hono } from 'hono'
import Database from 'better-sqlite3';

const db = new Database('invoice.db');
db.pragma('journal_mode = WAL');
ensureTablesExist();

const app = new Hono()
console.log('HONO server is listening ...')
app.get('/', (c) => c.text('Hello Hono!'))
app.get('/data/:version', (c) => {
  const version =Number(c.req.param('version'))
  const baseVersion = getVersion()
  if (baseVersion > version){
    const stmt = db.prepare('SELECT * FROM basedata ORDER BY version DESC LIMIT 1');
    return stmt.get();
    }
})
app.post('/data',async (c) => {
  const data = await c.req.json()
  const stmt = db.prepare('insert or replace into basedata(version,supplies,prices) values (?,?,?)')
    stmt.run(data.version, data.supplies, data.prices)
    c.text('updated!', 201)
})

app.get('/hello', () => new Response('This is /hello'))

// Named parameter
app.get('/entry/:id', (c) => {
  const id = c.req.param('id')
  return c.text(`Your ID is ${id}`)
})
serve(app)


function getVersion(){
  const stmt = db.prepare('SELECT version FROM baseData ORDER BY version DESC LIMIT 1');
  return stmt.get();
}

// function saveVersions(versions){
//   const stmt = db.prepare('insert or replace into versions(supplies,prices) values (?,?)');
//   stmt.run(versions.supplies, versions.prices)
// }

function ensureTablesExist(){
  let existanceQuery = db.prepare(`SELECT EXISTS (
    SELECT
        name
    FROM
        sqlite_schema
    WHERE
        type='table' AND
        name='baseData'
    ) as e`);
    let exists = existanceQuery.get();
    if (exists.e!=1){
      let stmt = db.prepare('create table baseData(version INTEGER PRIMARY KEY, supplies TEXT, prices TEXT)');
      const r=stmt.run();
      console.log('db initialized.', r)
    }
}

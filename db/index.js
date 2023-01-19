import { writeFile, readFile } from 'node:fs/promises'
import path from 'node:path'
// Cuando usamos ESModules no podemos importar json directamente: import TEAM from '../db/team.json'
// hay que usar el import assert type:
// import TEAM from '../db/team.json' assert { tyoe: 'json' } => en este caso el inter no lo soporta, así que necesesitamos:
const DB_PATH = path.join(process.cwd(), './db/')
// Esto es un TOP LEVEL AWAIT
// const TEAM = await readFile(`${DB_PATH}/team.json`, 'utf-8').then(JSON.parse)
// JSON.parse() => convierte lo que traemos a json
// const PRESIDENTS = await readFile(`${DB_PATH}/presidents.json`, 'utf-8').then(JSON.parse)

async function readDBFile (dbName) {
  return await readFile(`${DB_PATH}/${dbName}.json`, 'utf-8').then(JSON.parse)
}

export const TEAM = await readDBFile('team')
export const PRESIDENTS = await readDBFile('presidents')

// Creo una ruta relativa de fichero
// cwd => current working directory
// const filePath = path.join(process.cwd(), './db/leaderboard.json') => ya no lo necesitamos
export async function writeDBFile (dbName, data) {
  return await writeFile(`${DB_PATH}/${dbName}.json`, JSON.stringify(data, null, 2), 'utf-8')
}

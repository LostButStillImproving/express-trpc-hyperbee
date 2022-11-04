// @ts-ignore
import Hyperbee from "hyperbee";
import cuid from "cuid";
// @ts-ignore
import Corestore from "corestore";

const store = new Corestore('./my-storage')
store.ready().then(() => console.log("ready"))
const core = store.get({name: "my-db"})
const db = new Hyperbee(core, {
    keyEncoding: 'utf-8',
    valueEncoding: 'json'
})

export async function addUser (body: {name: string, age: number}) {

    const id = "a"
    const userFolder = db.sub(id)
    userFolder.put("answers", body)
}

export async function getUsers () {
    var users: any[] = []
    await new Promise(r => {
        db.createReadStream()
            .on('data', (entry: { value: any; }) => users.push(entry.value))
            .on('end', r)
    })

    users.forEach((user: any) => {
        console.log(user)
    })
    return users
}

export async function getUsersById (id: string) {
    const userFolder = db.sub(id)
    var userInformation: any[] = []

    await new Promise(r => {
        userFolder.createReadStream()
            .on('data', (entry: { value: any; }) => userInformation.push(entry.value))
            .on('end', r)
    })

    return userInformation
}

import child_process from 'child_process'
import path from 'path'
import fs from 'fs'

export class LibNFC {
    private working: boolean
    private command: string
    private readArgs: string[]
    private writeArgs: string[]
    private dumpFilePath: string

    constructor(binPath: string, dumpFilePath: string) {
        this.working = false
        this.command = path.join(binPath, 'nfc-mfclassic')
        this.readArgs = ['r', 'a', 'u', dumpFilePath]
        this.writeArgs = ['w', 'a', 'u', dumpFilePath]
        this.dumpFilePath = dumpFilePath
    }

    checkCard(): Promise<string> {
        return new Promise((resolve, reject) => {
            if (this.working) {
                reject('Busy')
                return
            }
            this.working = true
            let stdout = ''
            const nfcMfclassic = child_process.spawn(this.command, this.readArgs)
            nfcMfclassic.stdout.on('data', (data: string) => { stdout += data })
            nfcMfclassic.on('close', (code: number) => {
                this.working = false
                if (code !== 0) {
                    reject(`Abnormal exit with ${code}`)
                    return
                }
                const pattern = /UID\s\(NFCID1\)\:\s([0-9A-Fa-f]{2})\s\s([0-9A-Fa-f]{2})\s\s([0-9A-Fa-f]{2})\s\s([0-9A-Fa-f]{2})/
                const match = stdout.match(pattern)
                if (!match) {
                    reject('No UID found')
                    return
                }
                resolve((match[1] + match[2] + match[3] + match[4]).toUpperCase())
            })
        })
    }

    private readCard(): Promise<undefined> {
        return new Promise((resolve, reject) => {
            if (this.working) {
                reject('Busy')
                return
            }
            this.working = true
            const nfcMfclassic = child_process.spawn(this.command, this.readArgs)
            nfcMfclassic.on('close', (code: number) => {
                this.working = false
                if (code !== 0) {
                    reject(`Abnormal exit with ${code}`)
                    return
                }
                resolve(undefined)
            })
        })
    }

    private writeCard(): Promise<undefined> {
        return new Promise((resolve, reject) => {
            if (this.working) {
                reject('Busy')
                return
            }
            this.working = true
            const nfcMfclassic = child_process.spawn(this.command, this.writeArgs)
            nfcMfclassic.on('close', (code: number) => {
                this.working = false
                if (code !== 0) {
                    reject(`Abnormal exit with ${code}`)
                    return
                }
                resolve(undefined)
            })
        })
    }

    private parseCardDump(): Promise<string> {
        return new Promise((resolve, reject) => {
            fs.readFile(this.dumpFilePath, (err, data) => {
                if (err) {
                    reject(err)
                    return
                }
                const stringLength = data.readUint8(0x40)
                const stringData = data.subarray(0x41, 0x41 + stringLength)
                resolve(stringData.toString())
            })
        })
    }

    private packCardDump(string: string): Promise<undefined> {
        return new Promise((resolve, reject) => {
            fs.readFile(this.dumpFilePath, (err, data) => {
                if (err) {
                    reject(err)
                    return
                }
                const stringLength = string.length
                const stringData = new TextEncoder().encode(string)
                data.writeUint8(stringLength, 0x40)
                data.set(stringData, 0x41)
                fs.writeFile(this.dumpFilePath, data, err => {
                    if (err) {
                        reject(err)
                        return
                    }
                    resolve(undefined)
                })
            })
        })
    }

    readCardData(): Promise<string> {
        return this.readCard().then(() => this.parseCardDump())
    }

    writeCardData(string: string): Promise<undefined> {
        return this.packCardDump(string).then(() => this.writeCard())
    }
}

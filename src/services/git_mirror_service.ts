import { execSync } from "child_process"

export default class GitMirrorService {
    cloneRepository(url: string, path: string, username: string, password: string) {
        const commands = [
            `git config user.name ${username}`,
            `git config user.password ${password}`,
            `git clone ${url} ${path}`
        ]

        const final_command = commands.join(' && ')
        execSync(final_command, { stdio: 'inherit' })
    }

    pushMirror(url: string, path: string, username: string, password: string) {
        const commands = [
            `git config user.name ${username}`,
            `git config user.password ${password}`,
            `cd ${path}`,
            `git remote add mirror ${url}`,
            `git push --mirror mirror`
        ]

        const final_command = commands.join(' && ')
        execSync(final_command, { stdio: 'inherit' })
    }

    deleteRepository(path: string) {
        execSync(`rm -rf ${path}`)
    }
}
import { execSync as exec } from 'child_process';
import * as path from 'path';

const distPath = path.join(__dirname, '../dist');

function run(command: string, options?: any) {
    console.log(command);
    exec(command, options);
}

run('yarn run build');
run('git add . --force', { cwd: distPath });
run('git commit -m "gh-pages"', { cwd: distPath });
run('git push origin gh-pages --force', { cwd: distPath });
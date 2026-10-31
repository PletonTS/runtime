import * as path from "node:path";
import {stat, rm, mkdir} from "node:fs/promises"

export class PletonProject {
  private readonly absEntrypointPath: string;
  private readonly absBuildPath: string;

  constructor(public readonly cwd: string, private readonly _entrypoint: string) {
    this.absEntrypointPath = path.resolve(cwd, _entrypoint)
    this.absBuildPath = path.resolve(cwd, "build")
  }

  public get entrypoint() {
    return this.absEntrypointPath;
  }

  public get entrypointBuildOutput() {
    return path.join(this.absBuildPath, "app.mjs")
  }

  public get initPath() {
    return path.join(this.absBuildPath, "init.mjs");
  }

  public async ensureValid() {
    const projectDirStats = await stat(this.cwd).catch(() => null);
    if (!projectDirStats || !projectDirStats.isDirectory()) throw new Error("Invalid project directory");

    const entrypointFileStats = await stat(this.absEntrypointPath).catch(() => null);
    if (!entrypointFileStats || !entrypointFileStats.isFile()) throw new Error("Invalid project entrypoint");
  }

  public async initBuild(): Promise<string> {
    await rm(this.absBuildPath, {
      recursive: true,
      force: true
    }).catch(() => {
    })

    await mkdir(this.absBuildPath);

    return this.absBuildPath;
  }
}
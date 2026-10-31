import {PletonProject} from "./PletonProject";
import {PletonBuilder} from "@pleton/builder";
import {spawn} from "node:child_process";
import {pathToFileURL} from "node:url";
import {writeFile} from "node:fs/promises"
import * as path from "node:path";

export class PletonRuntime {
  public static async run(project: PletonProject) {
    await project.ensureValid()
    await project.initBuild()
    await PletonBuilder.compile(project.entrypoint, project.entrypointBuildOutput)

    await writeFile(project.initPath, `
import * as app from "./${path.relative(path.dirname(project.initPath), project.entrypointBuildOutput)}";
import { PletonInitializer } from "@pleton/initializer";

PletonInitializer.init(app)`)

    const tsx = pathToFileURL(require.resolve("tsx")).href
    const child = spawn(process.execPath, ["--import", tsx, project.initPath], {
      cwd: project.cwd,
      stdio: "inherit"
    })

    child.on("exit", (code, signal) => process.exit(signal ? 1 : code ?? 0))
  }
}

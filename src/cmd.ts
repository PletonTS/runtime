#!/usr/bin/env node

import {PletonRuntime} from "./classes/PletonRuntime";
import {PletonProject} from "./classes/PletonProject";
import * as process from "node:process";

void PletonRuntime.run(new PletonProject(process.cwd(), process.argv[2] ?? "./index.ts"))
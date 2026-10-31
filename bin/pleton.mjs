#!/usr/bin/env node
import { register } from "tsx/esm/api";
import { register as registerCjs } from "tsx/cjs/api";

register();
registerCjs();
await import("../src/cmd.ts");
